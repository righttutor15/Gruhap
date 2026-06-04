import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X, ArrowRight, Eye, EyeOff, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setAuthFailure } from "@/store/slices/authSlice";
import { RootState } from "@/store";

const chatMessages = [
    { from: "ai", text: "Hey! Ready to crush your study goals today?" },
    { from: "user", text: "I just signed up — where do I start?" },
    { from: "ai", text: "Welcome aboard! Tell me your target exam and I'll build a personalized study plan instantly." },
    { from: "user", text: "I'm preparing for JEE Mains!" },
    { from: "ai", text: "Great choice! Let me craft a 90-day strategy covering Physics, Chemistry & Math. You've got this!" },
];

const Signup = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", exam: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password || !form.exam) {
            toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
            return;
        }

        if (form.password.length < 6) {
            toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" });
            return;
        }

        dispatch(setLoading(true));

        try {
            const response = await fetch(`${import.meta.env.VITE_AUTH_API_BASE_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast({ title: "Account Created! 🎉", description: "Welcome to Gruhap! Please login to continue." });
                navigate("/login");
            } else {
                const errorMsg = data.message || data.error || "Signup failed. Please try again.";
                dispatch(setAuthFailure(errorMsg));
                toast({ title: "Signup Failed", description: errorMsg, variant: "destructive" });
            }
        } catch (error) {
            dispatch(setAuthFailure("Something went wrong"));
            toast({ title: "Error", description: "Could not connect to the server. Please try again.", variant: "destructive" });
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
            {/* LEFT — Brand / Chat showcase */}
            <div className="relative hidden lg:flex flex-1 hero-gradient-animated overflow-hidden items-center justify-center p-12">
                {/* Soft floating orbs */}
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary/40 blur-3xl floating-animation" />
                <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-accent/30 blur-3xl floating-animation-delayed" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-md"
                >
                    <div className="text-center mb-10">
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                            Join <span className="text-gradient">Gruhap</span>
                        </h2>
                        <p className="text-muted-foreground mt-2 text-sm">Your Trusted AI Study Buddy</p>
                    </div>

                    <div className="space-y-4">
                        {chatMessages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.4, duration: 0.4 }}
                                className={`flex items-start gap-3 ${m.from === "user" ? "flex-row-reverse" : ""}`}
                            >
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 ${m.from === "ai"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-emerald-500 text-white"
                                        }`}
                                >
                                    {m.from === "ai" ? "G" : "U"}
                                </div>
                                <div
                                    className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${m.from === "ai"
                                        ? "bg-card text-card-foreground rounded-tl-sm"
                                        : "bg-primary text-primary-foreground rounded-tr-sm"
                                        }`}
                                >
                                    {m.from === "ai" && (
                                        <div className="text-[10px] font-bold tracking-wider text-primary mb-1 uppercase">
                                            Gruhap AI
                                        </div>
                                    )}
                                    {m.text}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* RIGHT — Signup form */}
            <div className="relative flex-1 flex items-center justify-center px-6 py-12">
                {/* Top controls */}
                <button
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                    className="absolute top-5 left-5 w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center text-foreground transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <Link
                    to="/"
                    aria-label="Close"
                    className="absolute top-5 right-5 w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center text-foreground transition-colors"
                >
                    <X size={18} />
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm"
                >
                    {/* Mobile brand */}
                    <Link to="/" className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="w-9 h-9 rounded-xl bg-cta flex items-center justify-center">
                            <span className="text-cta-foreground font-display font-bold text-lg">G</span>
                        </div>
                        <span className="font-display font-bold text-xl text-foreground">Gruhap</span>
                    </Link>

                    {/* Wordmark */}
                    <div className="text-center mb-6">
                        <h2 className="font-display text-3xl font-bold text-gradient">Gruhap</h2>
                    </div>

                    <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">
                        Create Account
                    </h1>
                    <p className="text-muted-foreground text-sm text-center mb-8">
                        Start your academic journey with AI
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. John Doe"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 h-12 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                                className="w-full px-4 h-12 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                                    className="w-full px-4 h-12 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 pr-10"
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
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Target Exam</label>
                            <div className="relative">
                                <select
                                    required
                                    value={form.exam}
                                    onChange={(e) => setForm({ ...form, exam: e.target.value })}
                                    className="w-full px-4 h-12 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Choose your path</option>
                                    <option value="neet">NEET Aspirant</option>
                                    <option value="jee">JEE Aspirant</option>
                                    <option value="k12">K12 Student</option>
                                    <option value="other">Other Exams</option>
                                </select>
                                <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none" />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-semibold tracking-wide uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight size={16} /></>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        Already have an account?{" "}
                        <Link to="/login" className="text-cta font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
