import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Award,
  Clock,
  TrendingUp,
  Users,
  Timer,
  MapPin,
  DollarSign,
  Zap,
  Star,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

// Interfaces
interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  urgency: 'low' | 'medium' | 'high';
  location: string;
  deadline: string;
  estimatedHours: number;
  reward: number;
  isHybrid?: boolean; // For rewards with both time and money
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  createdBy: string; // User ID
  // Optional populated fields
  creatorName?: string;
  creatorRating?: number;
}

const getUrgencyColor = (urgency: 'low' | 'medium' | 'high'): 'destructive' | 'secondary' | 'default' => {
  switch (urgency) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary'; // Mapped 'warning' to 'secondary'
    case 'low':
      return 'default'; // Mapped 'success' to 'default'
    default:
      return 'default';
  }
};

export default function Marketplace() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/v1/tasks');
        const result = await response.json();
        if (result.status === 'success') {
          setTasks(result.data.tasks || []);
        } else {
          throw new Error(result.message || 'Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch tasks from the marketplace.',
          variant: 'destructive',
        });
      }
      setLoading(false);
    };

    fetchTasks();
  }, [toast]);

  const handleApplyTask = async (taskId: string) => {
    if (!user || !auth.currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to apply for tasks.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`/api/v1/tasks/${taskId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: 'I am interested in this task!' }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        toast({
          title: 'Application Sent!',
          description: 'Your application has been submitted successfully.',
          variant: 'default',
        });
      } else {
        throw new Error(result.message || 'Failed to apply for the task.');
      }
    } catch (error) {
      console.error('Error applying for task:', error);
      toast({
        title: 'Application Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => task.status === 'open')
      .filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(task => selectedCategory === 'all' || task.category === selectedCategory)
      .filter(task => selectedUrgency === 'all' || task.urgency === selectedUrgency)
      .filter(task => selectedLocation === 'all' || task.location === selectedLocation);
  }, [tasks, searchQuery, selectedCategory, selectedUrgency, selectedLocation]);

  const categories = useMemo(() => ['all', ...Array.from(new Set(tasks.map(t => t.category)))], [tasks]);
  const urgencies = useMemo(() => ['all', 'low', 'medium', 'high'], []);
  const locations = useMemo(() => ['all', ...Array.from(new Set(tasks.map(t => t.location)))], [tasks]);

  const stats = useMemo(() => {
    const openTasks = tasks.filter(t => t.status === 'open');
    const avgHours = openTasks.length > 0
      ? openTasks.reduce((acc, t) => acc + t.estimatedHours, 0) / openTasks.length
      : 0;
    
    return [
      { label: 'Open Tasks', value: openTasks.length, icon: Award },
      { label: 'Avg Reward', value: `${avgHours.toFixed(1)} hrs`, icon: Clock },
      { label: 'Success Rate', value: '98.1%', icon: TrendingUp }, // Static for now
      { label: 'Active Users', value: '1.2k', icon: Users } // Static for now
    ];
  }, [tasks]);

  if (loading) {
    return <div className="text-center py-20">Loading marketplace...</div>;
  }

  return (
    <div className="bg-background-alt min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
          <Button asChild>
            <Link to="/submit-task">
              <Plus className="h-4 w-4 mr-2" />
              Post New Task
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8 card-elevated">
          <CardHeader>
            <CardTitle>Filter & Sort</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="capitalize">
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  {urgencies.map(urgency => (
                    <SelectItem key={urgency} value={urgency} className="capitalize">
                      {urgency === 'all' ? 'All Urgencies' : urgency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location} className="capitalize">
                      {location === 'all' ? 'All Locations' : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="card-elevated">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Task Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="card-elevated hover:shadow-lg transition-all duration-300 group flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={getUrgencyColor(task.urgency)} className="capitalize">
                    {task.urgency}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <span>{task.estimatedHours}h</span>
                  </div>
                </div>
                
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {task.title}
                </CardTitle>
                
                <CardDescription className="line-clamp-3 h-16">
                  {task.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills needed:</p>
                    <div className="flex flex-wrap gap-2">
                      {task.skillsRequired.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {task.skillsRequired.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{task.skillsRequired.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{task.location}</span>
                    </div>
                    <span>Due: {new Date(task.deadline).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-lg">{task.reward} hrs</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleApplyTask(task.id)}
                      className="hover:scale-105 transition-transform"
                      disabled={!user}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More / Empty State */}
        {filteredTasks.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedUrgency('all');
              setSelectedLocation('all');
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Tasks
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}