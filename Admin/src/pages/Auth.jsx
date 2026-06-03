import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, ArrowRight, ShieldAlert, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = ({ setAuthUser }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = isLogin
      ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/auth/login`
      : `${import.meta.env.VITE_API_BASE_URL}/api/admin/auth/signup`;

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store auth token / user info in localStorage
        const userSession = {
          uid: data.uid,
          displayName: data.displayName || formData.name || data.email,
          email: formData.email,
          token: data.token,
          role: data.role
        };
        localStorage.setItem('adminUser', JSON.stringify(userSession));
        setAuthUser(userSession);
        navigate('/');
      } else {
        setError(data.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Cannot connect to server. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    // Mock login/signup for social providers
    const userSession = {
      uid: `mock_${platform}_${Date.now()}`,
      displayName: `Admin User (${platform})`,
      email: `admin_${platform}@gruhap.com`
    };
    localStorage.setItem('adminUser', JSON.stringify(userSession));
    setAuthUser(userSession);
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#09090b] text-[#fafafa] font-sans">
      {/* Left Column: Admin info/branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 border-r border-zinc-800 flex-col justify-between p-12 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

        {/* Logo/Brand */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight font-display bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
            GruhaP Admin Console
          </span>
        </div>

        {/* Description / Feature pitch */}
        <div className="my-auto max-w-md z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight font-display bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Manage your platform with precision.
            </h1>
            <p className="text-zinc-400 leading-relaxed text-[15px]">
              The core control center for GruhaP app. Monitor metrics, resolve inquiries, analyze transaction data, and update user access profiles seamlessly.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="flex gap-3 items-start">
              <div className="p-1 rounded bg-zinc-900 border border-zinc-800 text-blue-400 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-200">Real-Time Metrics</h4>
                <p className="text-xs text-zinc-500">Track user signups, total platform revenue, and live activity.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-1 rounded bg-zinc-900 border border-zinc-800 text-blue-400 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-200">User Management & Support</h4>
                <p className="text-xs text-zinc-500">Edit exam tiers, user details, and resolve customer support tickets instantly.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-1 rounded bg-zinc-900 border border-zinc-800 text-blue-400 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-200">Financial Reporting</h4>
                <p className="text-xs text-zinc-500">Comprehensive overview of monthly earnings, tier conversions, and payment histories.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-zinc-600 z-10">
          © {new Date().getFullYear()} GruhaP. All rights reserved. Secure administrator authorization portal.
        </div>
      </div>

      {/* Right Column: Interactive Login/Signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#09090b]">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white font-display">
              {isLogin ? 'Login' : 'Create an account'}
            </h2>
            <p className="text-zinc-400 text-sm">
              {isLogin
                ? 'Enter your email below to login to your account'
                : 'Enter your details to register a new admin account'}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-red-400 text-xs transition-all">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-1.5"
                >
                  <label htmlFor="name" className="text-xs font-semibold text-zinc-300">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={15} />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#18181b] border border-zinc-800 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-zinc-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={15} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="contact@bundui.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-zinc-300">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setError('Password reset is not configured.')}
                    className="text-xs text-zinc-400 hover:text-white underline underline-offset-2 hover:no-underline"
                  >
                    Forgot your password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={15} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>



            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-[0.99] transition-all mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{isLogin ? 'Login' : 'Sign up'}</span>
              )}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-zinc-500 text-xs font-medium">or continue with</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          {/* <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 rounded-lg py-2 text-sm font-medium transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#ea4335"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fbbc05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#4285f4"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

          </div> */}

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              {isLogin ? (
                <>Don't have an account? <span className="text-blue-400 hover:underline font-semibold">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-blue-400 hover:underline font-semibold">Login</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Auth;
