import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Brain, BookOpen, Users, BarChart3, Clock, Shield, Zap, Target } from "lucide-react";

const services = [
  { icon: Brain, title: "AI-Powered Tutoring", desc: "Personalized 1-on-1 tutoring powered by advanced AI that adapts to your learning style, pace, and weak areas.", tag: "Most Popular" },
  { icon: BookOpen, title: "NEET Preparation", desc: "Comprehensive Biology, Physics, and Chemistry preparation with topic-wise tests, previous year papers, and detailed solutions.", tag: null },
  { icon: Target, title: "JEE Coaching", desc: "Advanced Mathematics, Physics, and Chemistry coaching with problem-solving strategies and concept-building exercises.", tag: null },
  { icon: BarChart3, title: "Performance Analytics", desc: "Track your progress with detailed analytics, identify weak areas, and get personalized improvement roadmaps.", tag: "Smart" },
  { icon: Users, title: "Study Groups", desc: "Join peer study groups, participate in group discussions, and learn collaboratively with students from across India.", tag: null },
  { icon: Clock, title: "24/7 Doubt Solving", desc: "Get instant answers to your doubts any time of day. Our AI tutors are always available to help you.", tag: "Always On" },
  { icon: Shield, title: "Mock Tests & Analysis", desc: "Full-length mock tests simulating real exam conditions with instant scoring and detailed performance analysis.", tag: null },
  { icon: Zap, title: "Quick Revision Notes", desc: "AI-generated concise revision notes for last-minute preparation, customized to your learning history.", tag: "New" },
];

const OurServices = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-16 hero-gradient-animated">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4"
          >
            Our <span className="text-gradient">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Everything you need to ace your exams and master your subjects.
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-background">
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
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Join 50,000+ students already using Gruhap to ace their exams.</p>
          <a href="/dashboard" className="inline-flex px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Get Started Free
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default OurServices;
