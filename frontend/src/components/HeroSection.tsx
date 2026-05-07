import { useState, useEffect, useCallback } from "react";
import { ArrowUp, ChevronDown, Sparkles, Zap, BookOpen } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTypewriter } from "@/hooks/useTypewriter";


const floatingBubbles = [
  { text: "Let's redesign your portfolio in Figma", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces", side: "left" as const, top: "18%", x: "6%" },
  { text: "Ready to crack your next interview", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces", side: "right" as const, top: "14%", x: "6%" },
  { text: "Calculus concepts made simple today", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=faces", side: "left" as const, top: "58%", x: "3%" },
  { text: "Practice your pitch with me anytime", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces", side: "right" as const, top: "60%", x: "3%" },
];

const subjects = [
  // Academics first
  { name: "JEE / NEET", icon: "📚" },
  { name: "K12 Math & Science", icon: "📐" },
  { name: "Doubt Solving", icon: "💡" },
  // Career growth
  { name: "UI/UX Design", icon: "🎨" },
  { name: "Digital Marketing", icon: "📣" },
  { name: "Coding", icon: "💻" },
  // Self growth
  { name: "Communication", icon: "💬" },
  { name: "Spoken English", icon: "🗣️" },
  { name: "Personality Dev", icon: "✨" },
];

const typingTexts = [
  "generate a 30-day roadmap for UI/UX design...",
  "solve my JEE Physics doubt on thermodynamics...",
  "teach me Digital Marketing from scratch...",
  "help me practice Spoken English fluently...",
  "explain mitosis vs meiosis in simple terms...",
  "prepare a mock interview for Product Management...",
  "how can I improve my productivity as a student?",
];


const FloatingParticle = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.div
    className="absolute w-1.5 h-1.5 rounded-full bg-primary/20"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -30, 0],
      opacity: [0, 0.6, 0],
      scale: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const displayText = useTypewriter(typingTexts);
  const [hoveredSubject, setHoveredSubject] = useState<number | null>(null);


  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate("/dashboard", { state: { query: searchQuery.trim() } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const glowX = useTransform(smoothX, (v) => `${v}px`);
  const glowY = useTransform(smoothY, (v) => `${v}px`);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Category");

  const categories = ["JEE", "NEET", "K12 Subjects", "Other"];

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  // Typing animation removed - handled by hook


  const particles = Array.from({ length: 30 }, (_, i) => ({
    delay: i * 0.5,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
  }));

  return (
    <section
      className="relative min-h-screen pt-24 pb-16 overflow-hidden"
      id="home"
      onMouseMove={handleMouseMove}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 hero-gradient-animated" />

      {/* Cursor-reactive glow */}
      <motion.div
        className="pointer-events-none absolute w-[500px] h-[500px] rounded-full opacity-30 blur-[120px]"
        style={{
          left: glowX,
          top: glowY,
          x: "-50%",
          y: "-50%",
          background: "radial-gradient(circle, hsl(228 80% 70% / 0.4) 0%, transparent 70%)",
        }}
      />

      {/* Emerging central glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1.2 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500 blur-[120px] pointer-events-none z-0"
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(hsl(222 47% 11%) 1px, transparent 1px), linear-gradient(90deg, hsl(222 47% 11%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating Bubbles */}
      <div className="hidden lg:block">
        {floatingBubbles.map((bubble, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.2, duration: 0.7, type: "spring" }}
            className="absolute floating-animation"
            style={{
              top: bubble.top,
              [bubble.side]: bubble.x,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className={`flex items-center gap-3 ${bubble.side === "right" ? "flex-row-reverse" : ""}`}
            >
              <div className="relative">
                <img
                  src={bubble.img}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-card shadow-lg"
                />
                <motion.div
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-cta border-2 border-card"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="glass-card-elevated rounded-2xl px-4 py-3 max-w-[200px]">
                <p className="text-xs font-medium text-foreground">{bubble.text}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh] relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-center max-w-3xl mt-6 sm:mt-10"
        >
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-5 leading-[1.1] tracking-tight">
            <span className="text-gradient">Your Trusted</span>
            <br />
            <span className="relative inline-block">
              <span className="text-gradient">Buddy</span>
              <motion.svg
                className="absolute -bottom-1 sm:-bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              >
                <motion.path
                  d="M2 8 C 40 2, 80 2, 100 6 C 120 10, 160 4, 198 6"
                  fill="none"
                  stroke="hsl(24 95% 53%)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                />
              </motion.svg>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-10 max-w-lg mx-auto px-4"
          >
            Get Instant Guidance with AI Mentors.
          </motion.p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-xl relative z-50 px-2 sm:px-0"
        >
          <motion.div
            whileHover={{ boxShadow: "0 12px 40px -8px hsl(228 80% 50% / 0.15)" }}
            className="glass-card-elevated rounded-2xl p-4 sm:p-5 transition-shadow duration-300"
          >
            <div className="flex items-start gap-2 mb-3 relative">
              <BookOpen size={16} className="text-muted-foreground mt-3 flex-shrink-0" />
              <div className="flex-1 min-h-[44px] sm:min-h-[52px] relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-foreground placeholder:text-transparent z-10 py-2"
                  autoFocus
                />
                {!searchQuery && (
                  <div className="absolute left-0 pointer-events-none flex items-center h-full">
                    <span className="text-xs sm:text-sm text-foreground">Ask gruhap to </span>
                    <span className="text-xs sm:text-sm text-muted-foreground ml-1">{displayText}</span>
                    <motion.span
                      className="inline-block w-0.5 h-3.5 sm:h-4 bg-cta ml-0.5 align-middle"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between relative z-20">
              <div className="relative">
                <motion.button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground border border-border rounded-lg px-2 sm:px-3 py-1.5 hover:bg-muted transition-colors"
                >
                  {selectedCategory}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-40 glass-card border border-border rounded-xl shadow-xl overflow-hidden z-50 py-1"
                    >
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-primary/10 hover:text-primary ${selectedCategory === category ? 'text-primary bg-primary/5 font-medium' : 'text-muted-foreground'
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                onClick={handleSearch}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center shadow-md hover-glow"
              >
                <ArrowUp size={16} className="text-primary-foreground" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Subject Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className=" w-full max-w-2xl overflow-hidden py-10"
        >
          <div className="flex marquee whitespace-nowrap min-h-[80px] items-center">
            {[...subjects, ...subjects, ...subjects].map((subject, i) => (
              <motion.span
                key={i}
                onHoverStart={() => setHoveredSubject(i)}
                onHoverEnd={() => setHoveredSubject(null)}
                whileHover={{ scale: 1.08, y: -2 }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 mx-1.5 rounded-full border border-border bg-card/80 backdrop-blur-sm text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card transition-all cursor-pointer shadow-sm"
              >
                <span className="text-sm">{subject.icon}</span> {subject.name}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 flex items-center gap-8 md:gap-12"
        >
          {[
            { value: "50K+", label: "Students" },
            { value: "200+", label: "AI Tutors" },
            { value: "95%", label: "Success Rate" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2 }}
              className="text-center"
            >
              <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div> */}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
