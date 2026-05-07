import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X, ArrowRight, Mail, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const chatMessages = [
    { from: "ai", text: "Hey! Ready to crush your study goals today?" },
    { from: "user", text: "I'm having a hard time with Calculus integration." },
    { from: "ai", text: "I've got you! Should we start with a 1-min concept summary, or solve a practice problem together?" },
    { from: "user", text: "Let's solve a problem!" },
    { from: "ai", text: "Perfect. Let's master the substitution method step-by-step. You'll ace this!" },
];

const Login = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [mode, setMode] = useState<"phone" | "email">("phone");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 6) {
            toast({ title: "Invalid number", description: "Please enter a valid phone number." });
            return;
        }
        toast({ title: "Welcome back!", description: "Signed in successfully." });
        navigate("/dashboard");
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({ title: "Welcome back!", description: "Signed in successfully." });
        navigate("/dashboard");
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
                            Experience <span className="text-gradient">Gruhap</span>
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

            {/* RIGHT — Auth form */}
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
                        Welcome Back!
                    </h1>
                    <p className="text-muted-foreground text-sm text-center mb-8">
                        Sign in to continue your academic journey
                    </p>

                    {mode === "phone" ? (
                        <form onSubmit={handlePhoneSubmit} className="space-y-5">
                            <div className="flex gap-2">
                                <div className="flex items-center gap-2 px-3 h-12 rounded-xl border border-border bg-background shrink-0">
                                    <span className="text-base">🇮🇳</span>
                                    <span className="text-sm font-medium text-foreground">+91</span>
                                </div>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    required
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                    className="flex-1 px-4 h-12 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-semibold tracking-wide uppercase text-sm hover:opacity-90 transition-opacity"
                            >
                                Continue <ArrowRight size={16} />
                            </motion.button>

                            <div className="flex items-center gap-3 my-2">
                                <div className="flex-1 h-px bg-border" />
                                <span className="text-xs text-muted-foreground font-medium">OR</span>
                                <div className="flex-1 h-px bg-border" />
                            </div>

                            <button
                                type="button"
                                onClick={() => setMode("email")}
                                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-border bg-background text-foreground font-medium text-sm hover:bg-accent transition-colors"
                            >
                                <Mail size={16} /> Continue with Email
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="you@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-muted-foreground">
                                    <input type="checkbox" className="rounded border-border" />
                                    Remember me
                                </label>
                                <a href="#" className="text-cta hover:underline">Forgot password?</a>
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-semibold tracking-wide uppercase text-sm hover:opacity-90 transition-opacity"
                            >
                                Sign In <ArrowRight size={16} />
                            </motion.button>

                            <button
                                type="button"
                                onClick={() => setMode("phone")}
                                className="w-full text-center text-sm text-cta font-medium hover:underline"
                            >
                                ← Use phone number instead
                            </button>
                        </form>
                    )}

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        Don't have an account?{" "}
                        <Link to="/get-started" className="text-cta font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
