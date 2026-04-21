import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const avatars = [
  // Left Side - Randomized
  { img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", top: "15%", left: "8%", size: 60 },
  { img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face", top: "10%", left: "32%", size: 52 },
  { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", top: "60%", left: "5%", size: 56 },
  { img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", top: "54%", left: "30%", size: 68 },
  { img: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face", top: "82%", left: "18%", size: 62 },

  // Right Side - Randomized
  { img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", top: "8%", right: "18%", size: 54 },
  { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", top: "25%", right: "8%", size: 58 },
  { img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", top: "55%", right: "5%", size: 60 },
  { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", top: "50%", right: "28%", size: 52 },
  { img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", top: "85%", right: "12%", size: 64 },
];

const CommunitySection = () => {
  return (
    <section className="py-12 md:py-20 hero-gradient relative overflow-hidden" id="community">
      <div className="container mx-auto px-4 md:px-6">
        <div className="glass-card rounded-3xl relative min-h-[450px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
          {/* Floating Avatars */}
          {avatars.map((avatar, i) => {
            // Only show indices 0, 4, 5, 7, 9 on mobile for "4-5 dispersed icons"
            const showOnMobile = [0, 4, 5, 7, 9].includes(i);
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`absolute floating-animation ${showOnMobile ? 'block' : 'hidden md:block'}`}
                style={{
                  top: avatar.top,
                  left: avatar.left,
                  right: avatar.right,
                  animationDelay: `${i * 0.6}s`,
                }}
              >
                <img
                  src={avatar.img}
                  alt=""
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover ring-3 ring-card shadow-lg"
                />
              </motion.div>
            );
          })}

          {/* Center Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center z-10 py-16 md:py-20"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Join The Movement
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto px-4">
              Connect, share, and grow with Student Exclusive Community.
            </p>
            <Link
              to="/community"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Join Our Community <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
