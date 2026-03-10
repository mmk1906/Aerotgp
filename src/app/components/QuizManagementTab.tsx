import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { FileQuestion, Plus, Edit, Trash2, Eye, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';
import { getAllMCQTests, createMCQTest, updateMCQTest, deleteMCQTest, MCQTest } from '../services/databaseService';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export function QuizManagementTab() {
  const [quizzes, setQuizzes] = useState<MCQTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<MCQTest | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    duration: 30,
    passingScore: 60,
    questions: [] as Question[],
  });
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const fetchedQuizzes = await getAllMCQTests();
      setQuizzes(fetchedQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingQuiz(null);
    setFormData({
      title: '',
      subject: 'Aerospace Engineering',
      description: '',
      duration: 30,
      passingScore: 60,
      questions: [],
    });
    setShowDialog(true);
  };

  const handleEdit = (quiz: MCQTest) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      subject: quiz.subject,
      description: quiz.description || '',
      duration: quiz.duration || 30,
      passingScore: quiz.passingScore || 60,
      questions: quiz.questions as Question[],
    });
    setShowDialog(true);
  };

  const addQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt.trim())) {
      toast.error('Please fill in all question fields');
      return;
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, currentQuestion],
    });

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    });

    toast.success('Question added');
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
    toast.success('Question removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    try {
      setSubmitting(true);

      const quizData = {
        ...formData,
        totalQuestions: formData.questions.length,
      };

      if (editingQuiz) {
        await updateMCQTest(editingQuiz.id!, quizData);
        toast.success('Quiz updated successfully');
      } else {
        await createMCQTest(quizData as MCQTest);
        toast.success('Quiz created successfully');
      }

      setShowDialog(false);
      loadQuizzes();
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await deleteMCQTest(id);
      toast.success('Quiz deleted successfully');
      loadQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Failed to delete quiz');
    }
  };

  return (
    <>
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <FileQuestion className="w-5 h-5 mr-2 text-blue-500" />
              Quiz Management
            </CardTitle>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Loading quizzes...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <FileQuestion className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No quizzes created yet</p>
              <Button onClick={handleAdd} className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Quiz
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Pass %</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{quiz.subject}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4 text-blue-400" />
                        {quiz.totalQuestions} questions
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {quiz.duration} min
                      </div>
                    </TableCell>
                    <TableCell>{quiz.passingScore}%</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(quiz)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(quiz.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              {editingQuiz ? 'Update the details of the quiz.' : 'Enter the details for the new quiz.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Quiz Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Introduction to Aerodynamics"
                  required
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Aerospace Engineering"
                  required
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the quiz"
                rows={3}
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  min="5"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>

            {/* Questions Section */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold mb-4">Questions ({formData.questions.length})</h3>

              {/* Added Questions List */}
              {formData.questions.length > 0 && (
                <div className="space-y-3 mb-6">
                  {formData.questions.map((q, index) => (
                    <Card key={index} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium mb-2">
                              {index + 1}. {q.question}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                              {q.options.map((opt, i) => (
                                <div key={i} className={i === q.correctAnswer ? 'text-green-400 font-medium' : ''}>
                                  {String.fromCharCode(65 + i)}. {opt}
                                  {i === q.correctAnswer && ' ✓'}
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeQuestion(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add New Question */}
              <Card className="bg-slate-800/30 border-slate-600">
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-medium text-blue-400">Add New Question</h4>

                  <div>
                    <Label>Question</Label>
                    <Textarea
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                      placeholder="Enter your question here"
                      rows={2}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i}>
                        <Label>Option {String.fromCharCode(65 + i)}</Label>
                        <Input
                          value={currentQuestion.options[i]}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[i] = e.target.value;
                            setCurrentQuestion({ ...currentQuestion, options: newOptions });
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + i)}`}
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label>Correct Answer</Label>
                    <select
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>

                  <div>
                    <Label>Explanation (Optional)</Label>
                    <Textarea
                      value={currentQuestion.explanation}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                      placeholder="Explain the correct answer"
                      rows={2}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={addQuestion}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button
                type="submit"
                disabled={submitting || formData.questions.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? 'Saving...' : editingQuiz ? 'Update Quiz' : 'Create Quiz'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}