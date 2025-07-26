import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  Users, 
  TrendingUp, 
  Star, 
  Zap, 
  Shield, 
  Target,
  Brain,
  Heart,
  ArrowRight,
  CheckCircle,
  Play
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { platformStats } from '@/data/sampleData';

export default function LandingPage() {
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    tasks: 0,
    hours: 0,
    trust: 0
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    // Animate stats counter
    const animateValue = (key: keyof typeof animatedStats, target: number, duration: number = 2000) => {
      const start = 0;
      const startTime = Date.now();
      
      const updateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(start + (target - start) * progress);
        
        setAnimatedStats(prev => ({ ...prev, [key]: currentValue }));
        
        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };
      
      updateValue();
    };

    // Start animations with delays
    setTimeout(() => animateValue('users', 12847), 500);
    setTimeout(() => animateValue('tasks', 342), 700);
    setTimeout(() => animateValue('hours', 124500), 900);
    setTimeout(() => animateValue('trust', 94.2), 1100);
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Brain,
      title: "Smart Time Valuation",
      description: "Advanced algorithms calculate your time worth based on skills, urgency, and emotional intelligence"
    },
    {
      icon: Heart,
      title: "Emotion-Based Credits",
      description: "Earn bonus rewards for emotionally intensive tasks like mentoring and active listening"
    },
    {
      icon: Zap,
      title: "Hybrid Payment System",
      description: "Get paid in time, money, or both - flexible compensation for every task"
    },
    {
      icon: Target,
      title: "Time ROI Tracking",
      description: "Visual portfolio showing how your time investments are yielding returns"
    },
    {
      icon: Star,
      title: "Gamified Missions",
      description: "Complete daily quests, earn XP, and unlock exclusive TimeProof NFT badges"
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Community-driven trust scores and verified skill assessments for quality assurance"
    }
  ];

  const testimonials = [
    {
      name: "Sneha Iyer",
      role: "UX Designer, Bengaluru",
      avatar: "/assets/avatar-sneha.png",
      quote: "Tympact helped me monetize my design skills while contributing to meaningful NGO projects. The emotion-based credits system is revolutionary!"
    },
    {
      name: "Aman Gupta",
      role: "Data Analyst, Jaipur",
      avatar: "/assets/avatar-aman.png",
      quote: "The time valuation engine perfectly captures my expertise level. I've earned 50+ hours while helping startups with their data challenges."
    },
    {
      name: "Rohit Malhotra",
      role: "Frontend Developer, Delhi",
      avatar: "/assets/avatar-rohit.png",
      quote: "From 0 to 95 trust score in 3 months. The gamification and NFT rewards keep me motivated to deliver quality work consistently."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-card-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/assets/logo.png" alt="Tympact" className="h-8 w-8" />
              <span className="text-xl font-bold text-gradient">Tympact</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-accent text-accent-foreground">
              🚀 Now Live in India - Join the Time Revolution
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Turn Your{' '}
              <span className="text-gradient">Time Into Currency</span>
              <br />
              With Emotional Intelligence
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              India's first hybrid time economy platform where skills meet emotions. 
              Earn, trade, and invest time while making meaningful connections across the nation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-primary text-lg px-8 py-3">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <Link to="/marketplace">
                  <Play className="mr-2 h-5 w-5" />
                  Explore Marketplace
                </Link>
              </Button>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">{animatedStats.users.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">{animatedStats.tasks}</div>
                <div className="text-sm text-muted-foreground">Live Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">{animatedStats.hours.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Hours Traded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">{animatedStats.trust}%</div>
                <div className="text-sm text-muted-foreground">Trust Score</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-accent/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Powered by <span className="text-gradient">Advanced Intelligence</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of work with cutting-edge technology that understands both skills and emotions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-primary">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Loved by <span className="text-gradient">Indian Professionals</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands who've transformed their skills into valuable time currency
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/default-avatar.png';
                      }}
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div className="flex space-x-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Revolutionize Your Time?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join India's growing community of time traders and emotional intelligence pioneers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-foreground">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-card-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/assets/logo.png" alt="Tympact" className="h-6 w-6" />
                <span className="font-bold text-gradient">Tympact</span>
              </div>
              <p className="text-muted-foreground">
                Transforming time into currency with emotional intelligence across India.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link to="/about" className="block hover:text-foreground">About</Link>
                <Link to="/contact" className="block hover:text-foreground">Contact</Link>
                <Link to="/faq" className="block hover:text-foreground">FAQ</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Time Trading</div>
                <div>Skill Matching</div>
                <div>Emotion Detection</div>
                <div>NFT Rewards</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Refund Policy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-card-border mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2025 Tympact. Built with ❤️ in India. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}