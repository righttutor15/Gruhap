import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Brain,
  Palette,
  Megaphone,
  MessagesSquare,
  Code,
  Sparkles,
  GraduationCap,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  // ── Academics first ──
  { icon: GraduationCap, title: "JEE / NEET / K12", desc: "Topic-wise tutoring, previous-year papers, mock tests & instant doubt resolution.", tag: "Most Popular", group: "Academics" },
  { icon: Clock, title: "24/7 Doubt Solving", desc: "Stuck at midnight? Your AI mentor is awake. Ask anything, anytime, get a real answer.", tag: "Always On", group: "Academics" },
  // ── Career growth next ──
  { icon: Palette, title: "UI/UX Design Track", desc: "Wireframes, Figma, design systems and portfolio reviews — go from beginner to job-ready.", tag: null, group: "Career Growth" },
  { icon: Megaphone, title: "Digital Marketing", desc: "SEO, paid ads, content & email — build full growth playbooks with hands-on practice.", tag: null, group: "Career Growth" },
  { icon: Code, title: "Coding & Dev", desc: "Frontend, backend, DSA & projects — code reviews and structured roadmaps included.", tag: null, group: "Career Growth" },
  // ── Self growth last ──
  { icon: MessagesSquare, title: "Communication Skills", desc: "Public speaking, spoken English & written clarity. Daily drills with instant feedback.", tag: "Top Rated", group: "Self Growth" },
  { icon: Sparkles, title: "Personality Development", desc: "Confidence, body language, mindset & interview presence — soft skills that actually compound.", tag: null, group: "Self Growth" },
  { icon: Brain, title: "1-on-1 AI Mentorship", desc: "A dedicated AI mentor for every skill — chat freely, get explanations, drills, and reviews tuned to your pace.", tag: null, group: "Self Growth" },
];

const OurServices = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-28 pb-16 hero-gradient-animated overflow-hidden">
        {/* Square grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(222 47% 11%) 1px, transparent 1px), linear-gradient(90deg, hsl(222 47% 11%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4"
          >
            What You Can <span className="text-gradient">Learn</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            From cracking JEE to landing your first design job — pick a track, meet your AI mentor, and start.
          </motion.p>
        </div>
      </section>

      <section className="relative py-16 bg-background overflow-hidden">
        {/* Square grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(222 47% 11%) 1px, transparent 1px), linear-gradient(90deg, hsl(222 47% 11%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-6 flex flex-col relative group"
              >
                {s.tag && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-cta/10 text-cta">
                    {s.tag}
                  </span>
                )}
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <s.icon size={22} className="text-foreground" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 hero-gradient overflow-hidden">
        {/* Square grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(222 47% 11%) 1px, transparent 1px), linear-gradient(90deg, hsl(222 47% 11%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Ready to start learning?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Pick a mentor, ask your first question, and learn at your own pace. It's free to start.
          </p>
          <Link to="/ai-tutors" className="inline-flex px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Browse AI Mentors
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default OurServices;
