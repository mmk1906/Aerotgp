import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  questions: Question[];
  timeLimit: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  allowMultipleAttempts: boolean;
}

interface TestAttempt {
  id: string;
  quizId: string;
  studentEmail: string;
  answers: number[];
  score: number;
  completedAt: string;
}

interface MCQTestProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

export function MCQTest({ quiz, onComplete, onCancel }: MCQTestProps) {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit * 60); // in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isSubmitted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, isSubmitted]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (answers.some(a => a === -1)) {
      const confirmed = window.confirm('You have unanswered questions. Are you sure you want to submit?');
      if (!confirmed) return;
    }

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / quiz.questions.length) * 100;
    setScore(finalScore);
    setIsSubmitted(true);

    // Save attempt to localStorage
    const attempt: TestAttempt = {
      id: Date.now().toString(),
      quizId: quiz.id,
      studentEmail: user?.email || '',
      answers,
      score: finalScore,
      completedAt: new Date().toISOString(),
    };

    const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    attempts.push(attempt);
    localStorage.setItem('testAttempts', JSON.stringify(attempts));

    toast.success(`Test submitted! You scored ${finalScore.toFixed(1)}%`);
    onComplete(finalScore);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="mb-6">
              {score >= 60 ? (
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
              )}
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {score >= 60 ? 'Congratulations!' : 'Test Complete'}
            </h1>
            <p className="text-2xl text-gray-400 mb-2">Your Score</p>
            <p className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {score.toFixed(1)}%
            </p>
            <p className="text-xl text-gray-400 mt-4">
              {quiz.questions.filter((q, i) => answers[i] === q.correctAnswer).length} out of {quiz.questions.length} correct
            </p>
          </motion.div>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 mb-6">
            <CardHeader>
              <CardTitle>Answers Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quiz.questions.map((question, index) => {
                  const isCorrect = answers[index] === question.correctAnswer;
                  return (
                    <div key={question.id} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold flex-1">
                          {index + 1}. {question.questionText}
                        </h3>
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <div className="space-y-2 mb-3">
                        {question.options.map((option, optIndex) => {
                          const isSelected = answers[index] === optIndex;
                          const isCorrectAnswer = optIndex === question.correctAnswer;
                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg text-sm ${
                                isCorrectAnswer
                                  ? 'bg-green-900/30 border border-green-500'
                                  : isSelected
                                  ? 'bg-red-900/30 border border-red-500'
                                  : 'bg-slate-700/30'
                              }`}
                            >
                              {option}
                              {isCorrectAnswer && (
                                <span className="ml-2 text-green-400 text-xs">✓ Correct</span>
                              )}
                              {isSelected && !isCorrectAnswer && (
                                <span className="ml-2 text-red-400 text-xs">✗ Your answer</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg text-sm">
                        <p className="text-blue-400 font-semibold mb-1">Explanation:</p>
                        <p className="text-gray-400">{question.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button size="lg" onClick={onCancel}>
              Back to Tests
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            <div className={`flex items-center space-x-2 ${timeRemaining < 60 ? 'text-red-500' : 'text-blue-400'}`}>
              <Clock className="w-6 h-6" />
              <span className="text-2xl font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-gray-400">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQuestion.questionText}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                      answers[currentQuestionIndex] === index
                        ? 'bg-blue-600 border-2 border-blue-400'
                        : 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          answers[currentQuestionIndex] === index
                            ? 'border-white bg-white'
                            : 'border-gray-400'
                        }`}
                      >
                        {answers[currentQuestionIndex] === index && (
                          <div className="w-3 h-3 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-500 w-6'
                    : answers[index] !== -1
                    ? 'bg-green-500'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmit}>
              Submit Test
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Cancel Button */}
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel Test
          </Button>
        </div>
      </div>
    </div>
  );
}
