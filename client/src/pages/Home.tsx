import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Users, 
  TrendingUp, 
  Shield, 
  ArrowRight, 
  Star,
  CheckCircle,
  Timer,
  Heart,
  Zap,
  Target
} from 'lucide-react';
import { platformStats, sampleUsers, sampleTasks } from '@/data/sampleData';

export default function Home() {
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Clock,
      title: 'Time as Currency',
      description: 'Trade your time and skills as a valuable currency in our hybrid economy',
      color: 'text-primary'
    },
    {
      icon: Users,
      title: 'Smart Matching',
      description: 'Advanced algorithms match you with the perfect collaborators and opportunities',
      color: 'text-success'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Emotion-based trust scoring ensures safe and reliable interactions',
      color: 'text-warning'
    },
    {
      icon: TrendingUp,
      title: 'Track Growth',
      description: 'Monitor your time ROI and skill development with detailed analytics',
      color: 'text-destructive'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'UX Designer, Bengaluru',
      content: 'Tympact helped me find amazing projects while building my portfolio. The hybrid payment system is revolutionary!',
      rating: 5,
      avatar: '/assets/testimonial-priya.png'
    },
    {
      name: 'Arjun Patel',
      role: 'Data Scientist, Mumbai',
      content: 'I\'ve earned over 50 hours helping startups with data analysis. The trust system makes collaboration seamless.',
      rating: 5,
      avatar: '/assets/testimonial-arjun.png'
    },
    {
      name: 'Kavya Reddy',
      role: 'Content Writer, Hyderabad',
      content: 'The gamification and emotion tracking keeps me motivated. I\'ve grown my network and skills significantly.',
      rating: 5,
      avatar: '/assets/testimonial-kavya.png'
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Join the Platform',
      description: 'Create your profile and showcase your skills',
      icon: Users
    },
    {
      step: 2,
      title: 'Find Opportunities',
      description: 'Browse tasks or get matched with perfect projects',
      icon: Target
    },
    {
      step: 3,
      title: 'Trade & Collaborate',
      description: 'Exchange time, earn money, and build trust',
      icon: Zap
    },
    {
      step: 4,
      title: 'Grow & Succeed',
      description: 'Level up your skills and expand your network',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="fade-in">
              <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
                ✨ India's First Time Economy Platform
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Transform Your{' '}
                <span className="text-gradient">Time</span>
                {' '}Into Value
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join India's revolutionary platform where your time and skills become currency. 
                Trade, earn, and grow in the hybrid economy designed for modern professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="btn-gradient px-8" asChild>
                  <Link to="/register">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/marketplace">
                    Explore Marketplace
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-card-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Users', value: platformStats.totalUsers.toLocaleString(), icon: Users },
              { label: 'Time Traded', value: platformStats.timeTraded, icon: Clock },
              { label: 'Success Rate', value: `${platformStats.successRate}%`, icon: CheckCircle },
              { label: 'Trust Score', value: platformStats.trustScore, icon: Shield }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center transform transition-all duration-500 ${
                  statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Tympact?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of work with our innovative platform designed for 
              India's dynamic professional ecosystem.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="card-elevated hover:shadow-lg transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${feature.color} bg-current/10`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Tympact Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and begin trading your time for value
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full text-primary-foreground font-bold text-lg mb-4">
                    {step.step}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tasks */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Opportunities</h2>
              <p className="text-muted-foreground">Start earning with these trending tasks</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/marketplace">
                View All Tasks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleTasks.slice(0, 3).map((task) => (
              <Card key={task.id} className="card-elevated hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={task.urgency === 'High' ? 'destructive' : task.urgency === 'Medium' ? 'default' : 'secondary'}>
                      {task.urgency}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{task.estimatedHours}h</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{task.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold text-primary">{task.reward}</div>
                    <Button size="sm" asChild>
                      <Link to={`/task/${task.id}`}>Apply</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how professionals across India are transforming their careers with Tympact
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="card-elevated">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/default-avatar.png';
                      }}
                    />
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Time?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already earning, learning, and growing 
            with Tympact's revolutionary time economy platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-gradient px-8" asChild>
              <Link to="/register">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}