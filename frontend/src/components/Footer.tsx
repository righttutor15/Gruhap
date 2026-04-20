import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cta flex items-center justify-center">
                <span className="text-cta-foreground font-display font-bold text-lg">G</span>
              </div>
              <span className="font-display font-bold text-xl">Gruhap</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed mb-6">
              AI-powered learning platform for K12, NEET, JEE, and Olympiad success.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center opacity-60 hover:opacity-100 hover:border-primary-foreground/50 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Partners", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-display font-bold mb-4">Subjects</h4>
            <ul className="space-y-3">
              {["Physics", "Chemistry", "Mathematics", "Biology"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-bold mb-4">Resources</h4>
            <ul className="space-y-3">
              {["Study Material", "Mock Tests", "Previous Papers", "Syllabus"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-sm opacity-50">
            © 2026 Gruhap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
