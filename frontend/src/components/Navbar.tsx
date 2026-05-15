import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about-us" },
  { label: "Our Services", path: "/our-services" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "Contact Us", path: "/contact-us" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 hero-gradient-animated border-b border-border/50 overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-[0.05] pointer-events-none" />

      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cta flex items-center justify-center">
            <span className="text-cta-foreground font-display font-bold text-base sm:text-lg">G</span>
          </div>
          <span className="font-display font-bold text-lg sm:text-xl text-foreground">Gruhap</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-sm font-medium transition-colors ${location.pathname === link.path
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase">
                  {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                </div>
                <span className="max-w-[120px] truncate">{user?.displayName || user?.email}</span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl hero-gradient-animated border border-border shadow-lg py-1 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-border/50">
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
                Login
              </Link>
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-foreground p-1" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden hero-gradient-animated border-t border-border relative overflow-hidden"
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 grid-pattern opacity-[0.05] pointer-events-none" />
            <div className="flex flex-col px-4 sm:px-6 py-4 gap-1 relative z-10">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-sm font-medium py-2.5 px-3 rounded-lg transition-colors ${location.pathname === link.path
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground"
                    }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-3 border-t border-border mt-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase">
                        {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate">{user?.displayName || 'User'}</span>
                        <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full text-center px-4 py-2.5 rounded-full bg-destructive/10 text-destructive text-sm font-semibold"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login" className="flex-1 text-center text-sm font-medium text-foreground py-2.5 px-4 rounded-full border border-border" onClick={() => setMobileOpen(false)}>
                      Login
                    </Link>
                    <Link to="/dashboard" className="flex-1 text-center px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold" onClick={() => setMobileOpen(false)}>
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
