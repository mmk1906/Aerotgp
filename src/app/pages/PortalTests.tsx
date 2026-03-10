import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router';
import { GraduationCap, Clock, Award, TrendingUp, Play, Trophy, Medal, Crown } from 'lucide-react';
import { MCQTest, Quiz } from '../components/MCQTest';
import { mockQuizzes } from '../data/quizData';

export function PortalTests() {
  const { user } = useAuth();
  const location = useLocation();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [testAttempts, setTestAttempts] = useState<any[]>([]);
  const [quizzes] = useState<Quiz[]>(mockQuizzes);

  // Reset state when navigating to this page
  useEffect(() => {
    setSelectedQuiz(null);
    loadTestAttempts();
  }, [location.pathname]);

  const loadTestAttempts = () => {
    // Load test attempts from localStorage
    const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    const userAttempts = attempts.filter((a: any) => a.userId === user?.id);
    setTestAttempts(userAttempts);
  };

  useEffect(() => {
    if (user) {
      loadTestAttempts();
    }
  }, [user]);

  const getQuizAttempts = (quizId: string) => {
    return testAttempts.filter((a) => a.quizId === quizId);
  };

  const getBestScore = (quizId: string) => {
    const attempts = getQuizAttempts(quizId);
    if (attempts.length === 0) return null;
    return Math.max(...attempts.map((a) => a.score));
  };

  const getAverageScore = () => {
    if (testAttempts.length === 0) return 0;
    return Math.round(testAttempts.reduce((sum, a) => sum + a.score, 0) / testAttempts.length);
  };

  // Get leaderboard data from localStorage
  const getLeaderboard = () => {
    const allAttempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    
    // Group by user and calculate their best scores
    const userScores: Record<string, { name: string; bestScore: number; totalTests: number; avgScore: number }> = {};
    
    allAttempts.forEach((attempt: any) => {
      const userId = attempt.userId || 'unknown';
      if (!userScores[userId]) {
        userScores[userId] = {
          name: attempt.userName || 'Student',
          bestScore: 0,
          totalTests: 0,
          avgScore: 0
        };
      }
      
      userScores[userId].totalTests += 1;
      userScores[userId].bestScore = Math.max(userScores[userId].bestScore, attempt.score);
      userScores[userId].avgScore += attempt.score;
    });
    
    // Calculate average and convert to array
    const leaderboardArray = Object.entries(userScores).map(([userId, data]) => ({
      userId,
      ...data,
      avgScore: Math.round(data.avgScore / data.totalTests)
    }));
    
    // Sort by best score, then by average score
    return leaderboardArray.sort((a, b) => {
      if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
      return b.avgScore - a.avgScore;
    }).slice(0, 10); // Top 10
  };

  const leaderboard = getLeaderboard();
  const userRank = leaderboard.findIndex(entry => entry.userId === user?.id) + 1;

  if (selectedQuiz) {
    return <MCQTest quiz={selectedQuiz} onClose={() => setSelectedQuiz(null)} />;
  }

  const stats = [
    {
      label: 'Tests Taken',
      value: testAttempts.length,
      icon: GraduationCap,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Average Score',
      value: `${getAverageScore()}%`,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Questions',
      value: testAttempts.reduce((sum, a) => sum + a.totalQuestions, 0),
      icon: Award,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Time Spent',
      value: `${Math.round(testAttempts.reduce((sum, a) => sum + (a.timeTaken || 0), 0) / 60)}m`,
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">MCQ Tests</h1>
        <p className="text-gray-400">
          Test your aerospace knowledge with our comprehensive quizzes
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Available Tests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-blue-500" />
              <span>Available Quizzes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz, index) => {
                const attempts = getQuizAttempts(quiz.id);
                const bestScore = getBestScore(quiz.id);
                
                return (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{quiz.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{quiz.description}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        quiz.difficulty === 'Easy' ? 'bg-green-500/10' :
                        quiz.difficulty === 'Medium' ? 'bg-yellow-500/10' :
                        'bg-red-500/10'
                      }`}>
                        <GraduationCap className={`w-6 h-6 ${
                          quiz.difficulty === 'Easy' ? 'text-green-400' :
                          quiz.difficulty === 'Medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`} />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        {quiz.questions.length} Questions
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {quiz.timeLimit} min
                      </span>
                      <Badge variant={
                        quiz.difficulty === 'Easy' ? 'secondary' :
                        quiz.difficulty === 'Medium' ? 'default' :
                        'destructive'
                      }>
                        {quiz.difficulty}
                      </Badge>
                    </div>

                    {attempts.length > 0 && (
                      <div className="bg-gray-900/50 rounded-lg p-3 mb-4 border border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Best Score:</span>
                          <div className="flex items-center space-x-2">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="font-bold text-yellow-400">{bestScore}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-gray-400">Attempts:</span>
                          <span className="font-semibold">{attempts.length}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => setSelectedQuiz(quiz)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {attempts.length > 0 ? 'Retake Test' : 'Start Test'}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Attempts */}
      {testAttempts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-6 h-6 text-purple-500" />
                <span>Recent Attempts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testAttempts.slice(0, 5).map((attempt) => {
                  const quiz = quizzes.find((q) => q.id === attempt.quizId);
                  return (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{quiz?.title}</h4>
                        <p className="text-sm text-gray-400">
                          {new Date(attempt.completedAt).toLocaleDateString()} at{' '}
                          {new Date(attempt.completedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold">{attempt.score}%</p>
                          <p className="text-xs text-gray-400">
                            {attempt.correctAnswers}/{attempt.totalQuestions}
                          </p>
                        </div>
                        <Badge className={
                          attempt.score >= 80 ? 'bg-green-500/20 text-green-400' :
                          attempt.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }>
                          {attempt.score >= 80 ? 'Excellent' :
                           attempt.score >= 60 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <span>Leaderboard - Top Performers</span>
                </CardTitle>
                {userRank > 0 && (
                  <Badge className="bg-blue-500/20 text-blue-400">
                    Your Rank: #{userRank}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = entry.userId === user?.id;
                  const rank = index + 1;
                  
                  return (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        isCurrentUser 
                          ? 'bg-blue-500/20 border-2 border-blue-500/50' 
                          : 'bg-gray-800/50 border border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Rank Badge */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                          rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                          rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-gray-700/50 text-gray-400'
                        }`}>
                          {rank === 1 && <Crown className="w-6 h-6" />}
                          {rank === 2 && <Medal className="w-6 h-6" />}
                          {rank === 3 && <Trophy className="w-6 h-6" />}
                          {rank > 3 && `#${rank}`}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${isCurrentUser ? 'text-blue-300' : ''}`}>
                            {entry.name} {isCurrentUser && '(You)'}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{entry.totalTests} tests taken</span>
                            <span>•</span>
                            <span>Avg: {entry.avgScore}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-yellow-400">{entry.bestScore}%</p>
                          <p className="text-xs text-gray-400">Best Score</p>
                        </div>
                        <Badge className={
                          entry.bestScore >= 80 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          entry.bestScore >= 60 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        }>
                          {entry.bestScore >= 80 ? 'Excellent' :
                           entry.bestScore >= 60 ? 'Good' : 'Needs Work'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}