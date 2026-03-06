import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Plane } from 'lucide-react';

export function Login() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginData.email, loginData.password);
    if (success) {
      toast.success('Login successful!');
      // Note: The redirect will happen in useEffect below when user state updates
    } else {
      toast.error('Invalid credentials. Please check your email and password.');
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
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (registerData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const success = await register(registerData.name, registerData.email, registerData.password);
    if (success) {
      toast.success('Registration successful!');
      // Redirect will happen in useEffect when user state updates
    } else {
      toast.error('Registration failed. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Plane className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400">Sign in to access your account</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
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
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Login
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
                    <div>
                      <label className="block text-sm mb-2">Full Name</label>
                      <Input
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, name: e.target.value })
                        }
                        placeholder="John Doe"
                        required
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
                        className="bg-slate-800 border-slate-700"
                      />
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
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Register
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}