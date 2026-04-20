import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

const testimonials = [
  {
    name: "Jenny Wilson",
    role: "NEET Aspirant",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces&auto=format",
    text: "The personalized study plans helped me focus on my weak areas. I improved my JEE rank by 5000 positions in just 3 months!",
    gradient: "from-[hsl(80,60%,85%)] to-[hsl(60,50%,88%)]"
  },
  {
    name: "David Carter",
    role: "JEE Student",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&auto=format",
    text: "Concept clarity improved dramatically with the AI tutor. The doubt-solving feature made complex physics problems so much easier to understand.",
    gradient: "from-[hsl(200,60%,88%)] to-[hsl(340,50%,88%)]"
  },
  {
    name: "Emily Chen",
    role: "NEET Topper",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&auto=format",
    text: "Previous year paper practice with detailed explanations boosted my confidence. Scored 680/720 in NEET on my first attempt!",
    gradient: "from-[hsl(270,50%,88%)] to-[hsl(220,55%,88%)]"
  },
  {
    name: "Michael Johnson",
    role: "JEE Advanced",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces&auto=format",
    text: "The step-by-step solutions for mathematics problems were game-changing. I finally understood calculus concepts I struggled with for months.",
    gradient: "from-[hsl(30,60%,88%)] to-[hsl(350,50%,88%)]"
  },
  {
    name: "Sophia Martinez",
    role: "K12 Student",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=faces&auto=format",
    text: "Mock tests with instant analysis helped me identify patterns in my mistakes. My chemistry score jumped from 60% to 92% in NEET.",
    gradient: "from-[hsl(160,45%,85%)] to-[hsl(200,50%,88%)]"
  }];


const TestimonialsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    containScroll: false
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

    // Auto-slide logic
    const intervalId = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000); // Scroll every 5 seconds

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(intervalId);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 bg-background overflow-hidden" id="testimonials">
      <div className="w-full px-0  ">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-3">

          OUR TESTIMONIALS
        </motion.h2>
        <div className="w-12 h-0.5 bg-primary mx-auto mb-14" />

        <div className="relative w-full">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y pt-12">
              {testimonials.map((t, i) =>
                <div
                  key={t.name}
                  className="flex-shrink-0 w-[85vw] md:w-[550px] lg:w-[500px] min-w-0 px-3 md:px-4">

                  <div
                    className={`relative rounded-3xl bg-gradient-to-br ${t.gradient} p-8 pt-16 text-center transition-all duration-500 ${selectedIndex === i ?
                      "opacity-100 scale-100" :
                      "opacity-50 scale-95"}`
                    }>

                    {/* Avatar */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                      <div className={`w-20 h-20 rounded-full overflow-hidden ring-4 transition-all duration-300 ${selectedIndex === i ? "ring-primary/30" : "ring-background"}`
                      }>
                        <img
                          src={t.img}
                          alt={t.name}
                          className="w-full h-full object-cover"
                          draggable={false} />

                      </div>
                    </div>

                    <h4 className="font-display font-bold text-foreground text-lg mb-1">
                      {t.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-4">{t.role}</p>
                    <p className="text-sm text-foreground/80 leading-relaxed italic">
                      "{t.text}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nav arrows */}

        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) =>
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === selectedIndex ? "bg-foreground scale-110" : "bg-border"}`
              } />

          )}
        </div>
      </div>
    </section>);

};

export default TestimonialsSection;