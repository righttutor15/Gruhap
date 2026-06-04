import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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

const tabs = ["Academics", "Career Growth", "Self Growth"];

const tutorData: Record<string, { name: string; img: string; tagline: string }[]> = {
  Academics: [
    { name: "JEE / NEET Prep", img: mentorAcademics2, tagline: "PCM · PCB · Mock tests" },
    { name: "Math Mentor", img: mentorAcademics1, tagline: "K12 · Calculus · Algebra" },
    { name: "Science Tutor", img: mentorAcademics3, tagline: "Physics · Chem · Bio" },
    { name: "English & Lit", img: mentorEnglishLit, tagline: "Grammar · Essays" },
    { name: "Computer Science", img: mentorCoding, tagline: "Theory · Coding basics" },
    { name: "Doubt Solver", img: mentorDoubtSolver, tagline: "24/7 instant answers" },
  ],
  "Career Growth": [
    { name: "UI/UX Designer", img: mentorUiux, tagline: "Figma · Design Systems" },
    { name: "Digital Marketer", img: mentorMarketing, tagline: "SEO · Ads · Growth" },
    { name: "Code Mentor", img: mentorCoding, tagline: "Web · Apps · DSA" },
    { name: "Startup Coach", img: mentorBusiness, tagline: "MVPs · Pitch · Strategy" },
    { name: "Content Creator", img: mentorCreator, tagline: "YouTube · Reels · Brand" },
    { name: "Product Thinking", img: mentorProduct, tagline: "Research · Roadmaps" },
  ],
  "Self Growth": [
    { name: "Communication Coach", img: mentorCommunication, tagline: "Speak · Write · Pitch" },
    { name: "Personality Dev", img: mentorPersonality, tagline: "Confidence · Mindset" },
    { name: "Spoken English", img: mentorSpokenEnglish, tagline: "Fluency · Accent" },
    { name: "Interview Coach", img: mentorInterview, tagline: "HR · Tech · Behavioural" },
    { name: "Productivity", img: mentorProductivity, tagline: "Habits · Focus · Goals" },
    { name: "Mindfulness Coach", img: mentorMindfulness, tagline: "Calm · Focus · Wellbeing" },
  ],
};

const AITutorsSection = () => {
  const [activeTab, setActiveTab] = useState("Academics");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Flatten tutors with category info
  const allTutors = tabs.flatMap(tab =>
    tutorData[tab].map(tutor => ({ ...tutor, category: tab }))
  );

  // Calculate start indices for each category to sync with scroll
  const categoryIndices = tabs.reduce((acc, tab) => {
    const prevCount = acc.length > 0 ? acc[acc.length - 1].end : 0;
    acc.push({
      category: tab,
      start: prevCount,
      end: prevCount + tutorData[tab].length
    });
    return acc;
  }, [] as { category: string; start: number; end: number }[]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const children = Array.from(scrollRef.current.children) as HTMLElement[];
    let closestIndex = 0;
    let minDistance = Infinity;
    children.forEach((child, index) => {
      const distance = Math.abs(child.offsetLeft - scrollLeft - 16);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    const currentCategory = categoryIndices.find(c => closestIndex >= c.start && closestIndex < c.end)?.category;
    if (currentCategory && currentCategory !== activeTab) {
      setActiveTab(currentCategory);
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    const targetIndex = categoryIndices.find(c => c.category === tab)?.start;
    if (targetIndex !== undefined && scrollRef.current) {
      const targetElement = scrollRef.current.children[targetIndex] as HTMLElement;
      if (targetElement) {
        scrollRef.current.scrollTo({
          left: targetElement.offsetLeft - 16,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <section className="py-12 md:py-20 bg-background" id="our-services">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="glass-card rounded-3xl p-5 sm:p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-3">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Meet Your AI Mentors
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                1-on-1 guidance for every goal — career, growth, or academics.
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              <div className="flex bg-muted rounded-full p-1 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <Link to="/ai-tutors" className="hidden sm:flex flex-shrink-0 items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-border text-[11px] sm:text-sm font-medium text-foreground hover:bg-muted transition-colors">
                View All <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Tutor Cards Carousel */}
          <div className="relative mt-6 sm:mt-8">
            <div 
              className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 pr-10 sm:pr-20"
              ref={scrollRef}
              onScroll={handleScroll}
            >
              {allTutors.map((tutor, i) => (
                <motion.div
                  key={`${tutor.category}-${tutor.name}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="group cursor-pointer flex-shrink-0 w-[42%] sm:w-[30%] md:w-[22%] lg:w-[15.5%] snap-start"
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-3">
                    <img
                      src={tutor.img}
                      alt={tutor.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="glass-card rounded-xl py-2 px-2.5 sm:py-2.5 sm:px-3 text-center">
                    <p className="text-[10px] sm:text-xs font-semibold text-foreground truncate">{tutor.name}</p>
                    <p className="text-[8px] sm:text-[10px] text-muted-foreground mt-0.5 truncate">{tutor.tagline}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITutorsSection;
