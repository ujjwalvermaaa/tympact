import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Check, ExternalLink, BookOpen, Zap, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  response: string;
  example: string;
}

const ApiDocsPage: React.FC = () => {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const apiEndpoints: Record<string, ApiEndpoint[]> = {
    'Authentication': [
      {
        method: 'POST',
        path: '/api/v1/auth/register',
        description: 'Register a new user account',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password (min 6 chars)' },
          { name: 'name', type: 'string', required: true, description: 'User full name' },
          { name: 'city', type: 'string', required: false, description: 'User city location' }
        ],
        response: '201 Created',
        example: `{
  "status": "success",
  "data": {
    "user": {
      "uid": "user123",
      "email": "ravi@example.com",
      "name": "Ravi Verma",
      "city": "Mumbai"
    },
    "token": "eyJhbGciOiJSUzI1NiIs..."
  }
}`
      },
      {
        method: 'POST',
        path: '/api/v1/auth/login',
        description: 'Authenticate user and get access token',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password' }
        ],
        response: '200 OK',
        example: `{
  "status": "success",
  "data": {
    "user": {
      "uid": "user123",
      "email": "ravi@example.com",
      "name": "Ravi Verma",
      "timeBalance": 12.5,
      "rating": 4.8
    },
    "token": "eyJhbGciOiJSUzI1NiIs..."
  }
}`
      }
    ],
    'Tasks': [
      {
        method: 'GET',
        path: '/api/v1/tasks',
        description: 'Get all available tasks with filtering',
        parameters: [
          { name: 'status', type: 'string', required: false, description: 'Filter by task status (open, in-progress, completed)' },
          { name: 'category', type: 'string', required: false, description: 'Filter by task category' },
          { name: 'location', type: 'string', required: false, description: 'Filter by location' },
          { name: 'page', type: 'number', required: false, description: 'Page number for pagination' },
          { name: 'limit', type: 'number', required: false, description: 'Number of tasks per page' }
        ],
        response: '200 OK',
        example: `{
  "status": "success",
  "results": 10,
  "data": {
    "tasks": [
      {
        "id": "task123",
        "title": "Frontend Development Mentoring",
        "description": "Help with React and TypeScript",
        "category": "Development",
        "hours": 2,
        "payment": 500,
        "status": "open",
        "createdBy": "user456",
        "creator": {
          "name": "Anjali Gupta",
          "rating": 4.9
        }
      }
    ]
  }
}`
      },
      {
        method: 'POST',
        path: '/api/v1/tasks',
        description: 'Create a new task',
        parameters: [
          { name: 'title', type: 'string', required: true, description: 'Task title' },
          { name: 'description', type: 'string', required: true, description: 'Task description' },
          { name: 'category', type: 'string', required: true, description: 'Task category' },
          { name: 'hours', type: 'number', required: true, description: 'Estimated hours required' },
          { name: 'payment', type: 'number', required: false, description: 'Monetary payment in INR' },
          { name: 'location', type: 'string', required: false, description: 'Task location' }
        ],
        response: '201 Created',
        example: `{
  "status": "success",
  "data": {
    "task": {
      "id": "task789",
      "title": "UI/UX Design Review",
      "description": "Review and improve website design",
      "category": "Design",
      "hours": 3,
      "payment": 800,
      "status": "open",
      "createdBy": "user123",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  }
}`
      }
    ],
    'Trades': [
      {
        method: 'GET',
        path: '/api/v1/trades/history',
        description: 'Get user trade history',
        parameters: [
          { name: 'status', type: 'string', required: false, description: 'Filter by trade status' },
          { name: 'page', type: 'number', required: false, description: 'Page number for pagination' }
        ],
        response: '200 OK',
        example: `{
  "status": "success",
  "data": [
    {
      "id": "trade123",
      "description": "Frontend Development Mentoring",
      "hours": 2,
      "status": "completed",
      "createdAt": "2025-01-10T14:00:00Z",
      "completedAt": "2025-01-10T16:00:00Z"
    }
  ]
}`
      },
      {
        method: 'POST',
        path: '/api/v1/trades',
        description: 'Create a new time trade',
        parameters: [
          { name: 'taskId', type: 'string', required: true, description: 'ID of the task to trade' },
          { name: 'hours', type: 'number', required: true, description: 'Hours to trade' },
          { name: 'message', type: 'string', required: false, description: 'Trade proposal message' }
        ],
        response: '201 Created',
        example: `{
  "status": "success",
  "data": {
    "trade": {
      "id": "trade456",
      "taskId": "task123",
      "hours": 2,
      "status": "pending",
      "createdAt": "2025-01-15T11:00:00Z"
    }
  }
}`
      }
    ],
    'Community': [
      {
        method: 'GET',
        path: '/api/v1/community/stats',
        description: 'Get community statistics',
        response: '200 OK',
        example: `{
  "status": "success",
  "data": {
    "activeMembers": 1247,
    "tasksCompleted": 342,
    "projectsCollaboratedOn": 58,
    "totalTimeTraded": 1245.5
  }
}`
      },
      {
        method: 'GET',
        path: '/api/v1/community/activity',
        description: 'Get recent community activity',
        parameters: [
          { name: 'limit', type: 'number', required: false, description: 'Number of activities to return' }
        ],
        response: '200 OK',
        example: `{
  "status": "success",
  "data": [
    {
      "user": "Ravi Verma",
      "action": "completed a mentoring session",
      "time": "2025-01-15T10:30:00Z"
    }
  ]
}`
      }
    ]
  };

  const copyToClipboard = async (code: string, endpoint: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(endpoint);
      setTimeout(() => setCopiedCode(null), 2000);
      
      toast({
        title: "Code Copied!",
        description: "API example copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the code manually.",
        variant: "destructive"
      });
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'POST': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PUT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
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
            API Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Complete API reference for integrating with Tympact's time economy platform. 
            Build applications, automate workflows, and extend the platform's capabilities.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Base URL</h4>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm">
                  https://api.tympact.com/v1
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Authentication</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  All API requests require authentication using Firebase JWT tokens. Include the token in the Authorization header:
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm">
                  Authorization: Bearer YOUR_JWT_TOKEN
                </div>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Postman Collection
                </Button>
                <Button variant="outline" size="sm">
                  <Code className="h-4 w-4 mr-2" />
                  Download SDK
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Tabs defaultValue="Authentication" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {Object.keys(apiEndpoints).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(apiEndpoints).map(([category, endpoints]) => (
            <TabsContent key={category} value={category}>
              <div className="space-y-6">
                {endpoints.map((endpoint, index) => (
                  <motion.div
                    key={`${category}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge className={getMethodColor(endpoint.method)}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {endpoint.path}
                            </code>
                          </div>
                          <Badge variant="outline">
                            {endpoint.response}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                          {endpoint.description}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Parameters */}
                        {endpoint.parameters && endpoint.parameters.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Parameters</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2">Name</th>
                                    <th className="text-left py-2">Type</th>
                                    <th className="text-left py-2">Required</th>
                                    <th className="text-left py-2">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {endpoint.parameters.map((param) => (
                                    <tr key={param.name} className="border-b">
                                      <td className="py-2 font-mono">{param.name}</td>
                                      <td className="py-2">{param.type}</td>
                                      <td className="py-2">
                                        <Badge variant={param.required ? "default" : "secondary"}>
                                          {param.required ? "Yes" : "No"}
                                        </Badge>
                                      </td>
                                      <td className="py-2">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Example */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 dark:text-white">Example Response</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(endpoint.example, `${category}-${index}`)}
                            >
                              {copiedCode === `${category}-${index}` ? (
                                <Check className="h-4 w-4 mr-2" />
                              ) : (
                                <Copy className="h-4 w-4 mr-2" />
                              )}
                              {copiedCode === `${category}-${index}` ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <pre className="text-sm">
                              <code>{endpoint.example}</code>
                            </pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Rate Limiting & Errors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Rate Limiting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Free Tier</span>
                  <span className="font-medium">100 requests/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pro Tier</span>
                  <span className="font-medium">1000 requests/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Enterprise</span>
                  <span className="font-medium">Custom limits</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Error Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">400</span>
                  <span className="font-medium">Bad Request</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">401</span>
                  <span className="font-medium">Unauthorized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">403</span>
                  <span className="font-medium">Forbidden</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">429</span>
                  <span className="font-medium">Rate Limited</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support */}
        <Card className="mt-8">
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Need Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our developer support team is here to help you integrate with Tympact.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Developer Forum
              </Button>
              <Button variant="outline">
                <Code className="h-4 w-4 mr-2" />
                Code Examples
              </Button>
              <Button>
                Contact Support
              </Button>
      </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ApiDocsPage; 