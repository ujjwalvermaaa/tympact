const firebase = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const users = [
  {
    id: 'user1',
    name: 'Rohit Malhotra',
    email: 'rohit@example.com',
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
  // ...add 4 more users
];

const tasks = [
  {
    id: uuidv4(),
    title: 'Design a logo',
    description: 'Need a creative logo for a new startup.',
    hours: 5,
    user: 'user1',
    badge: '🎨',
    category: 'Design',
    urgency: 'Medium',
    location: 'Remote',
    status: 'Open'
  },
  // ...add more tasks
];

const trades = [
  {
    id: uuidv4(),
    user: 'user1',
    task: 'Design a logo',
    status: 'Completed',
    hours: 5,
    reward: 300,
    date: '2024-06-01'
  },
  // ...add more trades (5 completed, 2 pending)
];

const badges = [
  { id: 'pro', label: '🌟 Pro' },
  { id: 'streak', label: '🔥 Streak' },
  { id: 'trusted', label: '💎 Trusted' }
];

const missions = [
  { id: uuidv4(), title: 'Complete your first trade', description: 'Finish your first time trade.', xpReward: 100, progress: 100, status: 'Completed' },
  // ...add more missions
];

const rewards = [
  { id: uuidv4(), title: 'Amazon Gift Card', description: 'Redeem for ₹500 Amazon voucher', creditsRequired: 100, image: '/assets/reward-amazon.png' },
  // ...add more rewards
];

const nfts = [
  { id: uuidv4(), title: 'TimeProof Genesis', description: 'First NFT for early adopters', rarity: 'Legendary', earnedDate: '2024-06-01' },
  // ...add more NFTs
];

async function populate() {
  firebase.initializeFirebase();
  const db = firebase.db;
  for (const user of users) {
    await db.collection('users').doc(user.id).set(user);
  }
  for (const task of tasks) {
    await db.collection('tasks').doc(task.id).set(task);
  }
  for (const trade of trades) {
    await db.collection('trades').doc(trade.id).set(trade);
  }
  for (const badge of badges) {
    await db.collection('badges').doc(badge.id).set(badge);
  }
  for (const mission of missions) {
    await db.collection('missions').doc(mission.id).set(mission);
  }
  for (const reward of rewards) {
    await db.collection('rewards').doc(reward.id).set(reward);
  }
  for (const nft of nfts) {
    await db.collection('nfts').doc(nft.id).set(nft);
  }
  console.log('Mock data populated!');
  process.exit(0);
}

// populate().catch(console.error); // Commented out to prevent automatic execution on server start 