import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Clock, 
  DollarSign, 
  MapPin, 
  Users, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Zap,
  Target,
  Heart
} from 'lucide-react';

interface TaskForm {
  title: string;
  description: string;
  skillsRequired: string[];
  estimatedHours: number;
  urgency: 'Low' | 'Medium' | 'High';
  location: string;
  category: string;
  isHybrid: boolean;
  monetaryValue: number;
  deadline: string;
  isEmotionalTask: boolean;
}

export default function PostTask() {
  const [formData, setFormData] = useState<TaskForm>({
    title: '',
    description: '',
    skillsRequired: [],
    estimatedHours: 1,
    urgency: 'Medium',
    location: '',
    category: '',
    isHybrid: false,
    monetaryValue: 0,
    deadline: '',
    isEmotionalTask: false
  });
  
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = [
    'Design', 'Development', 'Writing', 'Marketing', 'Data Analysis', 
    'Translation', 'Education', 'Consulting', 'Research', 'Customer Service'
  ];

  const cities = [
    'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 
    'Pune', 'Jaipur', 'Ahmedabad', 'Remote'
  ];

  // Simulate AI-powered task valuation
  const analyzeWithAI = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and description for AI analysis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call to task valuation engine
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis based on form data
    const baseValue = formData.estimatedHours * 250; // Base rate per hour
    const urgencyMultiplier = formData.urgency === 'High' ? 1.5 : formData.urgency === 'Medium' ? 1.2 : 1.0;
    const skillComplexity = formData.skillsRequired.length * 0.1 + 1;
    const emotionalBonus = formData.isEmotionalTask ? 1.3 : 1.0;
    
    const suggestedValue = Math.round(baseValue * urgencyMultiplier * skillComplexity * emotionalBonus);
    
    const analysis = {
      suggestedTimeValue: `${formData.estimatedHours} hours`,
      suggestedMonetaryValue: suggestedValue,
      demandScore: 85 + Math.floor(Math.random() * 15),
      skillMatch: 78 + Math.floor(Math.random() * 20),
      emotionalIntensity: formData.isEmotionalTask ? 85 : 35,
      completionProbability: 82 + Math.floor(Math.random() * 15),
      recommendations: [
        formData.urgency === 'High' ? "High urgency detected - consider increasing compensation" : "Standard urgency level",
        formData.isEmotionalTask ? "Emotional task detected - bonus credits recommended" : "Technical task - skills-based matching",
        formData.skillsRequired.length > 3 ? "Multiple skills required - premium task pricing" : "Standard skill requirements",
        "Task complexity and market demand suggest good completion rate"
      ]
    };
    
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
    
    // Auto-suggest hybrid payment if AI recommends
    if (analysis.suggestedMonetaryValue > 300) {
      setFormData(prev => ({ 
        ...prev, 
        isHybrid: true, 
        monetaryValue: analysis.suggestedMonetaryValue 
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate task posting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Task Posted Successfully! 🎉",
      description: "Your task is now live on the marketplace",
    });
    
    navigate('/marketplace');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient">Post New Task</h1>
          <p className="text-xl text-muted-foreground">
            Leverage our advanced valuation engine to price your task perfectly
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Task Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Task Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Design homepage for Delhi NGO"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed requirements, expectations, and deliverables..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Required Skills</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter a skill and press Add"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skillsRequired.map(skill => (
                        <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hours">Estimated Hours</Label>
                      <Input
                        id="hours"
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={formData.estimatedHours}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency</Label>
                      <Select value={formData.urgency} onValueChange={(value: any) => setFormData(prev => ({ ...prev, urgency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emotional"
                        checked={formData.isEmotionalTask}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isEmotionalTask: !!checked }))}
                      />
                      <Label htmlFor="emotional" className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>This task involves emotional intelligence (mentoring, counseling, etc.)</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hybrid"
                        checked={formData.isHybrid}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isHybrid: !!checked }))}
                      />
                      <Label htmlFor="hybrid" className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span>Hybrid payment (time + money)</span>
                      </Label>
                    </div>

                    {formData.isHybrid && (
                      <div className="ml-6 space-y-2">
                        <Label htmlFor="money">Monetary Component (₹)</Label>
                        <Input
                          id="money"
                          type="number"
                          min="0"
                          placeholder="e.g., 500"
                          value={formData.monetaryValue}
                          onChange={(e) => setFormData(prev => ({ ...prev, monetaryValue: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" className="flex-1 bg-gradient-primary">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Post Task
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate('/marketplace')}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* AI Analysis Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Smart Valuation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Get AI-powered insights on task pricing and demand
                </p>
                
                <Button 
                  onClick={analyzeWithAI} 
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-primary"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>

                {aiAnalysis && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-accent/10 rounded-lg">
                        <div className="text-lg font-bold text-gradient">
                          {aiAnalysis.suggestedTimeValue}
                        </div>
                        <div className="text-xs text-muted-foreground">Time Value</div>
                      </div>
                      <div className="text-center p-3 bg-accent/10 rounded-lg">
                        <div className="text-lg font-bold text-gradient">
                          ₹{aiAnalysis.suggestedMonetaryValue}
                        </div>
                        <div className="text-xs text-muted-foreground">Suggested Price</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Demand Score</span>
                        <span className="text-sm font-semibold">{aiAnalysis.demandScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Skill Match</span>
                        <span className="text-sm font-semibold">{aiAnalysis.skillMatch}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Emotional Intensity</span>
                        <span className="text-sm font-semibold">{aiAnalysis.emotionalIntensity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Completion Probability</span>
                        <span className="text-sm font-semibold">{aiAnalysis.completionProbability}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">AI Recommendations:</h4>
                      {aiAnalysis.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2 text-xs">
                          <AlertCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Task Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium">{formData.title || 'Task Title'}</div>
                  <div className="text-xs text-muted-foreground line-clamp-3">
                    {formData.description || 'Task description will appear here...'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formData.estimatedHours}h</span>
                    {formData.isHybrid && (
                      <>
                        <span>+</span>
                        <DollarSign className="h-3 w-3" />
                        <span>₹{formData.monetaryValue}</span>
                      </>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {formData.urgency}
                  </Badge>
                </div>

                {formData.skillsRequired.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.skillsRequired.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {formData.skillsRequired.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{formData.skillsRequired.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}