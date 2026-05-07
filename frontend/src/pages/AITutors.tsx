import { useState } from "react";
import { ArrowLeft, Search, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTypewriter } from "@/hooks/useTypewriter";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import mentorUiux from "@/assets/mentor-uiux.jpg";
import mentorMarketing from "@/assets/mentor-marketing.jpg";
import mentorCommunication from "@/assets/mentor-communication.jpg";
import mentorPersonality from "@/assets/mentor-personality.jpg";
import mentorCoding from "@/assets/mentor-coding.jpg";
import mentorBusiness from "@/assets/mentor-business.jpg";
import mentorAcademics1 from "@/assets/mentor-academics-1.jpg";
import mentorAcademics2 from "@/assets/mentor-academics-2.jpg";
import mentorAcademics3 from "@/assets/mentor-academics-3.jpg";
import mentorSpokenEnglish from "@/assets/mentor-spoken-english.jpg";
import mentorInterview from "@/assets/mentor-interview.jpg";
import mentorCreator from "@/assets/mentor-creator.jpg";
import mentorDoubtSolver from "@/assets/mentor-doubt-solver.jpg";
import mentorProduct from "@/assets/mentor-product.jpg";
import mentorMindfulness from "@/assets/mentor-mindfulness.jpg";
import mentorProductivity from "@/assets/mentor-productivity.jpg";
import mentorEnglishLit from "@/assets/mentor-english-lit.jpg";

const categories = ["All", "Academics", "Career Growth", "Self Growth"];

const typingSuggestions = [
  "Search for a JEE Physics mentor...",
  "Find a UI/UX design expert...",
  "Look for a personality development coach...",
  "Search for NEET Biology experts...",
  "Find a digital marketing specialist...",
  "Search for a communication coach...",
];


const allTutors = [
  // ───── Academics (priority #1) ─────
  { name: "JEE Physics", category: "Academics", img: mentorAcademics2, rating: 4.8, students: "11K+", description: "Mechanics, optics, thermodynamics & problem-solving strategy." },
  { name: "JEE / NEET Chemistry", category: "Academics", img: mentorAcademics2, rating: 4.7, students: "10K+", description: "Organic, inorganic & physical chemistry, simplified." },
  { name: "JEE Math Advanced", category: "Academics", img: mentorAcademics1, rating: 4.9, students: "14K+", description: "Calculus, algebra, coordinate geometry & shortcuts." },
  { name: "NEET Biology", category: "Academics", img: mentorAcademics3, rating: 4.9, students: "12K+", description: "Genetics, ecology, human physiology with mnemonics." },
  { name: "K12 Mathematics", category: "Academics", img: mentorAcademics1, rating: 4.9, students: "18K+", description: "Class 6–12 CBSE & ICSE math with practice sets." },
  { name: "K12 Science", category: "Academics", img: mentorAcademics3, rating: 4.7, students: "15K+", description: "Physics, chemistry & biology fundamentals for schoolers." },
  { name: "English Grammar & Writing", category: "Academics", img: mentorEnglishLit, rating: 4.5, students: "10K+", description: "Grammar, essays, comprehension & creative writing." },
  { name: "Computer Science Basics", category: "Academics", img: mentorCoding, rating: 4.8, students: "12K+", description: "CS theory, programming logic & school-level coding." },
  { name: "Social Studies", category: "Academics", img: mentorAcademics2, rating: 4.6, students: "8K+", description: "History, geography & civics made interesting." },
  { name: "Economics & Accountancy", category: "Academics", img: mentorBusiness, rating: 4.6, students: "5K+", description: "Senior-grade econ & accounting concepts simplified." },

  // ───── Career Growth (priority #2) ─────
  { name: "UI/UX Design Mentor", category: "Career Growth", img: mentorUiux, rating: 4.9, students: "18K+", description: "Wireframes, Figma, design systems, portfolio reviews & user research." },
  { name: "Digital Marketing Coach", category: "Career Growth", img: mentorMarketing, rating: 4.8, students: "15K+", description: "SEO, paid ads, email & social — build a 30-day growth playbook." },
  { name: "Code Mentor", category: "Career Growth", img: mentorCoding, rating: 4.9, students: "24K+", description: "Frontend, backend, DSA & full-stack projects with code reviews." },
  { name: "Startup & Strategy Coach", category: "Career Growth", img: mentorBusiness, rating: 4.7, students: "8K+", description: "Validate ideas, ship MVPs, perfect your pitch deck." },
  { name: "Content Creator Mentor", category: "Career Growth", img: mentorCreator, rating: 4.7, students: "11K+", description: "YouTube, reels, scripting, editing & creator-economy growth." },
  { name: "Product Thinking", category: "Career Growth", img: mentorProduct, rating: 4.6, students: "6K+", description: "User research, roadmaps, PRDs & product manager interview prep." },
  { name: "Data & Analytics", category: "Career Growth", img: mentorBusiness, rating: 4.8, students: "9K+", description: "Excel, SQL, dashboards & interpreting business metrics." },
  { name: "Photography & Editing", category: "Career Growth", img: mentorCreator, rating: 4.6, students: "5K+", description: "Composition, lighting, Lightroom & mobile photo editing." },

  // ───── Self Growth (priority #3) ─────
  { name: "Communication Coach", category: "Self Growth", img: mentorCommunication, rating: 4.9, students: "21K+", description: "Public speaking, written clarity, storytelling & active listening." },
  { name: "Personality Development", category: "Self Growth", img: mentorPersonality, rating: 4.9, students: "19K+", description: "Confidence, body language, mindset & social presence." },
  { name: "Spoken English", category: "Self Growth", img: mentorSpokenEnglish, rating: 4.8, students: "17K+", description: "Daily speaking drills, accent, vocabulary & fluency practice." },
  { name: "Interview Coach", category: "Self Growth", img: mentorInterview, rating: 4.8, students: "12K+", description: "HR, behavioural & technical interview rehearsals with feedback." },
  { name: "Productivity & Habits", category: "Self Growth", img: mentorProductivity, rating: 4.7, students: "10K+", description: "Build focus, beat procrastination & design your weekly system." },
  { name: "Mindfulness & Wellbeing", category: "Self Growth", img: mentorMindfulness, rating: 4.6, students: "7K+", description: "Stress, journaling, breathwork & student burnout recovery." },
];

const AITutors = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const displayText = useTypewriter(typingSuggestions);


  const filtered = allTutors.filter((t) => {
    const matchCategory = activeCategory === "All" || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Square grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(hsl(222 47% 11%) 1px, transparent 1px), linear-gradient(90deg, hsl(222 47% 11%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <Navbar />
      <main className="pt-24 pb-20 relative z-10">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-2">
            <Link to="/" aria-label="Back to home" className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-muted transition-colors">
              <ArrowLeft size={18} className="text-foreground" />
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">AI Mentors</h1>
          </div>
          <p className="text-muted-foreground mb-8 ml-14">
            Pick a mentor for any skill — chat, learn at your pace, and practice with instant feedback.
          </p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder=""
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-card text-sm text-foreground placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {!search && (
                <div className="absolute left-11 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <span className="text-sm text-muted-foreground">{displayText}</span>
                  <motion.span
                    className="inline-block w-0.5 h-4 bg-cta ml-0.5"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </div>
              )}
            </div>
            <div className="flex bg-muted rounded-full p-1 self-start overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filtered.map((tutor, i) => (
              <motion.div
                key={tutor.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-3">
                  <img
                    src={tutor.img}
                    alt={tutor.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-primary-foreground text-xs leading-relaxed">{tutor.description}</p>
                  </div>
                </div>
                <div className="glass-card rounded-xl py-3 px-3.5">
                  <p className="text-sm font-semibold text-foreground mb-1 line-clamp-1">{tutor.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">{tutor.students} learners</span>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-cta fill-cta" />
                      <span className="text-xs font-medium text-foreground">{tutor.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No mentors found matching your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AITutors;
