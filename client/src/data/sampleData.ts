// Sample data for Tympact platform with Indian context

export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  role: string;
  skills: string[];
  trustScore: number;
  timeBalance: string;
  xpPoints: number;
  joinedDate: string;
  avatar: string;
  completedTasks: number;
  rating: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: string;
  postedBy: string;
  urgency: 'Low' | 'Medium' | 'High';
  skillsRequired: string[];
  location: string;
  estimatedHours: number;
  category: string;
  deadline: string;
  isHybrid: boolean;
  monetaryValue?: number;
}

export interface Trade {
  id: string;
  taskTitle: string;
  participants: string[];
  status: 'Active' | 'Completed' | 'Pending';
  value: string;
  startDate: string;
  completionDate?: string;
  type: 'time' | 'hybrid';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: 'Completed' | 'In Progress' | 'Incomplete';
  progress: number;
  category: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  focusScore: number;
  emotion: string;
  activity: string;
  productivity: number;
  notes?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  creditsRequired: number;
  category: string;
  availability: number;
  image: string;
}

export interface NFTBadge {
  id: string;
  title: string;
  description: string;
  earnedBy: string;
  design: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  earnedDate: string;
}

// Sample Users
export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Rohit Malhotra',
    email: 'rohit.malhotra@email.com',
    city: 'Delhi',
    role: 'Frontend Developer',
    skills: ['React', 'Figma', 'Next.js', 'TypeScript'],
    trustScore: 92,
    timeBalance: '17 hrs',
    xpPoints: 2450,
    joinedDate: 'Feb 2025',
    avatar: '/assets/avatar-rohit.png',
    completedTasks: 23,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@email.com',
    city: 'Bengaluru',
    role: 'UX Designer',
    skills: ['Adobe XD', 'Framer', 'Illustrator', 'Prototyping'],
    trustScore: 88,
    timeBalance: '22 hrs',
    xpPoints: 1890,
    joinedDate: 'Jan 2025',
    avatar: '/assets/avatar-sneha.png',
    completedTasks: 18,
    rating: 4.9
  },
  {
    id: '3',
    name: 'Aman Gupta',
    email: 'aman.gupta@email.com',
    city: 'Jaipur',
    role: 'Data Analyst',
    skills: ['Power BI', 'SQL', 'Python', 'Excel'],
    trustScore: 95,
    timeBalance: '13 hrs',
    xpPoints: 3120,
    joinedDate: 'Mar 2025',
    avatar: '/assets/avatar-aman.png',
    completedTasks: 31,
    rating: 4.7
  }
];

// Sample Tasks
export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Design homepage for Jaipur-based NGO',
    description: 'Create a modern, responsive homepage design for an education-focused NGO in Jaipur. Need clean UI with donation integration.',
    reward: '3 hrs + ₹700',
    postedBy: 'Sneha Iyer',
    urgency: 'Medium',
    skillsRequired: ['UI Design', 'Figma', 'Web Design'],
    location: 'Remote',
    estimatedHours: 3,
    category: 'Design',
    deadline: '2025-08-05',
    isHybrid: true,
    monetaryValue: 700
  },
  {
    id: '2',
    title: 'Clean 500 rows of Excel data for Mumbai startup',
    description: 'Data cleaning project for fintech startup. Remove duplicates, standardize formats, and validate contact information.',
    reward: '2.5 hrs',
    postedBy: 'Aman Gupta',
    urgency: 'Low',
    skillsRequired: ['Excel', 'Data Cleaning', 'Attention to Detail'],
    location: 'Mumbai',
    estimatedHours: 2.5,
    category: 'Data',
    deadline: '2025-08-10',
    isHybrid: false
  },
  {
    id: '3',
    title: 'Translate legal Hindi docs to English',
    description: 'Translate 10 pages of legal documentation from Hindi to English. Requires legal terminology knowledge.',
    reward: '5 hrs',
    postedBy: 'Rohit Malhotra',
    urgency: 'High',
    skillsRequired: ['Translation', 'Legal Knowledge', 'Hindi', 'English'],
    location: 'Delhi',
    estimatedHours: 5,
    category: 'Translation',
    deadline: '2025-07-30',
    isHybrid: false
  },
  {
    id: '4',
    title: 'React component library documentation',
    description: 'Create comprehensive documentation for internal React component library used across 5 products.',
    reward: '4 hrs + ₹1200',
    postedBy: 'TechYatra Pvt Ltd',
    urgency: 'Medium',
    skillsRequired: ['React', 'Documentation', 'Technical Writing'],
    location: 'Pune',
    estimatedHours: 4,
    category: 'Development',
    deadline: '2025-08-08',
    isHybrid: true,
    monetaryValue: 1200
  }
];

// Sample Trades
export const sampleTrades: Trade[] = [
  {
    id: 'TRD1021',
    taskTitle: 'Social Media Post Design for Delhi Startup',
    participants: ['Sneha Iyer', 'Rohit Malhotra'],
    status: 'Completed',
    value: '3 hrs + ₹300',
    startDate: '2025-07-15',
    completionDate: '2025-07-18',
    type: 'hybrid'
  },
  {
    id: 'TRD1023',
    taskTitle: 'Resume Audit + Analytics Report',
    participants: ['Aman Gupta', 'Sneha Iyer'],
    status: 'Active',
    value: '4 hrs',
    startDate: '2025-07-20',
    type: 'time'
  },
  {
    id: 'TRD1025',
    taskTitle: 'Website Bug Fixes for Bengaluru NGO',
    participants: ['Rohit Malhotra', 'CareBridge NGO'],
    status: 'Pending',
    value: '2 hrs + ₹500',
    startDate: '2025-07-25',
    type: 'hybrid'
  }
];

// Sample Missions
export const sampleMissions: Mission[] = [
  {
    id: '1',
    title: 'Complete your first time trade',
    description: 'Successfully complete your first task trade on Tympact',
    xpReward: 50,
    status: 'Completed',
    progress: 100,
    category: 'Getting Started'
  },
  {
    id: '2',
    title: 'Refer a friend from your college',
    description: 'Invite a friend from your college to join Tympact',
    xpReward: 70,
    status: 'Incomplete',
    progress: 0,
    category: 'Community'
  },
  {
    id: '3',
    title: 'Complete a task worth more than 4 hours',
    description: 'Take on and complete a high-value task',
    xpReward: 90,
    status: 'In Progress',
    progress: 65,
    category: 'Achievement'
  },
  {
    id: '4',
    title: 'Maintain 90+ trust score for a month',
    description: 'Keep your trust score above 90 for 30 consecutive days',
    xpReward: 120,
    status: 'In Progress',
    progress: 80,
    category: 'Trust Building'
  }
];

// Sample Journal Entries
export const sampleJournalEntries: JournalEntry[] = [
  {
    id: '1',
    date: '2025-07-22',
    focusScore: 87,
    emotion: 'Motivated',
    activity: 'Designed 2 pages for NGO website',
    productivity: 85,
    notes: 'Great collaboration with the team. Feeling energized about the project.'
  },
  {
    id: '2',
    date: '2025-07-20',
    focusScore: 72,
    emotion: 'Frustrated',
    activity: 'Faced delays in data cleaning project',
    productivity: 65,
    notes: 'Data was messier than expected. Need better time estimation.'
  },
  {
    id: '3',
    date: '2025-07-18',
    focusScore: 94,
    emotion: 'Accomplished',
    activity: 'Completed translation project ahead of deadline',
    productivity: 92,
    notes: 'Perfect flow state. Client was very happy with the quality.'
  }
];

// Sample Rewards
export const sampleRewards: Reward[] = [
  {
    id: '1',
    title: 'Zomato ₹200 Gift Card',
    description: 'Enjoy delicious food with this Zomato gift voucher',
    creditsRequired: 12,
    category: 'Food & Dining',
    availability: 50,
    image: '/assets/reward-zomato.png'
  },
  {
    id: '2',
    title: 'Free Mentoring Session with IIT Alumni',
    description: '1-hour career guidance session with IIT Delhi alumni',
    creditsRequired: 15,
    category: 'Career Development',
    availability: 10,
    image: '/assets/reward-mentoring.png'
  },
  {
    id: '3',
    title: '1-month Task Priority Boost',
    description: 'Get your tasks featured at the top for one month',
    creditsRequired: 8,
    category: 'Platform Benefits',
    availability: 100,
    image: '/assets/reward-priority.png'
  },
  {
    id: '4',
    title: 'Udemy Course Access',
    description: 'Free access to any Udemy course worth up to ₹2000',
    creditsRequired: 20,
    category: 'Learning',
    availability: 25,
    image: '/assets/reward-udemy.png'
  }
];

// Sample NFT Badges
export const sampleNFTBadges: NFTBadge[] = [
  {
    id: '1',
    title: 'Time Warrior Badge',
    description: 'Awarded for completing 5 high-urgency tasks within deadlines',
    earnedBy: 'Completing 5 urgent tasks',
    design: 'Animated Fire Clock',
    rarity: 'Rare',
    earnedDate: '2025-07-20'
  },
  {
    id: '2',
    title: 'Karma Contributor',
    description: 'Recognized for donating 10+ hours to NGO projects',
    earnedBy: 'Donated 10 hrs to Pune NGO',
    design: 'Heart-Shaped Hourglass',
    rarity: 'Epic',
    earnedDate: '2025-07-15'
  },
  {
    id: '3',
    title: 'Trust Builder',
    description: 'Achieved and maintained 95+ trust score',
    earnedBy: 'Maintaining 95+ trust score',
    design: 'Golden Shield',
    rarity: 'Legendary',
    earnedDate: '2025-07-10'
  }
];

// Platform Stats
export const platformStats = {
  totalUsers: 12847,
  activeTasks: 342,
  timeTraded: '1,24,500 hrs',
  trustScore: 94.2,
  totalTrades: 8934,
  successRate: 97.8
};

export const sampleLeaderboard = sampleUsers.slice(0, 3);