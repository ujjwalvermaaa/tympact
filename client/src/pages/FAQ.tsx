import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, HelpCircle, BookOpen, Shield, Users, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'account' | 'tasks' | 'payments' | 'safety' | 'technical';
  tags: string[];
}

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | FAQItem['category']>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const faqData: FAQItem[] = [
    // General Questions
    {
      id: '1',
      question: 'What is Tympact and how does it work?',
      answer: 'Tympact is India\'s first hybrid time economy platform where you can trade your time and skills for time credits or money. Users can post tasks, offer services, and connect with others in a trusted community environment. Think of it as a marketplace where time is the currency.',
      category: 'general',
      tags: ['basics', 'how-it-works', 'platform']
    },
    {
      id: '2',
      question: 'Is Tympact available across India?',
      answer: 'Yes! Tympact is available throughout India. We have active users from major cities like Mumbai, Bangalore, Delhi, Hyderabad, Pune, Chennai, and many more locations. Our platform connects people across the country.',
      category: 'general',
      tags: ['location', 'availability', 'india']
    },
    {
      id: '3',
      question: 'How do I get started with Tympact?',
      answer: 'Getting started is easy! Simply sign up with your email, create your profile with your skills and interests, and start browsing tasks or posting your own. You\'ll receive 5 time credits as a welcome bonus to begin your journey.',
      category: 'general',
      tags: ['getting-started', 'signup', 'welcome']
    },

    // Account Questions
    {
      id: '4',
      question: 'How do I create and manage my profile?',
      answer: 'After signing up, you can create a detailed profile including your skills, experience, location, and what you\'re looking for. You can edit your profile anytime from the Settings page. A complete profile helps you get better matches.',
      category: 'account',
      tags: ['profile', 'settings', 'management']
    },
    {
      id: '5',
      question: 'Can I change my account information?',
      answer: 'Yes, you can update your account information anytime. Go to Settings > Profile to edit your personal details, skills, and preferences. Some changes like email address may require verification.',
      category: 'account',
      tags: ['account', 'edit', 'update']
    },
    {
      id: '6',
      question: 'How do I verify my account?',
      answer: 'Account verification helps build trust in our community. You can verify your account by providing a valid phone number, email address, and optionally linking your social media profiles. Verified accounts get priority in search results.',
      category: 'account',
      tags: ['verification', 'trust', 'security']
    },

    // Task Questions
    {
      id: '7',
      question: 'How do I post a task on Tympact?',
      answer: 'To post a task, go to the "Submit Task" page, fill in the details including title, description, required skills, time commitment, and payment (if any). Our AI will analyze your task and provide recommendations for better visibility.',
      category: 'tasks',
      tags: ['post-task', 'create', 'ai-analysis']
    },
    {
      id: '8',
      question: 'How are tasks matched with users?',
      answer: 'Our AI-powered matching system considers skills, location, availability, ratings, and past performance to suggest the best matches. You can also browse and apply for tasks manually based on your interests.',
      category: 'tasks',
      tags: ['matching', 'ai', 'recommendations']
    },
    {
      id: '9',
      question: 'What types of tasks can I post or complete?',
      answer: 'You can post or complete various tasks including mentoring, tutoring, design work, content creation, technical support, community service, and more. Tasks can be paid with time credits, money, or both.',
      category: 'tasks',
      tags: ['task-types', 'categories', 'services']
    },
    {
      id: '10',
      question: 'How do I earn time credits?',
      answer: 'You earn time credits by completing tasks for other users, mentoring someone, contributing to community projects, or participating in special missions. The amount of credits depends on the task complexity and time commitment.',
      category: 'tasks',
      tags: ['earn', 'credits', 'rewards']
    },

    // Payment Questions
    {
      id: '11',
      question: 'How do payments work on Tympact?',
      answer: 'Tympact supports hybrid payments - you can pay with time credits, money (₹), or both. Time credits are earned by helping others, while money payments are processed securely through our payment partners.',
      category: 'payments',
      tags: ['payment', 'money', 'credits']
    },
    {
      id: '12',
      question: 'Are there any fees for using Tympact?',
      answer: 'Tympact is free to join and use. We charge a small service fee (5%) only on monetary transactions to cover payment processing and platform maintenance. Time credit transactions are completely free.',
      category: 'payments',
      tags: ['fees', 'cost', 'pricing']
    },
    {
      id: '13',
      question: 'How do I withdraw my earnings?',
      answer: 'You can withdraw your monetary earnings to your bank account or digital wallet. Go to your Time Wallet page and select "Withdraw". Processing typically takes 2-3 business days.',
      category: 'payments',
      tags: ['withdraw', 'earnings', 'bank']
    },

    // Safety Questions
    {
      id: '14',
      question: 'How does Tympact ensure user safety?',
      answer: 'We prioritize user safety through verified profiles, trust scores, community ratings, and secure messaging. All users are encouraged to meet in public places and report any suspicious activity immediately.',
      category: 'safety',
      tags: ['safety', 'security', 'trust']
    },
    {
      id: '15',
      question: 'What should I do if I have a dispute with another user?',
      answer: 'If you have a dispute, first try to resolve it directly with the other user. If that doesn\'t work, contact our support team with details. We have a fair dispute resolution process to help resolve conflicts.',
      category: 'safety',
      tags: ['dispute', 'conflict', 'support']
    },
    {
      id: '16',
      question: 'How do trust scores work?',
      answer: 'Trust scores are calculated based on completed tasks, user ratings, verification status, and community feedback. Higher trust scores give you priority in search results and access to premium features.',
      category: 'safety',
      tags: ['trust-score', 'ratings', 'reputation']
    },

    // Technical Questions
    {
      id: '17',
      question: 'What devices and browsers are supported?',
      answer: 'Tympact works on all modern devices including smartphones, tablets, and computers. We support Chrome, Firefox, Safari, and Edge browsers. For the best experience, keep your browser updated.',
      category: 'technical',
      tags: ['devices', 'browsers', 'compatibility']
    },
    {
      id: '18',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and follow the instructions sent to your email. You can also contact support if you need help.',
      category: 'technical',
      tags: ['password', 'reset', 'login']
    },
    {
      id: '19',
      question: 'Why can\'t I access certain features?',
      answer: 'Some features require account verification or a minimum trust score. Check your profile completion and verification status. If you still can\'t access features, contact our support team for assistance.',
      category: 'technical',
      tags: ['access', 'features', 'restrictions']
    }
  ];

  const categories = [
    { key: 'all', label: 'All Questions', icon: HelpCircle, count: faqData.length },
    { key: 'general', label: 'General', icon: BookOpen, count: faqData.filter(f => f.category === 'general').length },
    { key: 'account', label: 'Account', icon: Users, count: faqData.filter(f => f.category === 'account').length },
    { key: 'tasks', label: 'Tasks', icon: Clock, count: faqData.filter(f => f.category === 'tasks').length },
    { key: 'payments', label: 'Payments', icon: Shield, count: faqData.filter(f => f.category === 'payments').length },
    { key: 'safety', label: 'Safety', icon: Shield, count: faqData.filter(f => f.category === 'safety').length },
    { key: 'technical', label: 'Technical', icon: HelpCircle, count: faqData.filter(f => f.category === 'technical').length }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return <BookOpen className="h-4 w-4" />;
      case 'account': return <Users className="h-4 w-4" />;
      case 'tasks': return <Clock className="h-4 w-4" />;
      case 'payments': return <Shield className="h-4 w-4" />;
      case 'safety': return <Shield className="h-4 w-4" />;
      case 'technical': return <HelpCircle className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'account': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'tasks': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'payments': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'safety': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'technical': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about Tympact. Can't find what you're looking for? 
            Contact our support team for personalized help.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.key as any)}
              className="flex items-center space-x-2"
            >
              <category.icon className="h-4 w-4" />
              <span>{category.label}</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredFAQs.length} of {faqData.length} questions
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No questions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms or category filter.
                </p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Badge variant="outline" className={getCategoryColor(faq.category)}>
                                {getCategoryIcon(faq.category)}
                                <span className="ml-1 capitalize">{faq.category}</span>
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                              {faq.question}
                            </h3>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            {expandedItems.has(faq.id) ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedItems.has(faq.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6">
                              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {faq.answer}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {faq.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Still have questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our support team is here to help you with any specific questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Help Center
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FAQPage; 