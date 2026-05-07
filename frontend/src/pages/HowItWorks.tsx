import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { UserPlus, Brain, BarChart3, Trophy } from "lucide-react";

const steps = [
  { icon: UserPlus, step: "01", title: "Sign Up Free", desc: "Create your account in 30 seconds. No credit card required. Choose your exam or subject." },
  { icon: Brain, step: "02", title: "Meet Your AI Tutor", desc: "Get matched with an AI tutor specialized in your subject. It adapts to your learning style in real-time." },
  { icon: BarChart3, step: "03", title: "Learn & Practice", desc: "Study with interactive lessons, solve problems, take mock tests, and get instant doubt resolution 24/7." },
  { icon: Trophy, step: "04", title: "Ace Your Exams", desc: "Track your progress, identify weak spots, and walk into your exam with confidence and preparation." },
];

const faqs = [
  { q: "Is Gruhap free to use?", a: "Yes! We offer a generous free tier with access to basic AI tutoring, community features, and limited mock tests. Premium plans unlock advanced analytics and unlimited access." },
  { q: "How does the AI tutor work?", a: "Our AI tutors use advanced language models trained on educational content. They understand your questions, provide step-by-step explanations, and adapt difficulty based on your performance." },
  { q: "Which exams does Gruhap support?", a: "We currently support NEET, JEE (Mains & Advanced), and K12 subjects (Class 6-12). We're expanding to UPSC and other competitive exams soon." },
  { q: "Can I use Gruhap on mobile?", a: "Absolutely! Gruhap is fully optimized for mobile browsers. A dedicated app is coming soon for both Android and iOS." },
];

const HowItWorks = () => {
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
            How It <span className="text-gradient">Works</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Four simple steps to transform your learning journey.
          </motion.p>
        </div>
      </section>

      {/* Steps */}
      <section className="relative py-16 bg-background overflow-hidden">
        {/* Square grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(222 47% 11%) 1px, transparent 1px), linear-gradient(90deg, hsl(222 47% 11%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6"
              >
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="font-display text-3xl md:text-4xl font-bold text-cta">{s.step}</span>
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <s.icon size={22} className="text-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 hero-gradient overflow-hidden">
        {/* Square grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(222 47% 11%) 1px, transparent 1px), linear-gradient(90deg, hsl(222 47% 11%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-5 group cursor-pointer"
              >
                <summary className="font-display font-bold text-foreground list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-muted-foreground group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HowItWorks;
