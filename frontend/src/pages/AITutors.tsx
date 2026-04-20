import { useState } from "react";
import { ArrowLeft, Search, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";
import tutor5 from "@/assets/tutor-5.jpg";
import tutor6 from "@/assets/tutor-6.jpg";

const categories = ["All", "NEET Prep", "JEE Prep", "K12 Subjects"];

const allTutors = [
  { name: "Biology Mastery", category: "NEET Prep", img: tutor1, rating: 4.9, students: "12K+", description: "Master NEET Biology with AI-powered explanations and practice" },
  { name: "Physics Foundation", category: "NEET Prep", img: tutor2, rating: 4.8, students: "8K+", description: "Build a strong physics foundation for competitive exams" },
  { name: "Chemistry Concepts", category: "NEET Prep", img: tutor3, rating: 4.7, students: "10K+", description: "Organic, inorganic & physical chemistry made simple" },
  { name: "NEET Mock Tests", category: "NEET Prep", img: tutor4, rating: 4.9, students: "15K+", description: "Practice with AI-generated mock tests and instant analysis" },
  { name: "Previous Year Papers", category: "NEET Prep", img: tutor5, rating: 4.6, students: "9K+", description: "Solve previous year papers with step-by-step solutions" },
  { name: "Doubt Clearing", category: "NEET Prep", img: tutor6, rating: 4.8, students: "20K+", description: "Get instant doubt resolution with AI explanations" },
  { name: "Mathematics Advanced", category: "JEE Prep", img: tutor4, rating: 4.9, students: "14K+", description: "Advanced math for JEE Mains and Advanced" },
  { name: "Physics Problems", category: "JEE Prep", img: tutor2, rating: 4.8, students: "11K+", description: "Problem-solving techniques for JEE Physics" },
  { name: "Chemistry Reactions", category: "JEE Prep", img: tutor3, rating: 4.7, students: "7K+", description: "Master reaction mechanisms and equations" },
  { name: "JEE Mock Tests", category: "JEE Prep", img: tutor1, rating: 4.8, students: "13K+", description: "Full-length JEE mock tests with detailed analytics" },
  { name: "Concept Building", category: "JEE Prep", img: tutor5, rating: 4.6, students: "6K+", description: "Build strong fundamentals for competitive exams" },
  { name: "Grade 9-10 Math", category: "K12 Subjects", img: tutor4, rating: 4.9, students: "18K+", description: "CBSE & ICSE math curriculum with practice sets" },
  { name: "Science Foundation", category: "K12 Subjects", img: tutor5, rating: 4.7, students: "15K+", description: "Build a strong science base for higher studies" },
  { name: "English Grammar", category: "K12 Subjects", img: tutor1, rating: 4.5, students: "10K+", description: "Master English grammar and composition skills" },
  { name: "Social Studies", category: "K12 Subjects", img: tutor6, rating: 4.6, students: "8K+", description: "History, geography & civics made interesting" },
  { name: "Computer Science", category: "K12 Subjects", img: tutor3, rating: 4.8, students: "12K+", description: "Learn programming and CS fundamentals" },
];

const AITutors = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allTutors.filter((t) => {
    const matchCategory = activeCategory === "All" || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-2">
            <Link to="/" className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-muted transition-colors">
              <ArrowLeft size={18} className="text-foreground" />
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">AI Tutors</h1>
          </div>
          <p className="text-muted-foreground mb-8 ml-14">Explore all AI-powered tutors across categories</p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tutors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex bg-muted rounded-full p-1 self-start">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
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
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-primary-foreground text-xs leading-relaxed">{tutor.description}</p>
                  </div>
                </div>
                <div className="glass-card rounded-xl py-3 px-3.5">
                  <p className="text-sm font-semibold text-foreground mb-1">{tutor.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{tutor.students} students</span>
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
              <p className="text-muted-foreground text-lg">No tutors found matching your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AITutors;
