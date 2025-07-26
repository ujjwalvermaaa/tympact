import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiSend, FiRepeat } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';

// Type Definitions
interface Trade {
  id: string;
  requesterId: string;
  recipientId: string;
  requesterName?: string;
  recipientName?: string;
  hours: number;
  description?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string; // ISO date string
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode | string | number;
  subtitle?: string;
}

interface CreateTradeFormProps {
  onTradeCreated: () => void;
}

interface TransactionHistoryProps {
  trades: Trade[];
  loading: boolean;
  currentUserId: string | undefined;
}

const TimeWalletPage: React.FC = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTradeHistory = async () => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('/api/v1/trades/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.status === 'success') {
        setTrades(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch trade history:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTradeHistory();
  }, [user]);

  const completedTrades = trades.filter(t => t.status === 'completed').length;

  return (
    <div className="container mx-auto px-4 py-16 text-gray-800 dark:text-gray-200">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-4">Time Wallet</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Track your earnings, manage your time credits, and see the impact you’re making in the Indian community.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <StatCard icon={<FiClock />} title="Current Balance" value={user?.timeBalance || 0} subtitle="Time Credits" />
        <StatCard icon={<FiRepeat />} title="Completed Trades" value={completedTrades} subtitle="Transactions" />
        <StatCard icon={<FiSend />} title="Send Credits" value={<CreateTradeForm onTradeCreated={fetchTradeHistory} />} />
      </div>

      <TransactionHistory trades={trades} loading={loading} currentUserId={user ? (user as any).uid : undefined} />
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center flex flex-col justify-between">
    <div>
      <div className="w-12 h-12 mx-auto text-purple-500 mb-4">{icon}</div>
      <p className="text-xl text-gray-500 dark:text-gray-400">{title}</p>
    </div>
    <div>
      <div className="text-5xl font-bold text-gray-900 dark:text-white">{value}</div>
      {subtitle && <p className="text-lg text-gray-600 dark:text-gray-300">{subtitle}</p>}
    </div>
  </motion.div>
);

const CreateTradeForm: React.FC<CreateTradeFormProps> = ({ onTradeCreated }) => {
  const [recipientId, setRecipientId] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTrade = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setError('');

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('/api/v1/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipientId, hours: Number(hours), description }),
      });
      const result = await response.json();
      if (result.status !== 'success') throw new Error(result.message || 'Failed to create trade.');
      
      setRecipientId('');
      setHours('');
      setDescription('');
      onTradeCreated();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <form onSubmit={handleTrade} className="flex flex-col gap-2 mt-4">
      <input type="text" placeholder="Recipient User ID" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} className="p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required />
      <input type="number" placeholder="Hours" value={hours} onChange={(e) => setHours(e.target.value)} className="p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required />
      <input type="text" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
      <button type="submit" className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 font-semibold">Send</button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ trades, loading, currentUserId }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Transaction History</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Details</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center p-4">Loading...</td></tr>
          ) : trades.length === 0 ? (
            <tr><td colSpan={5} className="text-center p-4">No transactions yet.</td></tr>
          ) : (
            trades.map((trade) => {
              const isSender = trade.requesterId === currentUserId;
              const type = isSender ? 'Send' : 'Receive';
              const partnerName = isSender ? trade.recipientName : trade.requesterName;
              const details = partnerName ? `${isSender ? 'To' : 'From'}: ${partnerName}` : (trade.description || 'Time Credit Transfer');

              return (
                <motion.tr key={trade.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isSender ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{type}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    <p className="font-medium">{details}</p>
                    {trade.description && <p className="text-sm text-gray-500">{trade.description}</p>}
                  </td>
                  <td className={`py-4 px-4 font-medium ${isSender ? 'text-red-600' : 'text-green-600'}`}>{isSender ? '-' : '+'} {trade.hours} TC</td>
                  <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{new Date(trade.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-gray-500 dark:text-gray-400 capitalize">{trade.status}</td>
                </motion.tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default TimeWalletPage;
