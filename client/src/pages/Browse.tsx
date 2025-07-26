import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Star, Users, Building, Heart, MessageSquare, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';

interface Profile {
  id: string;
  type: 'user' | 'ngo' | 'company';
  name: string;
  avatar: string;
  location: string;
  rating: number;
  trustScore: number;
  skills: string[];
  description: string;
  completedTasks: number;
  timeBalance?: number;
  isVerified: boolean;
  tags: string[];
}

const BrowsePage: React.FC = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'user' | 'ngo' | 'company'>('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'trustScore' | 'completedTasks'>('rating');

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProfiles: Profile[] = [
        // Users
        {
          id: '1',
          type: 'user',
          name: 'Ravi Verma',
          avatar: '/assets/avatars/ravi.jpg',
          location: 'Mumbai, Maharashtra',
          rating: 4.8,
          trustScore: 95,
          skills: ['Frontend Development', 'React', 'Mentoring'],
          description: 'Experienced frontend developer passionate about mentoring new developers and contributing to open source projects.',
          completedTasks: 24,
          timeBalance: 15,
          isVerified: true,
          tags: ['Mentor', 'Open Source', 'React Expert']
        },
        {
          id: '2',
          type: 'user',
          name: 'Anjali Gupta',
          avatar: '/assets/avatars/anjali.jpg',
          location: 'Bangalore, Karnataka',
          rating: 4.9,
          trustScore: 98,
          skills: ['UI/UX Design', 'Figma', 'Product Design'],
          description: 'Creative UI/UX designer with 5+ years of experience. Love helping startups create beautiful user experiences.',
          completedTasks: 31,
          timeBalance: 8,
          isVerified: true,
          tags: ['Design Expert', 'Startup Friendly', 'Creative']
        },
        {
          id: '3',
          type: 'user',
          name: 'Neha Rathi',
          avatar: '/assets/avatars/neha.jpg',
          location: 'Delhi, NCR',
          rating: 4.7,
          trustScore: 92,
          skills: ['Content Writing', 'SEO', 'Digital Marketing'],
          description: 'Content strategist and digital marketer. Helping businesses grow their online presence through compelling content.',
          completedTasks: 18,
          timeBalance: 12,
          isVerified: true,
          tags: ['Content Expert', 'SEO', 'Growth']
        },
        // NGOs
        {
          id: '4',
          type: 'ngo',
          name: 'CareBridge NGO',
          avatar: '/assets/logos/carebridge.png',
          location: 'Mumbai, Maharashtra',
          rating: 4.9,
          trustScore: 99,
          skills: ['Education', 'Healthcare', 'Community Development'],
          description: 'Dedicated to providing quality education and healthcare to underprivileged children across India.',
          completedTasks: 156,
          isVerified: true,
          tags: ['Education', 'Healthcare', 'Children']
        },
        {
          id: '5',
          type: 'ngo',
          name: 'GreenEarth Foundation',
          avatar: '/assets/logos/greenearth.png',
          location: 'Pune, Maharashtra',
          rating: 4.8,
          trustScore: 96,
          skills: ['Environmental Conservation', 'Sustainability', 'Awareness'],
          description: 'Working towards environmental conservation and promoting sustainable practices in urban areas.',
          completedTasks: 89,
          isVerified: true,
          tags: ['Environment', 'Sustainability', 'Conservation']
        },
        // Companies
        {
          id: '6',
          type: 'company',
          name: 'TechYatra Pvt Ltd',
          avatar: '/assets/logos/techyatra.png',
          location: 'Bangalore, Karnataka',
          rating: 4.7,
          trustScore: 94,
          skills: ['Software Development', 'AI/ML', 'Cloud Computing'],
          description: 'Innovative tech company specializing in AI solutions and cloud infrastructure for Indian businesses.',
          completedTasks: 203,
          isVerified: true,
          tags: ['AI/ML', 'Cloud', 'Enterprise']
        },
        {
          id: '7',
          type: 'company',
          name: 'EduServe India',
          avatar: '/assets/logos/eduserve.png',
          location: 'Hyderabad, Telangana',
          rating: 4.6,
          trustScore: 91,
          skills: ['EdTech', 'Online Learning', 'Skill Development'],
          description: 'Leading edtech platform providing quality education and skill development programs across India.',
          completedTasks: 178,
          isVerified: true,
          tags: ['EdTech', 'Learning', 'Skills']
        }
      ];
      
      setProfiles(mockProfiles);
      setFilteredProfiles(mockProfiles);
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    let filtered = profiles;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(profile => profile.type === selectedType);
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(profile => profile.location.includes(selectedLocation));
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        profile.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort profiles
    filtered.sort((a, b) => b[sortBy] - a[sortBy]);

    setFilteredProfiles(filtered);
  }, [profiles, searchQuery, selectedType, selectedLocation, sortBy]);

  const getTypeIcon = (type: Profile['type']) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4" />;
      case 'ngo': return <Heart className="h-4 w-4" />;
      case 'company': return <Building className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Profile['type']) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ngo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'company': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const locations = ['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad'];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Community
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover talented individuals, impactful NGOs, and innovative companies across India. 
            Connect, collaborate, and make a difference together.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, skills, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as typeof selectedType)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="user">Individuals</SelectItem>
                <SelectItem value="ngo">NGOs</SelectItem>
                <SelectItem value="company">Companies</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Sort by Rating</SelectItem>
                <SelectItem value="trustScore">Sort by Trust Score</SelectItem>
                <SelectItem value="completedTasks">Sort by Tasks Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredProfiles.length} of {profiles.length} profiles
          </p>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Active filters: {selectedType !== 'all' ? selectedType : 'none'}</span>
          </div>
        </div>

        {/* Profiles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profiles...</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No profiles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or filters to find more profiles.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={profile.avatar}
                              alt={profile.name}
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/assets/default-avatar.png';
                              }}
                            />
                            {profile.isVerified && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                <Award className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {profile.name}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className={getTypeColor(profile.type)}>
                                {getTypeIcon(profile.type)}
                                <span className="ml-1 capitalize">{profile.type}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Location */}
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          {profile.location}
                        </div>

                        {/* Rating and Trust Score */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{profile.rating}</span>
                            <span className="text-sm text-gray-500">({profile.completedTasks} tasks)</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Trust: {profile.trustScore}%
                          </Badge>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {profile.description}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1">
                          {profile.skills.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {profile.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.skills.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {profile.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Time Balance (for users) */}
                        {profile.type === 'user' && profile.timeBalance && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {profile.timeBalance} hours available
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Connect
                          </Button>
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BrowsePage; 