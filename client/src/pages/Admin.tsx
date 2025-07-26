import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, AlertTriangle, CheckCircle, XCircle, TrendingUp, Activity, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingReports: number;
  totalTasks: number;
  completedTasks: number;
  totalTrades: number;
  platformRevenue: number;
}

interface Report {
  id: string;
  type: 'user' | 'task' | 'trade';
  reporterName: string;
  reportedItem: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const AdminPage: React.FC = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingReports: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalTrades: 0,
    platformRevenue: 0
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate admin data
      setStats({
        totalUsers: 1247,
        activeUsers: 892,
        pendingReports: 8,
        totalTasks: 456,
        completedTasks: 342,
        totalTrades: 789,
        platformRevenue: 45600
      });

      setReports([
        {
          id: '1',
          type: 'user',
          reporterName: 'Anjali Gupta',
          reportedItem: 'Ravi Verma',
          reason: 'Inappropriate behavior during task completion',
          status: 'pending',
          timestamp: new Date().toISOString(),
          severity: 'medium'
        },
        {
          id: '2',
          type: 'task',
          reporterName: 'Neha Rathi',
          reportedItem: 'Frontend Development Task',
          reason: 'Task description contains misleading information',
          status: 'reviewed',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          severity: 'low'
        },
        {
          id: '3',
          type: 'trade',
          reporterName: 'Aman Singh',
          reportedItem: 'Time Credit Trade #456',
          reason: 'Dispute over task completion quality',
          status: 'resolved',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          severity: 'high'
        }
      ]);
      
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  const handleReportAction = async (reportId: string, action: 'approve' | 'reject' | 'resolve') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: action === 'approve' ? 'resolved' : action === 'reject' ? 'reviewed' : 'resolved' }
            : report
        )
      );
      
      toast({
        title: `Report ${action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Resolved'}`,
        description: `Action completed successfully.`,
      });
      
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Panel
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Manage Tympact platform, moderate content, and monitor community health
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
            { label: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'text-green-500' },
            { label: 'Pending Reports', value: stats.pendingReports, icon: AlertTriangle, color: 'text-orange-500' },
            { label: 'Platform Revenue', value: formatCurrency(stats.platformRevenue), icon: TrendingUp, color: 'text-purple-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Community Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reports...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No pending reports
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      All community reports have been reviewed and resolved.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className="capitalize">
                                {report.type}
                              </Badge>
                              <Badge className={getSeverityColor(report.severity)}>
                                {report.severity}
                              </Badge>
                              <Badge className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Reported by: {report.reporterName}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Item: {report.reportedItem}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                              Reason: {report.reason}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(report.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {report.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleReportAction(report.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReportAction(report.id, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">User Verification</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Manage user verification requests and trust scores
                      </p>
                      <Button variant="outline" size="sm">
                        View Requests
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Suspensions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Handle user suspensions and appeals
                      </p>
                      <Button variant="outline" size="sm">
                        Manage Suspensions
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bulk Actions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Perform bulk operations on user accounts
                      </p>
                      <Button variant="outline" size="sm">
                        Bulk Operations
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Task Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">Task Statistics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Tasks</span>
                          <span className="font-medium">{stats.totalTasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Completed Tasks</span>
                          <span className="font-medium">{stats.completedTasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                          <span className="font-medium">
                            {stats.totalTasks > 0 ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Review Pending Tasks
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Moderate Categories
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          View Disputed Tasks
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Platform Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Growth Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Monthly Active Users</span>
                          <span className="font-medium">+12.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Task Completion Rate</span>
                          <span className="font-medium">+8.3%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Revenue Growth</span>
                          <span className="font-medium">+15.2%</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Community Health</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Trust Score Average</span>
                          <span className="font-medium">4.7/5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Report Resolution Time</span>
                          <span className="font-medium">2.3 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">User Satisfaction</span>
                          <span className="font-medium">92%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      Export Data
                    </Button>
                    <Button variant="outline">
                      Generate Report
                    </Button>
                    <Button variant="outline">
                      View Detailed Analytics
                    </Button>
                  </div>
      </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminPage; 