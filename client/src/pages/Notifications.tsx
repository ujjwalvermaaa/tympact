import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, CheckCircle, AlertCircle, Star, Users, TrendingUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

interface Notification {
  id: string;
  type: 'task' | 'trade' | 'mission' | 'reward' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching notifications
    const fetchNotifications = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'task',
          title: 'New Task Available',
          message: 'Ravi Verma posted a new mentoring task: "Frontend Development Guidance" - 2 hours, ₹500',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high',
          actionUrl: '/marketplace'
        },
        {
          id: '2',
          type: 'trade',
          title: 'Trade Completed',
          message: 'Your time trade with Anjali Gupta has been completed successfully. You earned 3 time credits!',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          priority: 'medium',
          actionUrl: '/time-wallet'
        },
        {
          id: '3',
          type: 'mission',
          title: 'Mission Unlocked',
          message: 'New mission available: "Community Helper" - Help 5 new users and earn 50 XP + TimeProof NFT',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true,
          priority: 'medium',
          actionUrl: '/missions'
        },
        {
          id: '4',
          type: 'reward',
          title: 'Reward Earned',
          message: 'Congratulations! You\'ve earned the "Trusted Mentor" badge for completing 10 mentoring sessions.',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          read: true,
          priority: 'low',
          actionUrl: '/rewards'
        },
        {
          id: '5',
          type: 'system',
          title: 'System Update',
          message: 'Tympact platform has been updated with new features: Voice Input and Enhanced Emotion Detection.',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          read: true,
          priority: 'low'
        }
      ];
      
      setNotifications(mockNotifications);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'high') return notif.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task': return <TrendingUp className="h-5 w-5" />;
      case 'trade': return <Users className="h-5 w-5" />;
      case 'mission': return <Star className="h-5 w-5" />;
      case 'reward': return <CheckCircle className="h-5 w-5" />;
      case 'system': return <AlertCircle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay updated with your latest activities and opportunities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              {unreadCount} unread
            </Badge>
            {highPriorityCount > 0 && (
              <Badge variant="destructive" className="text-sm">
                {highPriorityCount} high priority
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'high', label: 'High Priority', count: highPriorityCount }
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key as typeof filter)}
              className="relative"
            >
              {label}
              {count > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'all' 
                    ? 'You\'re all caught up! Check back later for new updates.'
                    : `No ${filter} notifications at the moment.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card 
                    className={`transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'ring-2 ring-primary/20' : ''
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-full ${
                          notification.priority === 'high' ? 'bg-red-100 text-red-600' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className={`font-semibold text-gray-900 dark:text-white ${
                                !notification.read ? 'font-bold' : ''
                              }`}>
                                {notification.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          </div>
                          {notification.actionUrl && (
                            <div className="mt-3">
                              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                                View Details →
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsPage; 