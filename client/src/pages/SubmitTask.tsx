import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Clock, DollarSign, Star, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface TaskForm {
  title: string;
  description: string;
  category: string;
  skills: string[];
  hours: number;
  payment: number;
  urgency: 'low' | 'medium' | 'high';
  location: string;
  maxApplicants: number;
}

interface TaskScore {
  overall: number;
  complexity: number;
  marketDemand: number;
  emotionalValue: number;
  recommendations: string[];
}

const SubmitTaskPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [taskScore, setTaskScore] = useState<TaskScore | null>(null);
  
  const [formData, setFormData] = useState<TaskForm>({
    title: '',
    description: '',
    category: '',
    skills: [],
    hours: 1,
    payment: 0,
    urgency: 'medium',
    location: '',
    maxApplicants: 5
  });

  const categories = [
    'Mentoring & Coaching',
    'Design & Creative',
    'Development & Tech',
    'Content & Writing',
    'Marketing & Growth',
    'Education & Training',
    'Healthcare & Wellness',
    'Social Impact',
    'Business & Strategy',
    'Other'
  ];

  const skillOptions = [
    'React', 'JavaScript', 'Python', 'UI/UX Design', 'Content Writing',
    'Digital Marketing', 'SEO', 'Graphic Design', 'Video Editing',
    'Data Analysis', 'Project Management', 'Public Speaking',
    'Mentoring', 'Teaching', 'Healthcare', 'Fitness', 'Cooking',
    'Photography', 'Music', 'Art', 'Translation', 'Legal Advice'
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ];

  const handleInputChange = (field: keyof TaskForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const simulateAIScoring = async (task: TaskForm): Promise<TaskScore> => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate complexity based on skills and hours
    const complexity = Math.min(100, (task.skills.length * 15) + (task.hours * 5));
    
    // Calculate market demand based on category and skills
    const marketDemand = Math.min(100, 70 + (task.skills.length * 8) + (task.payment > 0 ? 10 : 0));
    
    // Calculate emotional value based on category and description
    const emotionalKeywords = ['mentor', 'help', 'teach', 'support', 'care', 'community', 'impact'];
    const emotionalValue = Math.min(100, emotionalKeywords.reduce((score, keyword) => 
      score + (task.description.toLowerCase().includes(keyword) ? 15 : 0), 50
    ));
    
    // Calculate overall score
    const overall = Math.round((complexity + marketDemand + emotionalValue) / 3);
    
    // Generate recommendations
    const recommendations = [];
    if (task.hours < 2) recommendations.push('Consider increasing hours for better compensation');
    if (task.payment === 0) recommendations.push('Adding payment can attract more qualified applicants');
    if (task.skills.length < 2) recommendations.push('Add more specific skills for better matching');
    if (task.description.length < 100) recommendations.push('Provide more detailed description');
    if (overall < 70) recommendations.push('Consider adjusting task parameters for better visibility');
    
    return {
      overall,
      complexity,
      marketDemand,
      emotionalValue,
      recommendations
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate AI scoring
      const score = await simulateAIScoring(formData);
      setTaskScore(score);
      setShowScore(true);
      
      toast({
        title: "Task Analyzed Successfully!",
        description: "Our AI has evaluated your task and provided recommendations.",
      });
      
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Task Published Successfully! 🎉",
        description: "Your task is now live on the marketplace and visible to our community.",
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        skills: [],
        hours: 1,
        payment: 0,
        urgency: 'medium',
        location: '',
        maxApplicants: 5
      });
      setShowScore(false);
      setTaskScore(null);
      
    } catch (error) {
      toast({
        title: "Publishing Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
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
            Submit New Task
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create a task and let our AI-powered system analyze it for optimal matching and success.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Task Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Task Title *
                      </label>
                      <Input
                        placeholder="e.g., Frontend Development Mentoring"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <Textarea
                        placeholder="Describe your task in detail. What do you need help with? What skills are required?"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category *
                        </label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Location
                        </label>
                        <Input
                          placeholder="e.g., Mumbai, Maharashtra"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills Required */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Skills Required
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {skillOptions.map(skill => (
                        <Button
                          key={skill}
                          type="button"
                          variant={formData.skills.includes(skill) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleSkillToggle(skill)}
                          className="justify-start"
                        >
                          {skill}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Time and Payment */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hours Required
                      </label>
                      <Input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={formData.hours}
                        onChange={(e) => handleInputChange('hours', parseFloat(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment (₹)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0 for time-only"
                        value={formData.payment}
                        onChange={(e) => handleInputChange('payment', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Applicants
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.maxApplicants}
                        onChange={(e) => handleInputChange('maxApplicants', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Urgency Level
                    </label>
                    <div className="flex space-x-2">
                      {urgencyOptions.map(option => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={formData.urgency === option.value ? 'default' : 'outline'}
                          onClick={() => handleInputChange('urgency', option.value)}
                          className={option.color}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing Task...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Analyze Task with AI
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* AI Analysis Results */}
          {showScore && taskScore && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    AI Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(taskScore.overall)}`}>
                      {taskScore.overall}/100
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getScoreLabel(taskScore.overall)}
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Complexity</span>
                      <span className="font-medium">{taskScore.complexity}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Market Demand</span>
                      <span className="font-medium">{taskScore.marketDemand}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Emotional Value</span>
                      <span className="font-medium">{taskScore.emotionalValue}/100</span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {taskScore.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        {taskScore.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Publish Button */}
                  <Button
                    onClick={handlePublish}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Publish Task
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SubmitTaskPage; 