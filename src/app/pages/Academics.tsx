import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Download, BookOpen, Calendar, Clock, Award, Play, Lock, Library, ExternalLink } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { MCQTest, Quiz } from '../components/MCQTest';
import { mockQuizzes } from '../data/quizData';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function Academics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const courses = [
    {
      name: 'B.Tech in Aeronautical Engineering',
      duration: '4 Years',
      description: 'Comprehensive undergraduate program covering all aspects of aeronautical engineering',
    },
    {
      name: 'M.Tech in Aerospace Engineering',
      duration: '2 Years',
      description: 'Advanced postgraduate studies with specializations in various aerospace domains',
    },
    {
      name: 'Ph.D in Aerospace Engineering',
      duration: '3-5 Years',
      description: 'Doctoral research program focusing on advanced aerospace research and innovation',
    },
    {
      name: 'Diploma in Aeronautical Engineering',
      duration: '3 Years',
      description: 'Technical diploma program providing foundational skills in aircraft maintenance and design',
    },
  ];

  const semesters = [
    {
      sem: 'Semester 1-2',
      subjects: [
          'Linear Algebra and Calculus',
        'Chemical Process in Engineering',
        'Engineering Mechanics',
        'Chemical Process in Engineering-Lab',
        'IDEA-Lab & Engineering Workshop',
        'Environment Sustainability -Lab',
        'Fundamentals of Computer-Lab',
        'Social Internship',
        'Basics of Aircraft Design-Lab/CNC Machine and Programing-Lab/Building Maintenance -Lab',
        'Liberal Learning Module-I',
        'Differential Equation and Statistics',
        'Solid State Physics & Optics',
        'Solid State Physics & Optics-Lab',
        'Principle of Electrical Engineering',
        'Principle of Electrical Engineering -Lab',
        'Engineering & Computer Graphics',
        'Computer Aided Drawing-Lab',
        'C-Language-Lab',
        'Professional Etiquette',
        'Digital Wellness & Basic Communication Lab',
        'Liberal Learning Module-II',
      ],
    },
    {
      sem: 'Semester 3-4',
      subjects: [
        'Fluid Mechanics & Machinery',
        'Solid Mechanics',
        'Introduction to Aeronautical Engineering',
        'Engineering Economics for Managers',
        'Advance Mathematics',
        'Fluid Mechanics & Machinery Lab',
        'Solid Mechanics Lab',
        'Community Engineering Project',
        'Fundamentals of Thermodynamics',
        'Aerodynamics I',
        'Aerospace Materials',
        'Fundamentals of Thermodynamics Lab',
        'Aero Modeling Lab',
        'Computer Aided Drafting Lab',
        'Industrial Management',
        'Leadership and Team Dynamics',
        'Advance Manufacturing Technology',
      ],
    },
    {
      sem: 'Semester 5-6',
      subjects: [
        'Mechanics of Machines ',
        'Aircraft Propulsion ',
        'Flight Mechanics',
        'Aircraft Design',
        'Control Systems',
        'Avionics',
      ],
    },
    {
      sem: 'Semester 7-8',
      subjects: [
        'Composite Materials',
        'Computational Fluid Dynamics',
        'Rocket Propulsion',
        'Space Mechanics',
        'Electives',
        'Final Year Project',
      ],
    },
  ];

  const events = [
    { date: 'Jan 2026', event: 'Semester Begins' },
    { date: 'Mar 2026', event: 'Mid-Semester Exams' },
    { date: 'May 2026', event: 'End-Semester Exams' },
    { date: 'Jun-Jul 2026', event: 'Summer Break' },
    { date: 'Aug 2026', event: 'New Academic Year' },
  ];

  const handleStartTest = (quiz: Quiz) => {
    if (!user) {
      toast.error('Please login to take tests');
      navigate('/login');
      return;
    }

    // Check if user has already attempted this quiz
    const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    const userAttempts = attempts.filter(
      (a: any) => a.quizId === quiz.id && a.studentEmail === user.email
    );

    if (userAttempts.length > 0 && !quiz.allowMultipleAttempts) {
      toast.error('You have already attempted this test');
      return;
    }

    setSelectedQuiz(quiz);
  };

  const handleTestComplete = (score: number) => {
    // Test completion is handled in the MCQTest component
  };

  const handleCancelTest = () => {
    setSelectedQuiz(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-600';
      case 'Medium':
        return 'bg-yellow-600';
      case 'Hard':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (selectedQuiz) {
    return (
      <MCQTest
        quiz={selectedQuiz}
        onComplete={handleTestComplete}
        onCancel={handleCancelTest}
      />
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Academics
          </h1>
          <p className="text-xl text-gray-400">
            Comprehensive curriculum designed for excellence in aerospace engineering
          </p>
        </motion.div>

        {/* Courses Offered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Courses Offered</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:border-blue-500 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <BookOpen className="w-12 h-12 text-blue-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                    <p className="text-blue-400 text-sm mb-3">Duration: {course.duration}</p>
                    <p className="text-gray-400 text-sm">{course.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Semester-wise Subjects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Curriculum Structure</h2>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Syllabus
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {semesters.map((semester, index) => (
              <motion.div
                key={semester.sem}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-blue-400">{semester.sem}</h3>
                    <ul className="space-y-2">
                      {semester.subjects.map((subject) => (
                        <li key={subject} className="flex items-start space-x-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          <span className="text-gray-400 text-sm">{subject}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Departmental Digital Library */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Departmental Digital Library
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Access a comprehensive collection of books, notes, study materials, and previous year papers for all aerospace subjects
            </p>
          </div>

          <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm border-blue-700/50 hover:border-blue-500 transition-all duration-300 shadow-lg shadow-blue-900/20">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-blue-600/20 rounded-lg">
                      <Library className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold">Study Resources Hub</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    Our digital library provides students with easy access to essential learning materials organized by subject and semester. Find textbooks, lecture notes, reference materials, and examination papers all in one place.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { icon: BookOpen, label: 'Textbooks & References' },
                      { icon: Calendar, label: 'Previous Year Papers' },
                      { icon: Download, label: 'Lecture Notes' },
                      { icon: Award, label: 'Study Guides' },
                    ].map((item, index) => (
                      <div
                        key={item.label}
                        className="flex items-center space-x-2 p-3 bg-slate-800/50 rounded-lg"
                      >
                        <item.icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://drive.google.com/drive/folders/1WApyxlmxacIfPqYNeBtof_BA1UT2nFRk?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Library className="w-5 h-5 mr-2" />
                      Open Digital Library
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>

                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-600/20 rounded-lg blur-xl" />
                    <img
                      src="https://static.vecteezy.com/system/resources/thumbnails/004/730/129/small_2x/digital-online-library-isometric-flowchart-vector.jpg"
                      alt="Digital Library"
                      className="relative rounded-lg shadow-2xl object-cover h-80 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Resource Categories */}
              <div className="mt-8 pt-8 border-t border-gray-700">
                <h4 className="text-lg font-semibold mb-4 text-blue-400">Available Resources by Category:</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    'Aerodynamics',
                    'Aircraft Structures',
                    'Propulsion',
                    'Flight Mechanics',
                    'Previous Year Papers',
                  ].map((category) => (
                    <div
                      key={category}
                      className="flex items-center justify-center p-3 bg-slate-800/30 rounded-lg border border-blue-800/30 hover:border-blue-600/50 transition-colors"
                    >
                      <span className="text-sm text-gray-300 text-center">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Online MCQ Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Online MCQ Tests
            </h2>
            <p className="text-gray-400">
              Test your knowledge with our comprehensive quizzes on various aerospace subjects
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockQuizzes.map((quiz, index) => {
              const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
              const userAttempts = attempts.filter(
                (a: any) => a.quizId === quiz.id && a.studentEmail === user?.email
              );
              const hasAttempted = userAttempts.length > 0;
              const bestScore = hasAttempted
                ? Math.max(...userAttempts.map((a: any) => a.score))
                : null;

              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <BookOpen className="w-10 h-10 text-blue-500" />
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 flex-1">
                        {quiz.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <BookOpen className="w-4 h-4 mr-2" />
                          {quiz.questions.length} Questions
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          {quiz.timeLimit} Minutes
                        </div>
                        {hasAttempted && bestScore !== null && (
                          <div className="flex items-center text-sm text-green-400">
                            <Award className="w-4 h-4 mr-2" />
                            Best Score: {bestScore.toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleStartTest(quiz)}
                        disabled={hasAttempted && !quiz.allowMultipleAttempts}
                      >
                        {hasAttempted && !quiz.allowMultipleAttempts ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Already Attempted
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            {hasAttempted ? 'Retake Test' : 'Start Test'}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Academic Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8">Academic Calendar 2026</h2>
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-8">
              <div className="space-y-4">
                {events.map((item, index) => (
                  <motion.div
                    key={item.event}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    <Calendar className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold">{item.event}</div>
                      <div className="text-sm text-gray-400">{item.date}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}