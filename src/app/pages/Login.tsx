import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Plane, AlertCircle } from 'lucide-react';
import { resetPassword } from '../services/authService';

export function Login() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [activeTab, setActiveTab] = useState<string>('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await login(loginData.email, loginData.password);
      if (success) {
        toast.success('Login successful!');
        // Note: The redirect will happen in useEffect below when user state updates
      } else {
        toast.error('Invalid credentials. Please check your email and password.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect based on role after user state updates
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    }
  }, [user, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (registerData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!registerData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await register(registerData.name, registerData.email, registerData.password);
      if (success) {
        toast.success('Registration successful! Welcome aboard!');
        // Redirect will happen in useEffect when user state updates
      }
    } catch (error: any) {
      // Error is already handled in AuthContext, but we can add additional UI feedback
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await resetPassword(resetEmail);
      toast.success('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      toast.error('Failed to send reset email. Please check your email address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <Plane className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-gray-400">Sign in to access your account</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4 sm:p-6">
              {!showForgotPassword ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
                    <TabsTrigger value="login" className="text-sm sm:text-base">Login</TabsTrigger>
                    <TabsTrigger value="register" className="text-sm sm:text-base">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2">Email</label>
                        <Input
                          type="email"
                          value={loginData.email}
                          onChange={(e) =>
                            setLoginData({ ...loginData, email: e.target.value })
                          }
                          placeholder="your.email@example.com"
                          required
                          disabled={isSubmitting}
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Password</label>
                        <Input
                          type="password"
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({ ...loginData, password: e.target.value })
                          }
                          placeholder="••••••••"
                          required
                          disabled={isSubmitting}
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                      </Button>
                      <div className="text-sm text-gray-400 text-center mt-4">
                        <p>Credentials:</p>
                        <p></p>
                        <p>Any email / password (min 6 chars)</p>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      {/* Info banner about unique email */}
                      <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-300">
                          Each email can only be used once. If you already have an account, please log in.
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-2">Full Name</label>
                        <Input
                          value={registerData.name}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, name: e.target.value })
                          }
                          placeholder="John Doe"
                          required
                          disabled={isSubmitting}
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Email</label>
                        <Input
                          type="email"
                          value={registerData.email}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, email: e.target.value })
                          }
                          placeholder="your.email@example.com"
                          required
                          disabled={isSubmitting}
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Password</label>
                        <Input
                          type="password"
                          value={registerData.password}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, password: e.target.value })
                          }
                          placeholder="••••••••"
                          required
                          minLength={6}
                          disabled={isSubmitting}
                          className="bg-slate-800 border-slate-700"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Confirm Password</label>
                        <Input
                          type="password"
                          value={registerData.confirmPassword}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, confirmPassword: e.target.value })
                          }
                          placeholder="••••••••"
                          required
                          minLength={6}
                          disabled={isSubmitting}
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Account...' : 'Register'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Reset Password</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Email</label>
                      <Input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        disabled={isSubmitting}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowForgotPassword(false)}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}