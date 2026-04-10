'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/lib/gatepass/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  BadgeCheck 
} from 'lucide-react';
import '@/components/gatepass/AuthStyles.css';

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: string;
  schoolName: string;
};

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
    schoolName: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    if (token && userRaw) {
      try {
        const u = JSON.parse(userRaw) as { role?: string };
        if (u.role !== 'SUPER_ADMIN') {
          router.replace('/management/admin/dashboard');
        }
      } catch {
        /* ignore */
      }
    }
  }, [router]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      setLoading(true);
      try {
        const data = await apiService.login(loginData);
        const role = data.user?.role as string | undefined;
        if (role === 'SUPER_ADMIN') {
          toast.error('Use the super admin portal for this account.');
          apiService.logout();
          return;
        }
        router.replace('/management/admin/dashboard');
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } };
        toast.error(ax.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please enter Email and password');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (registerData.name && registerData.email && registerData.password) {
      setLoading(true);
      try {
        await apiService.register(registerData);
        toast.success('Registration successful! Please login.');
        setIsLogin(true);
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } };
        toast.error(ax.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <div className="auth-wrapper font-jost">
      {/* Left Pane - Marketing Content */}
      <div className="auth-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="auth-left-content"
        >
          <div className="auth-left-logo">
            <Home size={40} className="text-white" />
          </div>
          <h1>One Platform to Manage All Your House Bookings</h1>
          <p>
            Seamlessly coordinate visitors, staff, and resources with our all-in-one management suite.
            Experience the future of property management.
          </p>
          
          <div className="carousel-dots">
            <div className="dot active"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </motion.div>
        
        {/* Subtle background elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
        </div>
      </div>

      {/* Right Pane - Auth Forms */}
      <div className="auth-right">
        <header className="auth-header">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg italic">U</span>
            </div>
            <span className="text-lg font-black tracking-tight text-[#292f36]">
              unica<span className="text-accent font-medium">house</span>
            </span>
          </div>
          <div className="text-sm font-medium text-gray-500">
            {isLogin ? (
              <>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-accent font-bold hover:underline">Sign Up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setIsLogin(true)} className="text-accent font-bold hover:underline">Sign In</button></>
            )}
          </div>
        </header>

        <main className="auth-form-container">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="auth-welcome">
                  <h2>Welcome back to UNICA!</h2>
                  <p>Please enter your details to sign in your account</p>
                </div>

                <div className="social-login">
                  <button className="social-btn">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                    Continue with Google
                  </button>
                  <button className="social-btn">
                    <img src="https://www.svgrepo.com/show/442938/apple.svg" alt="Apple" />
                    Continue with Apple
                  </button>
                </div>

                <div className="divider">Or sign in with</div>

                <form onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label>Email</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <div 
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="signin-btn" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'} <ChevronRight size={18} />
                  </button>

                  <a href="#" className="forgot-password">Forgot password?</a>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="auth-welcome">
                  <h2>Join UNICA House</h2>
                  <p>Start managing your property with ease today</p>
                </div>

                <form onSubmit={handleRegisterSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label>Role</label>
                      <div className="input-wrapper">
                        <select
                          value={registerData.role}
                          onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                        >
                          <option value="ADMIN">House Admin</option>
                          <option value="SECURITY">Security Staff</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>House Name</label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          placeholder="Unica House"
                          value={registerData.schoolName}
                          onChange={(e) => setRegisterData({ ...registerData, schoolName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                      <div 
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="signin-btn" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'} <ChevronRight size={18} />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="auth-footer">
          <div>&copy; 2026 UNICA House</div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
