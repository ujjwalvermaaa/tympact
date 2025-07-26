import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  Target, 
  Calendar,
  CheckCircle,
  Timer,
  Star,
  Award,
  Zap,
  Heart,
  Plus,
  ArrowRight,
  BarChart3,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';

// Simplified Trade interface for dashboard
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

export default function Dashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTrades = async () => {
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
        console.error('Failed to fetch trades:', error);
      }
      setLoading(false);
    };

    fetchTrades();
  }, [user]);

  if (!user) {
    return <div>Loading dashboard...</div>;
  }

  const activeTrades = trades.filter(t => t.status === 'pending' || t.status === 'accepted');

  const quickStats = [
    {
      label: 'Time Balance',
      value: `${user.timeBalance.toFixed(2)} hrs`,
      icon: '⏳',
      color: 'text-blue-500',
    },
    {
      label: 'Community Rating',
      value: `${user.rating.toFixed(1)} / 5.0`,
      icon: '⭐',
      color: 'text-yellow-500',
    },
    {
      label: 'Active Trades',
      value: activeTrades.length,
      icon: '🤝',
      color: 'text-green-500',
    },
    {
      label: 'Completed Trades',
      value: trades.filter(t => t.status === 'completed').length,
      icon: '✅',
      color: 'text-purple-500',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'task_completed',
      title: 'Completed: Social Media Design',
      time: '2 hours ago',
      reward: '3 hrs + ₹300',
      icon: '✅',
      color: 'text-green-500'
    },
    {
      id: 2,
      type: 'trade_started',
      title: 'Started: Website Bug Fixes',
      time: '5 hours ago',
      reward: '2 hrs + ₹500',
      icon: '⏳',
      color: 'text-blue-500'
    },
    {
      id: 3,
      type: 'mission_completed',
      title: 'Mission Complete: First Time Trade',
      time: '1 day ago',
      reward: '50 XP earned',
      icon: '🏆',
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-muted-foreground">
                {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={stat.label} className="p-6 rounded-xl shadow bg-white dark:bg-gray-900 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${stat.color}`}>{stat.icon}</span>
                <div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                  <div className="text-xl font-bold">{stat.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 rounded-xl shadow bg-white dark:bg-gray-900">
              <h3 className="text-2xl font-bold mb-4">Active Trades</h3>
              {loading ? <p>Loading trades...</p> : activeTrades.length > 0 ? (
                activeTrades.map(trade => {
                  const partnerName = trade.requesterId === (user as any).uid ? trade.recipientName : trade.requesterName;
                  return (
                    <div key={trade.id} className="p-4 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 shadow mb-3 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">{trade.description || 'Time Credit Trade'}</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">With: {partnerName || 'Unknown User'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600 dark:text-blue-300">{trade.hours} hrs</p>
                        <p className="text-xs text-gray-500 capitalize">{trade.status}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-500">No active trades at the moment.</p>
              )}
            </div>

            <div className="p-6 rounded-xl shadow bg-white dark:bg-gray-900">
              <h3 className="text-2xl font-bold mb-4">Missions</h3>
              <p className="text-gray-500 mb-4">Complete missions to earn XP and rewards!</p>
              <Button asChild>
                <Link to="/missions">
                  View Missions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="p-6 rounded-xl shadow bg-white dark:bg-gray-900">
              <h3 className="text-2xl font-bold mb-4">Recent Activity</h3>
              {loading ? <p>Loading activity...</p> : trades.slice(0, 5).map(trade => (
                <div key={trade.id} className="flex items-center gap-4 mb-3">
                  <span className="text-xl">{trade.status === 'completed' ? '✅' : '⏳'}</span>
                  <div>
                    <p className="font-medium">{trade.description || 'Trade'}</p>
                    <p className="text-xs text-gray-500">{new Date(trade.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="ml-auto font-medium text-blue-500">{trade.hours} hrs</p>
                </div>
              ))}
              <Button variant="outline" asChild className="mt-4">
                <Link to="/time-wallet">View All Activity</Link>
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-xl shadow bg-white dark:bg-gray-900">
              <h3 className="text-2xl font-bold mb-4">XP & Levels</h3>
              <p className="text-gray-500 mb-4">Track your progress and unlock achievements!</p>
              <Button variant="outline" asChild>
                <Link to="/rewards">View Rewards</Link>
              </Button>
            </div>
            <div className="p-6 rounded-xl shadow bg-white dark:bg-gray-900">
              <h3 className="text-2xl font-bold mb-4">Daily Journal</h3>
              <p className="text-gray-500 mb-4">Track your focus and emotions with our journal feature.</p>
              <Button variant="outline" asChild>
                <Link to="/focus-journal">Open Journal</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}