import React, { useState, useMemo, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Coins,
  Wallet,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUp,
  LogOut,
  Settings,
  User,
  Mic,
  MoreHorizontal,
  Sparkles,
  Image as ImageIcon,
  Paperclip,
  Menu,
  X,
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  Code2,
  Briefcase,
  Target,
  GraduationCap,
  Heart,
  Brain,
  Compass,
  Lightbulb,
  Rocket,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { TokenInfo, BalanceInfo, SubscriptionInfo } from "@/components/dashboard/UserStats";

// import ThemeToggle from "@/components/ThemeToggle";

interface ChatSession {
  id: string;
  title: string;
  history: any[];
  createdAt: number;
}

const subjectChips = [
  // Academics
  { label: "Solve a Physics doubt", icon: Atom, color: "text-blue-500", prompt: "Help me solve a Physics doubt step by step" },
  { label: "Crack a Chemistry concept", icon: FlaskConical, color: "text-emerald-500", prompt: "Explain a Chemistry concept with examples" },
  { label: "Practice Math problems", icon: Calculator, color: "text-violet-500", prompt: "Give me Math practice problems with solutions" },
  { label: "Revise Biology fast", icon: Dna, color: "text-green-500", prompt: "Help me revise a Biology chapter quickly" },
  { label: "Plan my JEE prep", icon: GraduationCap, color: "text-indigo-500", prompt: "Build a 30-day JEE study plan for me" },
  // Career
  { label: "Build a career roadmap", icon: Compass, color: "text-cyan-500", prompt: "Map out a career roadmap based on my interests" },
  { label: "Mock interview me", icon: Briefcase, color: "text-amber-500", prompt: "Run a mock interview for an internship role" },
  { label: "Review my resume", icon: Target, color: "text-orange-500", prompt: "Review my resume and suggest improvements" },
  { label: "Learn to code", icon: Code2, color: "text-fuchsia-500", prompt: "Teach me coding from scratch with a 4-week plan" },
  { label: "Pitch a startup idea", icon: Rocket, color: "text-pink-500", prompt: "Help me refine and pitch a startup idea" },
  // Personal
  { label: "Beat procrastination today", icon: Lightbulb, color: "text-yellow-500", prompt: "Help me beat procrastination and focus today" },
  { label: "Boost my confidence", icon: Heart, color: "text-rose-500", prompt: "Give me tips to boost my confidence and self-belief" },
  { label: "Improve my mindset", icon: Brain, color: "text-purple-500", prompt: "Coach me on building a growth mindset" },
];

// Soft floating particles for AI ambience - memoized to reduce lag
const FloatingParticle = React.memo(({ delay, x, y, hue }: { delay: number; x: string; y: string; hue: string }) => (
  <motion.div
    className="absolute w-1.5 h-1.5 rounded-full"
    style={{ left: x, top: y, background: hue }}
    animate={{
      y: [0, -34, 0],
      opacity: [0, 0.7, 0],
      scale: [0.5, 1.2, 0.5],
    }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  />
));
FloatingParticle.displayName = "FloatingParticle";

const rotatingPrompts = [
  "Ask me to explain photosynthesis like you're 12…",
  "Build a 30-day JEE study plan with me…",
  "Help me crack a UI/UX internship interview…",
  "What's the roadmap to become a product designer?",
  "Solve this trigonometry doubt step-by-step…",
  "Give me a daily routine for NEET prep…",
  "Teach me spoken English in 10 minutes a day…",
  "Explain Newton's third law with a real example…",
];

const Dashboard = () => {
  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allChats, setAllChats] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Dialog states for stats
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const displayText = useTypewriter(rotatingPrompts);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const CustomMenuIcon = () => (
    <div className="flex flex-col gap-1.5 items-start">
      <div className="w-5 h-0.5 bg-foreground rounded-full" />
      <div className="w-3.5 h-0.5 bg-foreground rounded-full" />
    </div>
  );

  // Load chats from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("gruhap_chats");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAllChats(parsed);
      } catch (e) {
        console.error("Failed to parse saved chats", e);
      }
    }
  }, []);

  // Save chats to localStorage whenever allChats changes
  useEffect(() => {
    localStorage.setItem("gruhap_chats", JSON.stringify(allChats));
  }, [allChats]);



  // Track viewport size for responsive sidebar default state
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Handle initial query from HeroSection
  useEffect(() => {
    if (location.state?.query) {
      handleSend(undefined, location.state.query);
      // Clear location state to prevent re-sending on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);


  // Typewriter handled by hook


  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "good morning";
    if (h < 17) return "good afternoon";
    if (h < 21) return "good evening";
    return "good night";
  }, []);

  const particles = useMemo(() => {
    const hues = [
      "hsl(var(--brand-blue) / 0.45)",
      "hsl(280 80% 75% / 0.45)",
      "hsl(330 90% 80% / 0.45)",
      "hsl(var(--cta-orange) / 0.4)",
    ];
    return Array.from({ length: 12 }, (_, i) => ({
      delay: i * 0.6,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      hue: hues[i % hues.length],
    }));
  }, []);

  const handleSend = async (e?: React.FormEvent, overrideMsg?: string) => {
    if (e) e.preventDefault();
    const msg = overrideMsg || message;
    if (!msg.trim() || isLoading) return;

    const newUserMsg = { u: msg };
    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);
    setMessage("");
    setIsLoading(true);

    // If it's a new chat, create it with a temporary title while AI responds
    let activeId = currentChatId;
    if (!activeId) {
      activeId = Date.now().toString();
      setCurrentChatId(activeId);
      const newChat: ChatSession = {
        id: activeId,
        title: "New Chat",
        history: updatedHistory,
        createdAt: Date.now()
      };
      setAllChats(prev => [newChat, ...prev]);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMsg: msg, history: updatedHistory })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.details || errorData.error || `Server responded with ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      const finalAIResponse = {
        u: msg,
        a: data.response,
        snapshot: data.snapshot,
        topic: data.topic,
        youtube_results: data.youtube_results
      };

      setChatHistory(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = finalAIResponse;
        return updated;
      });

      // Update allChats with the AI response and use server-generated title if provided
      setAllChats(prev => prev.map(chat => {
        if (chat.id === activeId) {
          const updatedChat = { ...chat, history: [...chat.history.slice(0, -1), finalAIResponse] };
          // Use the AI-generated title from the server (only on first message)
          if (data.chatTitle) {
            updatedChat.title = data.chatTitle;
          }
          return updatedChat;
        }
        return chat;
      }));

    } catch (error: any) {
      console.error("Failed to send message:", error);
      const errorMsg = error.message || "Sorry, I encountered an error. Please check if the AI server is running.";
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].a = errorMsg;
        return updated;
      });

      setAllChats(prev => prev.map(chat => {
        if (chat.id === activeId) {
          const last = { ...chat.history[chat.history.length - 1], a: errorMsg };
          return { ...chat, history: [...chat.history.slice(0, -1), last] };
        }
        return chat;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setChatHistory([]);
    setCurrentChatId(null);
    setMessage("");
    if (isMobile) setSidebarOpen(false);
  };

  const loadChat = (chat: ChatSession) => {
    setCurrentChatId(chat.id);
    setChatHistory(chat.history);
    if (isMobile) setSidebarOpen(false);
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAllChats(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) {
      startNewChat();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatHistory, isLoading]);


  // Homepage-aligned surface utilities
  const surfaceCard = "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border";
  const surfaceItem =
    "bg-white border border-border hover:border-primary/30 hover:bg-muted/20 transition-all";
  const iconBtn =
    "p-2 rounded-xl bg-white border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all";


  return (
    <div className="dashboard-shell h-screen flex bg-background text-foreground relative overflow-hidden">
      {/* Lively pastel mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-gradient-animated" />
        {/* Soft blue mesh blobs - matched to homepage hero */}
        <motion.div
          className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-[110px]"
          style={{ background: "radial-gradient(circle, hsl(228 80% 75% / 0.40), transparent 70%)" }}
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-32 w-[560px] h-[560px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, hsl(220 80% 80% / 0.35), transparent 70%)" }}
          animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, hsl(var(--brand-blue) / 0.35), transparent 70%)" }}
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-10 right-1/4 w-[300px] h-[300px] rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle, hsl(240 70% 88% / 0.45), transparent 70%)" }}
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Mobile overlay when sidebar open */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className={`fixed lg:relative z-40 w-[270px] h-[calc(100vh-1.5rem)] flex flex-col m-3 rounded-3xl ${surfaceCard}`}
          >
            {/* Brand */}
            <div className="flex items-center justify-between px-4 h-14 shrink-0">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cta to-amber-400 flex items-center justify-center shadow-md hover-glow">
                  <span className="text-cta-foreground font-display font-bold">G</span>
                </div>
                <span className="font-display font-bold text-lg tracking-tight">Gruhap</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                aria-label="Collapse sidebar"
              >
                {isMobile ? <X size={16} /> : <CustomMenuIcon />}
              </button>
            </div>

            {/* New chat + search */}
            <div className="px-3 pt-3 space-y-2 shrink-0">
              <button
                onClick={startNewChat}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-md hover-glow hover:bg-primary/90 transition-colors"
              >
                <Plus size={16} className="text-cta" />
                New chat
              </button>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-foreground ${surfaceItem}`}
              >
                <Search size={16} className="text-muted-foreground" />
                Search
              </button>
            </div>

            {/* Recent */}
            <div className="flex-1 px-3 mt-5 overflow-y-auto chat-scrollbar min-h-0">
              <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground px-3 mb-2">
                Recent
              </div>
              <ul className="space-y-1">
                {allChats.length === 0 ? (
                  <div className="px-3 py-8 text-center">
                    <p className="text-xs text-muted-foreground">No recent chats</p>
                  </div>
                ) : (
                  allChats.map((chat) => (
                    <li key={chat.id}>
                      <div
                        onClick={() => loadChat(chat)}
                        className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${currentChatId === chat.id
                          ? "bg-muted text-foreground"
                          : "text-foreground/90 hover:text-foreground hover:bg-muted/60"
                          }`}
                      >
                        <span className="truncate text-left flex-1 mr-2">{chat.title}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded-md transition-all"
                            >
                              <MoreHorizontal size={14} className="text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl">
                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={(e) => deleteChat(chat.id, e)}>
                              Delete Chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Footer profile */}
            <div className="p-3 shrink-0">
              <button
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl ${surfaceItem}`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cta to-amber-400 flex items-center justify-center text-cta-foreground font-bold text-sm shadow-md uppercase">
                  {user?.displayName?.[0] || user?.email?.[0] || "U"}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-semibold truncate">{user?.displayName || user?.email?.split('@')[0] || "User"}</div>
                  <div className="text-[11px] font-medium text-muted-foreground truncate">{user?.subscription || "Free plan"}</div>
                </div>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <div className="flex-1 flex flex-col h-screen relative w-full overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 bg-transparent">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                aria-label="Open sidebar"
              >
                {isMobile ? <Menu size={16} /> : <CustomMenuIcon />}
              </button>
            )}
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cta to-amber-400 flex items-center justify-center shadow-md">
                <span className="text-cta-foreground font-display font-bold text-sm">G</span>
              </div>
              <span className="font-display font-bold">Gruhap</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* <ThemeToggle /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-cta to-amber-400 flex items-center justify-center text-cta-foreground font-bold text-sm shadow-md hover-glow hover:scale-105 transition-transform"
                  aria-label="Account menu"
                >
                  {user?.displayName?.[0] || user?.email?.[0] || "U"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveDialog("tokens")}>
                  <Coins className="mr-2 h-4 w-4 text-amber-500" /> Tokens
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveDialog("balance")}>
                  <Wallet className="mr-2 h-4 w-4 text-emerald-500" /> Balance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveDialog("subscription")}>
                  <ShieldCheck className="mr-2 h-4 w-4 text-primary" /> Plan Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/login">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Layout Restructured */}
        <main className="relative flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
          {/* Floating particles for AI ambience - absolute to main */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p, i) => (
              <FloatingParticle key={i} {...p} />
            ))}
          </div>

          {/* Scrollable Chat Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto chat-scrollbar px-4 sm:px-6"
          >
            <div className="max-w-2xl mx-auto pt-10 sm:pt-20 md:pt-32 pb-10">
              {chatHistory.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  {/* Greeting */}
                  <motion.h1
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-center tracking-tight px-2"
                  >
                    Hey, <span className="text-gradient">{greeting}!</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-2 sm:mt-3 text-center text-sm sm:text-base md:text-lg text-muted-foreground px-2"
                  >
                    What can I help with?
                  </motion.p>

                  {/* Category Boxes */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 sm:mt-12 w-full px-2"
                  >
                    {[
                      { label: "Self Growth", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/5", prompt: "Help me with my personal development journey" },
                      { label: "Academics", icon: GraduationCap, color: "text-indigo-500", bg: "bg-indigo-500/5", prompt: "I need help with my school/college studies" },
                      { label: "Career Growth", icon: Compass, color: "text-cyan-500", bg: "bg-cyan-500/5", prompt: "Advise me on my career path and skills" },
                      { label: "Other", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/5", prompt: "Let's explore something new together" },
                    ].map((box, i) => (
                      <button
                        key={box.label}
                        onClick={() => handleSend(undefined, box.prompt)}
                        className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border border-border/50 ${box.bg} hover:border-primary/20 transition-all group`}
                      >
                        <div className={`p-2 sm:p-3 rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform`}>
                          <box.icon className={box.color} size={20} />
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold text-foreground/80 uppercase tracking-wider">{box.label}</span>
                      </button>
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                <div className="w-full space-y-8">
                  {chatHistory.map((chat, idx) => (
                    <div key={idx} className="space-y-6">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-muted text-foreground text-sm shadow-sm">
                          {chat.u}
                        </div>
                      </div>

                      {/* AI Response */}
                      {chat.a ? (
                        <div className="flex justify-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cta to-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                            <Sparkles size={16} className="text-white" />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed markdown-content">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex, rehypeHighlight]}
                              >
                                {chat.a}
                              </ReactMarkdown>
                            </div>

                            {/* YouTube Results */}
                            {chat.youtube_results && chat.youtube_results.length > 0 && (
                              <div className="mt-6 space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                  <ImageIcon size={14} /> Recommended Resources
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {chat.youtube_results.map((vid: any, i: number) => (
                                    <a
                                      key={i}
                                      href={vid[1]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block p-3 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all group"
                                    >
                                      <p className="text-xs font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                        {vid[0]}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground mt-1">Watch on YouTube</p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cta to-amber-400 flex items-center justify-center shrink-0 animate-pulse">
                            <Sparkles size={16} className="text-white" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fixed Bottom Input Area */}
          <div className="w-full max-w-2xl mx-auto px-4 pb-6 pt-2 shrink-0 relative z-10">

            {/* Subject chips — Moved above input and only for new chat */}
            {chatHistory.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="w-full mb-4 group/marquee"
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                  }}
                >
                  <motion.div
                    className="flex gap-3 w-max py-1"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                  >
                    {[...subjectChips, ...subjectChips].map((s, i) => (
                      <button
                        key={`${s.label}-${i}`}
                        onClick={() => handleSend(undefined, s.prompt)}
                        className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border text-xs font-display font-medium tracking-tight text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card hover:-translate-y-0.5 shadow-sm transition-all"
                      >
                        <s.icon size={14} className={s.color} />
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Composer pill - lively neumorphism */}
            <motion.form
              onSubmit={handleSend}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full"
            >
              <div className={`relative rounded-3xl sm:rounded-full p-3 ${surfaceCard}`}>
                <div className="relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder=""
                    aria-label="Ask Gruhap anything"
                    className="w-full bg-transparent outline-none text-base px-3 py-2.5 text-foreground relative z-10"
                  />
                  {!message && (
                    <div className="pointer-events-none absolute inset-0 flex items-center px-3 overflow-hidden">
                      <span className="text-base text-muted-foreground truncate w-full flex items-center">
                        {displayText}
                        <motion.span
                          className="inline-block w-0.5 h-4 bg-cta ml-0.5"
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        />
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1 px-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card transition-colors"
                      aria-label="Add image"
                    >
                      <ImageIcon size={16} />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card transition-colors"
                      aria-label="Attach file"
                    >
                      <Paperclip size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card transition-colors"
                      aria-label="Voice input"
                    >
                      <Mic size={16} />
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      type="submit"
                      disabled={!message.trim()}
                      className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover-glow hover:bg-primary/90 transition-all"
                      aria-label="Send"
                    >
                      <ArrowUp size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.form>

            <p className="mt-3 text-center text-[10px] text-muted-foreground px-4">
              Gruhap can make mistakes. Please double-check important answers.
            </p>
          </div>
        </main>
      </div>
      {/* Stats Dialogs */}
      <Dialog open={activeDialog !== null} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="capitalize">{activeDialog} Information</DialogTitle>
          </DialogHeader>
          {activeDialog === "tokens" && <TokenInfo />}
          {activeDialog === "balance" && <BalanceInfo />}
          {activeDialog === "subscription" && <SubscriptionInfo />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
