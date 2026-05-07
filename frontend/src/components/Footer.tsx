import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground dark:bg-background dark:text-foreground dark:border-t dark:border-border">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cta flex items-center justify-center">
                <span className="text-cta-foreground font-display font-bold text-lg">G</span>
              </div>
              <span className="font-display font-bold text-xl">Gruhap</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed mb-6">
              Self-paced learning powered by AI mentors. For students, creators, and professionals
              ready to upskill.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center opacity-60 hover:opacity-100 hover:border-primary-foreground/50 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Academics — priority #1 */}
          <div>
            <h4 className="font-display font-bold mb-4">Academics</h4>
            <ul className="space-y-3">
              {["JEE Prep", "NEET Prep", "K12 Math & Science", "English & Literature", "Doubt Solving"].map((item) => (
                <li key={item}>
                  <Link to="/ai-tutors" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Career Growth — priority #2 */}
          <div>
            <h4 className="font-display font-bold mb-4">Career Growth</h4>
            <ul className="space-y-3">
              {["UI/UX Design", "Digital Marketing", "Coding & Dev", "Content Creation", "Startup Coaching"].map((item) => (
                <li key={item}>
                  <Link to="/ai-tutors" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Self Growth — priority #3 */}
          <div>
            <h4 className="font-display font-bold mb-4">Self Growth</h4>
            <ul className="space-y-3">
              {["Communication", "Spoken English", "Personality Dev", "Interview Coach", "Productivity"].map((item) => (
                <li key={item}>
                  <Link to="/ai-tutors" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm opacity-50">
            © 2026 Gruhap. Learn anything, with an AI mentor by your side.
          </p>
          <div className="flex gap-5 text-xs opacity-50">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
