import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Smile, Frown, Meh, Star, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface EmotionResult {
  primary: string;
  confidence: number;
  secondary: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  insights: string[];
  recommendations: string[];
}

interface FeedbackForm {
  rating: number;
  feedback: string;
  category: 'task' | 'platform' | 'user' | 'general';
  emotion: string;
}

const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  
  const [formData, setFormData] = useState<FeedbackForm>({
    rating: 5,
    feedback: '',
    category: 'general',
    emotion: ''
  });

  const categories = [
    { value: 'task', label: 'Task Experience', icon: '🎯' },
    { value: 'platform', label: 'Platform Features', icon: '💻' },
    { value: 'user', label: 'User Interaction', icon: '👥' },
    { value: 'general', label: 'General Feedback', icon: '💭' }
  ];

  const emotions = [
    { value: 'happy', label: 'Happy', icon: '😊', color: 'bg-green-100 text-green-800' },
    { value: 'excited', label: 'Excited', icon: '🤩', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'satisfied', label: 'Satisfied', icon: '😌', color: 'bg-blue-100 text-blue-800' },
    { value: 'neutral', label: 'Neutral', icon: '😐', color: 'bg-gray-100 text-gray-800' },
    { value: 'frustrated', label: 'Frustrated', icon: '😤', color: 'bg-orange-100 text-orange-800' },
    { value: 'disappointed', label: 'Disappointed', icon: '😞', color: 'bg-red-100 text-red-800' }
  ];

  const simulateEmotionDetection = async (feedback: string): Promise<EmotionResult> => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Simple emotion detection logic based on keywords
    const feedbackLower = feedback.toLowerCase();
    
    let primary = 'neutral';
    let confidence = 0.7;
    let secondary: string[] = [];
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    
    // Positive emotions
    if (feedbackLower.includes('great') || feedbackLower.includes('amazing') || feedbackLower.includes('love')) {
      primary = 'happy';
      confidence = 0.9;
      sentiment = 'positive';
      secondary = ['excited', 'satisfied'];
    } else if (feedbackLower.includes('good') || feedbackLower.includes('nice') || feedbackLower.includes('helpful')) {
      primary = 'satisfied';
      confidence = 0.8;
      sentiment = 'positive';
      secondary = ['happy'];
    } else if (feedbackLower.includes('excellent') || feedbackLower.includes('fantastic') || feedbackLower.includes('wonderful')) {
      primary = 'excited';
      confidence = 0.95;
      sentiment = 'positive';
      secondary = ['happy', 'satisfied'];
    }
    
    // Negative emotions
    if (feedbackLower.includes('bad') || feedbackLower.includes('terrible') || feedbackLower.includes('hate')) {
      primary = 'disappointed';
      confidence = 0.9;
      sentiment = 'negative';
      secondary = ['frustrated'];
    } else if (feedbackLower.includes('frustrated') || feedbackLower.includes('annoying') || feedbackLower.includes('difficult')) {
      primary = 'frustrated';
      confidence = 0.85;
      sentiment = 'negative';
      secondary = ['disappointed'];
    }
    
    // Generate insights based on sentiment
    const insights = [];
    if (sentiment === 'positive') {
      insights.push('User shows high satisfaction with the experience');
      insights.push('Positive emotional engagement detected');
      insights.push('Likely to recommend the platform to others');
    } else if (sentiment === 'negative') {
      insights.push('User expresses concerns that need attention');
      insights.push('Negative emotional response detected');
      insights.push('Immediate follow-up recommended');
    } else {
      insights.push('Neutral response suggests room for improvement');
      insights.push('Mixed emotional signals detected');
      insights.push('Consider asking for more specific feedback');
    }
    
    // Generate recommendations
    const recommendations = [];
    if (sentiment === 'positive') {
      recommendations.push('Consider asking for testimonials or referrals');
      recommendations.push('Highlight positive aspects in marketing materials');
      recommendations.push('Maintain current service quality');
    } else if (sentiment === 'negative') {
      recommendations.push('Schedule follow-up conversation to address concerns');
      recommendations.push('Review and improve the specific area mentioned');
      recommendations.push('Consider offering compensation or apology');
    } else {
      recommendations.push('Implement improvements based on feedback');
      recommendations.push('Follow up with more specific questions');
      recommendations.push('Consider A/B testing different approaches');
    }
    
    return {
      primary,
      confidence,
      secondary,
      sentiment,
      insights,
      recommendations
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide your feedback for analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await simulateEmotionDetection(formData.feedback);
      setEmotionResult(result);
      setShowResults(true);
      
      toast({
        title: "Emotion Analysis Complete!",
        description: "We've analyzed your feedback and detected emotional patterns.",
      });
      
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return <Smile className="h-5 w-5" />;
      case 'excited': return <Star className="h-5 w-5" />;
      case 'satisfied': return <CheckCircle className="h-5 w-5" />;
      case 'neutral': return <Meh className="h-5 w-5" />;
      case 'frustrated': return <Frown className="h-5 w-5" />;
      case 'disappointed': return <Frown className="h-5 w-5" />;
      default: return <Meh className="h-5 w-5" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'negative': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
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
            Share Your Feedback
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Help us improve Tympact by sharing your experience. Our emotion detection system will analyze your feedback to provide personalized insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Your Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Overall Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        type="button"
                        variant={formData.rating >= star ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        className="p-2"
                      >
                        <Star className={`h-5 w-5 ${formData.rating >= star ? 'fill-current' : ''}`} />
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Feedback Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(category => (
                      <Button
                        key={category.value}
                        type="button"
                        variant={formData.category === category.value ? 'default' : 'outline'}
                        onClick={() => setFormData(prev => ({ ...prev, category: category.value as any }))}
                        className="justify-start"
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Current Emotion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    How are you feeling about Tympact?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {emotions.map(emotion => (
                      <Button
                        key={emotion.value}
                        type="button"
                        variant={formData.emotion === emotion.value ? 'default' : 'outline'}
                        onClick={() => setFormData(prev => ({ ...prev, emotion: emotion.value }))}
                        className="justify-start"
                      >
                        <span className="mr-2">{emotion.icon}</span>
                        {emotion.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Feedback Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Detailed Feedback *
                  </label>
                  <Textarea
                    placeholder="Tell us about your experience with Tympact. What did you like? What could be improved? How did it make you feel?"
                    value={formData.feedback}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                    rows={6}
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing Emotions...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze Feedback
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Emotion Analysis Results */}
          {showResults && emotionResult && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Emotion Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Primary Emotion */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      {getEmotionIcon(emotionResult.primary)}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {emotionResult.primary.charAt(0).toUpperCase() + emotionResult.primary.slice(1)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Confidence: {(emotionResult.confidence * 100).toFixed(0)}%
                    </p>
                  </div>

                  {/* Sentiment */}
                  <div className={`p-4 rounded-lg ${getSentimentColor(emotionResult.sentiment)}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Sentiment</span>
                      <Badge variant="secondary">
                        {emotionResult.sentiment.charAt(0).toUpperCase() + emotionResult.sentiment.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Secondary Emotions */}
                  {emotionResult.secondary.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Secondary Emotions</h4>
                      <div className="flex flex-wrap gap-2">
                        {emotionResult.secondary.map(emotion => (
                          <Badge key={emotion} variant="outline">
                            {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">AI Insights</h4>
                    <ul className="space-y-2">
                      {emotionResult.insights.map((insight, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations</h4>
                    <ul className="space-y-2">
                      {emotionResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <Star className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Thank You */}
                  <div className="text-center pt-4 border-t">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Thank you for your valuable feedback! We'll use these insights to improve Tympact.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackPage; 