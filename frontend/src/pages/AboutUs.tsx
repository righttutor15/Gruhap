import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Target, Eye, Users, Award, BookOpen, Lightbulb } from "lucide-react";

const values = [
  { icon: Target, title: "Mission-Driven", desc: "Democratizing quality education through AI for every student in India." },
  { icon: Eye, title: "Innovation First", desc: "Leveraging cutting-edge AI to create personalized learning experiences." },
  { icon: Users, title: "Community Focus", desc: "Building a supportive ecosystem where students help each other grow." },
  { icon: Award, title: "Excellence", desc: "Committed to delivering the highest quality educational content." },
  { icon: BookOpen, title: "Accessibility", desc: "Making premium education affordable and available to all." },
  { icon: Lightbulb, title: "Empowerment", desc: "Equipping students with tools and confidence to achieve their dreams." },
];

const team = [
  { name: "Arjun Mehta", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces" },
  { name: "Priya Sharma", role: "Head of AI", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces" },
  { name: "Rahul Verma", role: "Lead Educator", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=faces" },
  { name: "Sneha Patel", role: "Product Design", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=faces" },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
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
            About <span className="text-gradient">Gruhap</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            We're on a mission to revolutionize education in India through AI-powered personalized learning.
          </motion.p>
        </div>
      </section>

      {/* Story */}
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
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Born from a simple frustration — quality education shouldn't be a privilege. In 2024, our founders,
                a group of IIT alumni and educators, set out to build an AI platform that adapts to each student's
                unique learning pace and style.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, Gruhap serves 50,000+ students across India, helping them crack NEET, JEE, and excel in
                K12 subjects with AI tutors that never sleep, never judge, and always adapt.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "50K+", label: "Active Students" },
                { value: "200+", label: "AI Tutors" },
                { value: "95%", label: "Success Rate" },
                { value: "24/7", label: "Availability" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card rounded-2xl p-6 text-center">
                  <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-16 hero-gradient overflow-hidden">
        {/* Square grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(222 47% 11%) 1px, transparent 1px), linear-gradient(90deg, hsl(222 47% 11%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6"
              >
                <v.icon size={24} className="text-cta mb-3" />
                <h3 className="font-display font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutUs;
