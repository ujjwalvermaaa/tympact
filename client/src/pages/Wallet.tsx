import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet as WalletIcon, 
  Clock, 
  TrendingUp, 
  Star, 
  ArrowUpRight, 
  ArrowDownLeft,
  Plus,
  Minus,
  Gift,
  Target,
  Zap,
  Heart,
  Brain,
  Award,
  PieChart,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { sampleTrades, sampleRewards } from '@/data/sampleData';

export default function Wallet() {
  const { user, updateUser } = useAuth();
  const [transferAmount, setTransferAmount] = useState('');
  const { toast } = useToast();

  const handleTimeTransfer = (type: 'add' | 'withdraw') => {
    const amount = parseFloat(transferAmount);
    if (!amount || !user) return;

    const currentHours = parseInt(user.timeBalance.split(' ')[0]);
    
    if (type === 'withdraw' && currentHours < amount) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough time hours to withdraw.",
        variant: "destructive"
      });
      return;
    }

    const newHours = type === 'add' ? currentHours + amount : currentHours - amount;
    updateUser({ timeBalance: `${newHours} hrs` });
    
    toast({
      title: type === 'add' ? "Time Added! ⏰" : "Time Withdrawn! 💰",
      description: `${amount} hours ${type === 'add' ? 'added to' : 'withdrawn from'} your wallet.`,
    });
    
    setTransferAmount('');
  };

  const walletStats = {
    timeBalance: user?.timeBalance || '0 hrs',
    xpPoints: user?.xpPoints || 0,
    trustScore: user?.trustScore || 0,
    karmaPoints: 1250,
    emotionalCredits: 85,
    estimatedValue: 4250, // ₹ equivalent
    monthlyEarnings: '+12 hrs',
    portfolioGrowth: '+23%'
  };

  const recentTransactions = [
    {
      id: '1',
      type: 'earned',
      description: 'Completed NGO website design',
      amount: '+5 hrs',
      monetaryValue: '+₹1200',
      date: '2025-07-22',
      emotional: true
    },
    {
      id: '2',
      type: 'spent',
      description: 'Received marketing consultation',
      amount: '-3 hrs',
      date: '2025-07-20',
      emotional: false
    },
    {
      id: '3',
      type: 'earned',
      description: 'Mentored 2 junior developers',
      amount: '+4 hrs',
      emotionalBonus: '+2 hrs',
      date: '2025-07-18',
      emotional: true
    },
    {
      id: '4',
      type: 'reward',
      description: 'Mission completion bonus',
      amount: '+1 hr',
      xpBonus: '+50 XP',
      date: '2025-07-15',
      emotional: false
    }
  ];

  const investmentPortfolio = [
    { name: 'Skill Development', allocation: 35, value: '6 hrs', roi: '+18%' },
    { name: 'Community Projects', allocation: 25, value: '4.5 hrs', roi: '+45%' },
    { name: 'Mentoring Others', allocation: 20, value: '3.5 hrs', roi: '+32%' },
    { name: 'Learning Sessions', allocation: 20, value: '3 hrs', roi: '+12%' }
  ];

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient">Time Wallet</h1>
          <p className="text-xl text-muted-foreground">
            Manage your time currency, track investments, and optimize your time ROI
          </p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient">{walletStats.timeBalance}</div>
              <div className="text-sm text-muted-foreground">Available Time</div>
              <div className="text-xs text-green-600 mt-1">{walletStats.monthlyEarnings} this month</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient">{walletStats.xpPoints}</div>
              <div className="text-sm text-muted-foreground">XP Points</div>
              <div className="text-xs text-blue-600 mt-1">Level {Math.floor(walletStats.xpPoints / 500) + 1}</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient">{walletStats.emotionalCredits}</div>
              <div className="text-sm text-muted-foreground">Emotional Credits</div>
              <div className="text-xs text-purple-600 mt-1">High EQ Bonus</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient">₹{walletStats.estimatedValue}</div>
              <div className="text-sm text-muted-foreground">Portfolio Value</div>
              <div className="text-xs text-green-600 mt-1">{walletStats.portfolioGrowth} growth</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <WalletIcon className="h-5 w-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Hours"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={() => handleTimeTransfer('add')} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                    <Button onClick={() => handleTimeTransfer('withdraw')} size="sm" variant="outline">
                      <Minus className="h-4 w-4 mr-1" />
                      Withdraw
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full">
                      <Gift className="h-4 w-4 mr-2" />
                      Send Gift
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Target className="h-4 w-4 mr-2" />
                      Set Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Trust & Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Trust & Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Trust Score</span>
                      <span className="font-semibold">{walletStats.trustScore}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${walletStats.trustScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-accent/5 rounded-lg">
                      <div className="text-lg font-bold text-gradient">{walletStats.karmaPoints}</div>
                      <div className="text-xs text-muted-foreground">Karma Points</div>
                    </div>
                    <div className="text-center p-3 bg-accent/5 rounded-lg">
                      <div className="text-lg font-bold text-gradient">98.5%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/5">
                      <div className="flex items-center space-x-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'earned' ? 'bg-green-500/10' :
                          transaction.type === 'spent' ? 'bg-red-500/10' : 'bg-blue-500/10'
                        }`}>
                          {transaction.type === 'earned' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : transaction.type === 'spent' ? (
                            <ArrowDownLeft className="h-4 w-4 text-red-500" />
                          ) : (
                            <Gift className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground flex items-center space-x-2">
                            <span>{transaction.date}</span>
                            {transaction.emotional && (
                              <Badge variant="outline" className="text-xs">
                                <Heart className="h-3 w-3 mr-1" />
                                Emotional
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.type === 'earned' ? 'text-green-600' : 
                          transaction.type === 'spent' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {transaction.amount}
                        </div>
                        {transaction.monetaryValue && (
                          <div className="text-xs text-muted-foreground">{transaction.monetaryValue}</div>
                        )}
                        {transaction.emotionalBonus && (
                          <div className="text-xs text-purple-600">{transaction.emotionalBonus}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'earned' ? 'bg-green-500/10' :
                            transaction.type === 'spent' ? 'bg-red-500/10' : 'bg-blue-500/10'
                          }`}>
                            {transaction.type === 'earned' ? (
                              <ArrowUpRight className="h-5 w-5 text-green-500" />
                            ) : transaction.type === 'spent' ? (
                              <ArrowDownLeft className="h-5 w-5 text-red-500" />
                            ) : (
                              <Gift className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground flex items-center space-x-2">
                              <span>{transaction.date}</span>
                              {transaction.emotional && (
                                <Badge variant="outline" className="text-xs">
                                  <Heart className="h-3 w-3 mr-1" />
                                  Emotional Task
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            transaction.type === 'earned' ? 'text-green-600' : 
                            transaction.type === 'spent' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {transaction.amount}
                          </div>
                          {transaction.monetaryValue && (
                            <div className="text-sm text-muted-foreground">{transaction.monetaryValue}</div>
                          )}
                          {transaction.emotionalBonus && (
                            <div className="text-sm text-purple-600 font-medium">{transaction.emotionalBonus}</div>
                          )}
                          {transaction.xpBonus && (
                            <div className="text-sm text-blue-600 font-medium">{transaction.xpBonus}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Time Investment Portfolio</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {investmentPortfolio.map((investment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{investment.name}</span>
                        <div className="text-right">
                          <span className="font-semibold">{investment.value}</span>
                          <span className="text-sm text-green-600 ml-2">{investment.roi}</span>
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${investment.allocation}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {investment.allocation}% of portfolio
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRewards.map((reward) => (
                <Card key={reward.id} className="hover:shadow-elegant transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <img 
                        src={reward.image} 
                        alt={reward.title}
                        className="h-16 w-16 mx-auto rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/reward-default.png';
                        }}
                      />
                      <div>
                        <h3 className="font-semibold">{reward.title}</h3>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{reward.creditsRequired} credits</span>
                        </div>
                        <Badge variant="outline">{reward.category}</Badge>
                      </div>
                      <Button 
                        className="w-full bg-gradient-primary"
                        disabled={walletStats.xpPoints < reward.creditsRequired * 10}
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Redeem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span>Time Intelligence Report</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Time Efficiency</span>
                      <span className="font-semibold">87%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">ROI Optimization</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Emotional Engagement</span>
                      <span className="font-semibold">79%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '79%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-lg font-bold text-green-600">+24 hrs</div>
                      <div className="text-xs text-green-700">Time Earned</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">-12 hrs</div>
                      <div className="text-xs text-blue-700">Time Spent</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasks Completed</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average Rating</span>
                      <span className="font-semibold">4.9/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Emotional Tasks</span>
                      <span className="font-semibold">3 (38%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Net Time Growth</span>
                      <span className="font-semibold text-green-600">+12 hrs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}