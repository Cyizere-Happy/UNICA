'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/lib/gatepass/apiService';
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
  BadgeCheck,
  X 
} from 'lucide-react';
import Image from 'next/image';
import '@/components/gatepass/AuthStyles.css';

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: string;
  schoolName: string;
};

import { useSearchParams } from 'next/navigation';

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
    schoolName: 'Unicavilla',
  });

  useEffect(() => {
    const sessionToken = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    if (sessionToken && userRaw) {
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

  // Handle invitation token
  useEffect(() => {
    if (token) {
      setIsLogin(false); // Switch to registration form if token is present
      validateInvite(token);
    }
  }, [token]);

  const validateInvite = async (t: string) => {
    setVerifyingToken(true);
    setTokenError(null);
    try {
      const invite = await apiService.validateInvitation(t);
      setRegisterData(prev => ({
        ...prev,
        email: invite.email,
        role: invite.role,
      }));
    } catch (err: any) {
      setTokenError(err.response?.data?.message || 'Invalid or expired invitation token');
      toast.error('Invitation validation failed');
    } finally {
      setVerifyingToken(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      setLoading(true);
      try {
        const data = await apiService.login({ identifier: loginData.email, password: loginData.password });
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
    if (registerData.name && registerData.email && registerData.password && token) {
      setLoading(true);
      try {
        await apiService.register(registerData, token);
        toast.success('Registration successful! Please login.');
        setIsLogin(true);
        // Clear token from URL
        router.replace('/management/admin');
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
            <Home size={32} className="text-white" />
          </div>
          
          <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'signin' : 'register'}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="w-full h-full bg-white/10 backdrop-blur-md rounded-[48px] border border-white/20 shadow-2xl flex items-center justify-center p-8"
              >
                <Image 
                  src={isLogin ? "/admin_mascot_signin.png" : "/admin_mascot_register.png"}
                  alt="Admin Mascot"
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <h1>{isLogin ? "Welcome Back, Manager" : "Start Your Management Journey"}</h1>
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
              <span className="text-white font-black text-lg italic">U.V</span>
            </div>
            <span className="text-lg font-black tracking-tight text-[#292f36]">
              unica<span className="text-accent font-medium">villa</span>
            </span>
          </div>
          <div className="text-sm font-medium text-gray-500">
            {isLogin ? (
              token ? (
                <>Ready to join? <button onClick={() => setIsLogin(false)} className="text-accent font-bold hover:underline">Complete Setup</button></>
              ) : null
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
                  <h2>Welcome back to Unicavilla!</h2>
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
                {!token ? (
                  <div className="auth-welcome text-center py-12">
                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Lock className="text-amber-500 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-[#292f36] mb-2">Restricted Access</h2>
                    <p className="text-gray-500 max-w-[280px] mx-auto text-sm leading-relaxed">
                      Registration is restricted to invited staff only. Please contact your administrator for an invitation link.
                    </p>
                    <button 
                      onClick={() => setIsLogin(true)}
                      className="mt-8 text-accent font-bold text-sm hover:underline"
                    >
                      Back to Sign In
                    </button>
                  </div>
                ) : verifyingToken ? (
                  <div className="auth-welcome text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">Validating your invitation...</p>
                  </div>
                ) : tokenError ? (
                  <div className="auth-welcome text-center py-12">
                     <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <X className="text-rose-500 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-[#292f36] mb-2">Invalid Link</h2>
                    <p className="text-gray-500 max-w-[280px] mx-auto text-sm leading-relaxed">
                      {tokenError}
                    </p>
                    <button 
                      onClick={() => setIsLogin(true)}
                      className="mt-8 text-accent font-bold text-sm hover:underline"
                    >
                      Back to Sign In
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="auth-welcome">
                      <h2>Complete Your Setup</h2>
                      <p>Finish setting up your {registerData.role.toLowerCase()} account</p>
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
                        <div className="input-wrapper disabled">
                          <input
                            type="email"
                            value={registerData.email}
                            disabled
                            className="bg-gray-50 cursor-not-allowed opacity-70"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                          <label>Role</label>
                          <div className="input-wrapper disabled">
                            <input
                              type="text"
                              value={registerData.role}
                              disabled
                              className="bg-gray-50 cursor-not-allowed opacity-70"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Property</label>
                          <div className="input-wrapper disabled">
                            <input
                              type="text"
                              value="Unicavilla"
                              disabled
                              className="bg-gray-50 cursor-not-allowed opacity-70"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Create Password</label>
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
                        {loading ? 'Finalizing Setup...' : 'Complete Registration'} <ChevronRight size={18} />
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="auth-footer">
          <div>&copy; 2026 Unicavilla</div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
