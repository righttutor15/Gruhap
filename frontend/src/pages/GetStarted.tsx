import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Plus,
  Search,
  ChevronRight,
  Settings,
  User,
  LogOut,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setAuthFailure } from "@/store/slices/authSlice";
import { RootState } from "@/store";
import './Dashboard.css'; // Reuse dashboard styles

const GetStarted = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", exam: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: "Account Created!", description: "Welcome to Gruhap! Please login to continue." });
        navigate('/login');
      } else {
        dispatch(setAuthFailure(data.error));
        toast({ title: "Signup Failed", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      dispatch(setAuthFailure("Something went wrong"));
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="dashboard-container overflow-hidden bg-white">
      {/* Sidebar Mockup */}
      <aside className="dashboard-sidebar hidden lg:flex">
        <div className="sidebar-header">
          <Link to="/" className="brand">
            <div className="brand-icon">
              <div className="w-8 h-8 rounded-lg bg-cta flex items-center justify-center shadow-lg shadow-cta/20">
                <span className="text-white font-bold text-lg">G</span>
              </div>
            </div>
            <span className="brand-name ml-2">Gruhap</span>
          </Link>
          <button className="sidebar-toggle-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" /></svg>
          </button>
        </div>

        <div className="sidebar-content">
          <div className="main-nav">
            <button className="nav-item new-chat-btn">
              <Plus size={18} className="nav-icon" />
              <span className="nav-label">New chat</span>
            </button>
            <button className="nav-item">
              <Search size={18} className="nav-icon" />
              <span className="nav-label">Search</span>
            </button>
          </div>

          <div className="recents-section">
            <h3 className="section-title">RECENT</h3>
            <div className="recent-items space-y-1">
              {[
                "JEE Physics — Rotational M...",
                "Balance redox equations",
                "Class 10 Trigonometry doub...",
                "NEET Biology revision plan",
                "Explain Newton's third law"
              ].map((text, i) => (
                <div key={i} className="recent-item-container opacity-50">
                  <button className="recent-item">
                    <MessageSquare size={14} className="flex-shrink-0" />
                    <span className="recent-text">{text}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar-footer p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cta flex items-center justify-center text-white text-xs font-bold">A</div>
            <div className="user-info">
              <span className="user-name">Guest User</span>
              <span className="user-plan text-[10px]">Free plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main flex-1 bg-[#f8f9fa] relative flex flex-col overflow-y-auto">
        {/* Header Mockup */}
        <header className="main-header py-4 px-8 flex justify-end items-center sticky top-0 bg-[#f8f9fa]/80 backdrop-blur-md z-20">
          <div className="top-avatar-container relative">
            <img
              src="https://img.freepik.com/premium-photo/web-developer-digital-avatar-generative-ai_934475-9048.jpg"
              className="top-avatar w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-cta/50 transition-all shadow-sm"
              alt="Avatar"
              onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
            />

            <AnimatePresence>
              {isAvatarMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
                >
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-600">
                    <User size={16} /> Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-600">
                    <Settings size={16} /> Settings
                  </button>
                  <div className="h-px bg-gray-100 my-1" />
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-600">
                    <LogOut size={16} /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Center Welcome & Form */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cta/10 border border-cta/20 mb-6 mx-auto shadow-sm">
              <Sparkles size={14} className="text-cta" />
              <span className="text-[10px] font-bold text-cta uppercase tracking-widest">Sign Up Now</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Hey, <span className="text-[#3b49df]">good evening!</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium">How can I help you today? Let's start by creating your account.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <div className="w-24 h-24 bg-cta rounded-full blur-3xl" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-cta/10 focus:border-cta/30 transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-cta/10 focus:border-cta/30 transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-cta/10 focus:border-cta/30 transition-all pr-12 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Target Exam</label>
                <div className="relative">
                  <select
                    required
                    value={form.exam}
                    onChange={(e) => setForm({ ...form, exam: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-cta/10 focus:border-cta/30 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Choose your path</option>
                    <option value="neet">NEET Aspirant</option>
                    <option value="jee">JEE Aspirant</option>
                    <option value="k12">K12 Student</option>
                    <option value="other">Other Exams</option>
                  </select>
                  <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#ff6b35] text-white font-bold shadow-[0_10px_20px_rgba(255,107,53,0.2)] hover:bg-[#ff7b4b] transition-all disabled:opacity-50 mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-8">
              Already have an account?{" "}
              <Link to="/login" className="text-cta font-bold hover:underline decoration-2 underline-offset-4">Sign In</Link>
            </p>
          </motion.div>
        </div>

        {/* Footer info text from screenshot */}
        <p className="text-[10px] text-gray-400 text-center pb-8 opacity-60">
          Gruhap can make mistakes. Please double-check important answers.
        </p>
      </main>
    </div>
  );
};

export default GetStarted;

