import { useState, useCallback, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const tutors = tutorData[activeTab];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [activeTab, emblaApi]);

  return (
    <section className="py-20 bg-background" id="our-services">
      <div className="container mx-auto px-6">
        <div className="glass-card rounded-3xl p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-3">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Meet Your AI Mentors
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                1-on-1 guidance for every goal — career, growth, or academics.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-muted rounded-full p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <Link to="/ai-tutors" className="hidden md:flex items-center gap-1.5 px-5 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
                View All <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Tutor Cards Carousel */}
          <div className="relative mt-8">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 touch-pan-y">
                {tutors.map((tutor, i) => (
                  <motion.div
                    key={`${activeTab}-${tutor.name}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group cursor-pointer flex-shrink-0 w-[45%] sm:w-[30%] md:w-[22%] lg:w-[15.5%]"
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
                    <div className="glass-card rounded-xl py-2.5 px-3 text-center">
                      <p className="text-xs font-semibold text-foreground">{tutor.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{tutor.tagline}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            {canScrollPrev && (
              <button
                onClick={() => emblaApi?.scrollPrev()}
                aria-label="Previous mentors"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full border border-border bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors shadow-md"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {canScrollNext && (
              <button
                onClick={() => emblaApi?.scrollNext()}
                aria-label="Next mentors"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full border border-border bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors shadow-md"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITutorsSection;
