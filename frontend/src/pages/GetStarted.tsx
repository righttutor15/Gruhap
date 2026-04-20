import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setAuthSuccess, setAuthFailure } from "@/store/slices/authSlice";
import { RootState } from "@/store";

const benefits = [
  "Unlimited AI tutor access",
  "Personalized study plans",
  "24/7 doubt solving",
  "Community access",
];

const GetStarted = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
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
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 hero-gradient-animated flex-col items-center justify-center p-12 overflow-hidden border-r border-border/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg space-y-8"
        >
          {/* Logo & Intro */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-cta flex items-center justify-center shadow-lg shadow-cta/20">
                <span className="text-cta-foreground font-display font-bold text-xl">G</span>
              </div>
              <span className="font-display font-bold text-2xl text-foreground tracking-tight">Gruhap</span>
            </Link>
            <h2 className="font-display text-4xl font-bold text-foreground leading-tight">
              Start Your AI-Powered Journey
            </h2>
            <p className="text-muted-foreground text-lg">
              Unlock a smarter way to study and achieve your goals.
            </p>
          </div>

          {/* Chat Preview - Discovery Theme */}
          <div className="relative space-y-4 bg-background/40 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
            {/* AI Message */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-cta flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                <span className="text-cta-foreground font-bold text-xs uppercase">G</span>
              </div>
              <div className="bg-card p-4 rounded-2xl rounded-tl-none border border-border/50 shadow-sm max-w-[80%]">
                <p className="text-xs font-bold text-cta uppercase mb-1 tracking-wider">Gruhap AI</p>
                <p className="text-sm text-foreground leading-relaxed">Excited to have you! Tell me, what's your biggest challenge in studying currently?</p>
              </div>
            </motion.div>

            {/* User Message */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-start gap-3 flex-row-reverse"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                <span className="text-primary font-bold text-xs uppercase">U</span>
              </div>
              <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                <p className="text-sm leading-relaxed font-medium">I find it hard to manage time and stay consistent.</p>
              </div>
            </motion.div>

            {/* AI Message 2 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-cta flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                <span className="text-cta-foreground font-bold text-xs uppercase">G</span>
              </div>
              <div className="bg-card p-4 rounded-2xl rounded-tl-none border border-border/50 shadow-sm max-w-[80%]">
                <p className="text-xs font-bold text-cta uppercase mb-1 tracking-wider">Gruhap AI</p>
                <p className="text-sm text-foreground leading-relaxed">I can help with that! We can set up a personalized schedule and I'll send you nudge reminders. Shall we start?</p>
              </div>
            </motion.div>

            {/* Floating Illustration Background */}
            <div className="absolute -bottom-12 -right-12 w-64 h-64 opacity-20 blur-3xl bg-cta/40 rounded-full z-0" />
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 + (i * 0.1) }}
                className="flex items-center gap-3 bg-background/30 backdrop-blur-xs p-3 rounded-xl border border-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-cta/10 flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-cta" />
                </div>
                <span className="text-xs font-medium text-foreground/80">{b}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel / Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-cta flex items-center justify-center">
              <span className="text-cta-foreground font-display font-bold text-lg">G</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">Gruhap</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground text-sm mb-8">Start learning for free today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
              <input
                type="text"
                required
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Preparing for</label>
              <select
                required
                value={form.exam}
                onChange={(e) => setForm({ ...form, exam: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select your exam</option>
                <option value="neet">NEET</option>
                <option value="jee">JEE</option>
                <option value="k12">K12 Subjects</option>
                <option value="other">Other</option>
              </select>
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"} <ArrowRight size={16} />
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-cta font-semibold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default GetStarted;
