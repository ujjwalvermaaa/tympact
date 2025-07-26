import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';

// Define the structure of a Trade object
interface Trade {
  id: string;
  requesterId: string;
  recipientId: string;
  hours: number;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  createdAt: string;
  // Assuming you might add these later
  requesterName?: string;
  recipientName?: string;
}

// Main component for displaying user's trades
export default function MyTrades() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async () => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('/api/v1/trades/history', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch trades.');
      
      const result = await response.json();
      setTrades(result.data || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [user]);

  const handleTradeAction = async (tradeId: string, action: 'accept' | 'reject' | 'cancel') => {
    if (!auth.currentUser) return;
    const token = await auth.currentUser.getIdToken();
    let url = `/api/v1/trades/${tradeId}`;
    let method = 'DELETE'; // For 'cancel'
    let body = null;

    if (action === 'accept' || action === 'reject') {
      url = `/api/v1/trades/${tradeId}/respond`;
      method = 'PATCH';
      body = JSON.stringify({ action });
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!response.ok) throw new Error(`Failed to ${action} trade.`);
      
      // Refresh trade list after action
      fetchTrades(); 
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`An unknown error occurred while trying to ${action} the trade.`);
      }
    }
  };

  if (loading) return <div className="text-center p-8">Loading trades...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  // Filter trades into categories
  const pending = trades.filter(t => t.status === 'pending');
  const active = trades.filter(t => t.status === 'accepted');
  const history = trades.filter(t => !['pending', 'accepted'].includes(t.status));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-8">My Trades</h2>
        <div className="flex flex-col gap-8">
          <Section title="Pending Trades" trades={pending} currentUserId={user?.id} onAction={handleTradeAction} />
          <Section title="Active Trades" trades={active} currentUserId={user?.id} />
          <Section title="Trade History" trades={history} currentUserId={user?.id} />
        </div>
      </div>
    </div>
  );
}

// Section component to render a list of trades
function Section({ title, trades, currentUserId, onAction }: { title: string; trades: Trade[]; currentUserId?: string; onAction?: (tradeId: string, action: 'accept' | 'reject' | 'cancel') => void; }) {
  if (!trades.length) {
    return (
      <div>
        <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400">No trades in this category.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h3>
      <div className="space-y-4">
        {trades.map(trade => (
          <TradeCard key={trade.id} trade={trade} currentUserId={currentUserId} onAction={onAction} />
        ))}
      </div>
    </div>
  );
}

// TradeCard component for a single trade item
function TradeCard({ trade, currentUserId, onAction }: { trade: Trade; currentUserId?: string; onAction?: (tradeId: string, action: 'accept' | 'reject' | 'cancel') => void; }) {
  const isRecipient = trade.recipientId === currentUserId;
  const isRequester = trade.requesterId === currentUserId;

  const getPartnerName = () => {
    if (isRecipient) return trade.requesterName || 'Another User';
    if (isRequester) return trade.recipientName || 'Another User';
    return 'N/A';
  };

  return (
    <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-grow">
        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{trade.description || 'Trade for Time Credits'}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">With: {getPartnerName()}</p>
        <p className="text-xs text-gray-400">{new Date(trade.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="flex flex-col items-start sm:items-end gap-2">
        <span className={`font-semibold text-lg ${isRequester ? 'text-red-500' : 'text-green-500'}`}>
          {isRequester ? '-' : '+'} {trade.hours} TC
        </span>
        <span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 capitalize">{trade.status}</span>
      </div>
      {trade.status === 'pending' && onAction && (
        <div className="flex gap-2 mt-2 sm:mt-0">
          {isRecipient && (
            <>
              <button onClick={() => onAction(trade.id, 'accept')} className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Accept</button>
              <button onClick={() => onAction(trade.id, 'reject')} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
            </>
          )}
          {isRequester && (
            <button onClick={() => onAction(trade.id, 'cancel')} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">Cancel</button>
          )}
        </div>
      )}
    </div>
  );
} 