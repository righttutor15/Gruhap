import { useState, useCallback, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";
import tutor5 from "@/assets/tutor-5.jpg";
import tutor6 from "@/assets/tutor-6.jpg";

const tabs = ["NEET Prep", "JEE Prep", "K12 Subjects"];

const tutorData: Record<string, { name: string; img: string }[]> = {
  "NEET Prep": [
    { name: "Biology Mastery", img: tutor1 },
    { name: "Physics Foundation", img: tutor2 },
    { name: "Chemistry Concepts", img: tutor3 },
    { name: "NEET Mock Tests", img: tutor4 },
    { name: "Previous Year Papers", img: tutor5 },
    { name: "Doubt Clearing", img: tutor6 },
  ],
  "JEE Prep": [
    { name: "Mathematics Advanced", img: tutor4 },
    { name: "Physics Problems", img: tutor2 },
    { name: "Chemistry Reactions", img: tutor3 },
    { name: "JEE Mock Tests", img: tutor1 },
    { name: "Concept Building", img: tutor5 },
  ],
  "K12 Subjects": [
    { name: "Grade 9-10 Math", img: tutor4 },
    { name: "Science Foundation", img: tutor5 },
    { name: "English Grammar", img: tutor1 },
    { name: "Social Studies", img: tutor6 },
    { name: "Computer Science", img: tutor3 },
  ],
};

const allTutors = Object.entries(tutorData).flatMap(([category, tutors]) =>
  tutors.map((t) => ({ ...t, category }))
);

const categoryIndices = tabs.reduce((acc, tab) => {
  acc[tab] = allTutors.findIndex((t) => t.category === tab);
  return acc;
}, {} as Record<string, number>);

const AITutorsSection = () => {
  const [activeTab, setActiveTab] = useState("NEET Prep");
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

    // Update active tab based on the leading visible tutor's category
    const index = emblaApi.selectedScrollSnap();
    const currentTutor = allTutors[index];
    if (currentTutor) {
      setActiveTab(currentTutor.category);
    }
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
  }, [emblaApi]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (emblaApi) {
      emblaApi.scrollTo(categoryIndices[tab]);
    }
  };

  return (
    <section className="py-12 md:py-20 bg-background" id="our-services">
      <div className="container mx-auto px-4 md:px-6">
        <div className="glass-card rounded-3xl p-5 md:p-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground">
              AI Tutors
            </h2>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex bg-muted rounded-full p-1 relative overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`relative px-3 sm:px-5 py-2 rounded-full text-[10px] sm:text-sm font-medium transition-colors z-10 whitespace-nowrap ${activeTab === tab
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-card rounded-full shadow-sm z-[-1]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {tab}
                  </button>
                ))}
              </div>

              <Link to="/ai-tutors" className="flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2 rounded-full border border-border text-[10px] sm:text-sm font-medium text-foreground hover:bg-muted transition-colors whitespace-nowrap ml-auto sm:ml-0">
                View All <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Tutor Cards Carousel */}
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 touch-pan-y">
                {allTutors.map((tutor, i) => (
                  <motion.div
                    key={`${tutor.category}-${tutor.name}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group cursor-pointer flex-shrink-0 w-[45%] sm:w-[30%] md:w-[22%] lg:w-[15.5%]"
                  >
                    <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-3">
                      <img
                        src={tutor.img}
                        alt={tutor.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="glass-card rounded-xl py-2.5 px-3 text-center">
                      <p className="text-xs font-semibold text-foreground">{tutor.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            {canScrollPrev && (
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full border border-border bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors shadow-md"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {canScrollNext && (
              <button
                onClick={() => emblaApi?.scrollNext()}
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
