import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Cpu, Bot } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import mentorUiux from "@/assets/mentor-uiux.jpg";
import mentorAcademics2 from "@/assets/mentor-academics-2.jpg";
import mentorMarketing from "@/assets/mentor-marketing.jpg";
import mentorSpokenEnglish from "@/assets/mentor-spoken-english.jpg";
import mentorAcademics3 from "@/assets/mentor-academics-3.jpg";

const testimonials = [
  {
    name: "Ananya Iyer",
    role: "UI/UX Learner · Bengaluru",
    img: mentorUiux,
    track: "AI · UI/UX Mentor",
    text: "I went from doodling in Figma to landing my first design internship in 4 months. My AI mentor reviewed every screen I made — honest, kind, and always available.",
    accent: "from-[hsl(280,90%,70%)] via-[hsl(228,85%,68%)] to-[hsl(190,85%,65%)]",
  },
  {
    name: "Rohan Kapoor",
    role: "JEE Aspirant · Class 12",
    img: mentorAcademics2,
    track: "AI · JEE Physics Mentor",
    text: "Doubt-solving at midnight before mocks is a game-changer. My physics rank in test series jumped by 8,000 in two months.",
    accent: "from-[hsl(150,80%,55%)] via-[hsl(190,90%,60%)] to-[hsl(228,85%,65%)]",
  },
  {
    name: "Meera Joshi",
    role: "Marketing Intern → Manager",
    img: mentorMarketing,
    track: "AI · Growth Mentor",
    text: "The Digital Marketing track gave me actual playbooks I used at work. I got promoted within six months. The AI mentor felt like a real boss who taught me kindly.",
    accent: "from-[hsl(24,95%,60%)] via-[hsl(330,85%,65%)] to-[hsl(280,85%,65%)]",
  },
  {
    name: "Vikram Shah",
    role: "Spoken English · Working Pro",
    img: mentorSpokenEnglish,
    track: "AI · Communication Mentor",
    text: "I was scared to speak in client calls. Daily drills and roleplay with my mentor changed that. Now I lead presentations confidently.",
    accent: "from-[hsl(228,85%,65%)] via-[hsl(265,85%,68%)] to-[hsl(310,85%,65%)]",
  },
  {
    name: "Sneha Reddy",
    role: "NEET Topper · 2025 batch",
    img: mentorAcademics3,
    track: "AI · NEET Biology Mentor",
    text: "Topic-wise mocks with instant analysis helped me find every weak link. My biology score jumped from 60% to 94%.",
    accent: "from-[hsl(160,80%,55%)] via-[hsl(190,85%,60%)] to-[hsl(220,85%,65%)]",
  },
];

const TestimonialsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    containScroll: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // 12-second autoplay
    const intervalId = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(intervalId);
    };
  }, [emblaApi, onSelect]);


  return (
    <section className="py-20 bg-background relative overflow-hidden" id="testimonials">
      {/* Ambient AI grid + glow background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(228 80% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(228 80% 50%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />

      <div className="w-full px-4 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-4">
            <Bot size={13} className="text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Stories from AI-mentored learners
            </span>
            <Sparkles size={13} className="text-cta" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Trained by AI. <span className="text-gradient">Levelled up for life.</span>
          </h2>
        </motion.div>
        <div className="w-12 h-0.5 bg-primary mx-auto mb-14" />

        <div className="relative w-full overflow-hidden">

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y pt-16 pb-4">
              {testimonials.map((t, i) => {
                const isActive = selectedIndex === i;
                return (
                  <div
                    key={t.name}
                    className="flex-shrink-0 basis-full md:basis-[60%] lg:basis-[45%] min-w-0 px-3"
                  >
                    {/* Outer wrapper with overflow-visible so avatar can spill out */}
                    <div
                      className={`relative transition-all duration-500 ${isActive ? "opacity-100 scale-100" : "opacity-50 scale-95"
                        }`}
                    >
                      {/* Holographic gradient ring (card-shaped, NOT clipping the avatar) */}
                      <div
                        className={`relative rounded-[28px] p-[1.5px] bg-gradient-to-br ${t.accent} ${isActive ? "shadow-[0_30px_60px_-20px_hsl(228_80%_50%/0.35)]" : ""
                          }`}
                      >
                        {/* Inner card — content only, no overhanging children */}
                        <div className="relative rounded-[26px] bg-card/95 backdrop-blur-xl px-8 pt-20 pb-8 text-center overflow-hidden">
                          {/* Inner subtle grid */}
                          <div
                            className="absolute inset-0 opacity-[0.04] pointer-events-none"
                            style={{
                              backgroundImage:
                                "linear-gradient(hsl(228 80% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(228 80% 50%) 1px, transparent 1px)",
                              backgroundSize: "24px 24px",
                            }}
                          />

                          {/* AI mentor track chip */}
                          <div className="relative z-10 mb-4 flex justify-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/5 border border-border backdrop-blur-md">
                              <Cpu size={11} className="text-primary" />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                                {t.track}
                              </span>
                            </div>
                          </div>

                          <div className="relative z-10">
                            <h4 className="font-display font-bold text-foreground text-lg mb-1">
                              {t.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-4">{t.role}</p>
                            <p className="text-sm text-foreground/80 leading-relaxed italic">
                              "{t.text}"
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Avatar — positioned on the OUTER wrapper so it overflows freely */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
                        <div className={`relative p-[2px] rounded-full bg-gradient-to-br ${t.accent}`}>
                          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-background">
                            <img
                              src={t.img}
                              alt={t.name}
                              loading="lazy"
                              className="w-full h-full object-cover object-top"
                              draggable={false}
                            />
                          </div>
                          {/* <motion.span
                            animate={{ scale: [1, 1.25, 1], opacity: [1, 0.6, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-cta border-2 border-background"
                          /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation arrows removed as requested */}

        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === selectedIndex ? "bg-primary w-8" : "bg-foreground/20 hover:bg-foreground/40 w-2"
                }`}

            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
