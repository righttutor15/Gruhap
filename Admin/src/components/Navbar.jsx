import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Palette, MoreVertical, Sparkles, User, CreditCard, LogOut, ChevronRight, X, LayoutDashboard, ShoppingBag, Building2, Briefcase, Users, HelpCircle, Inbox, IndianRupee, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ isDarkMode, toggleDarkMode, handleLogout, authUser, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const paletteRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (paletteRef.current && !paletteRef.current.contains(e.target)) {
        setPaletteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Listen to Cmd+K or Ctrl+K for search modal toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'User Management', icon: Users, path: '/users' },
    { name: 'Inquiries', icon: Inbox, path: '/inquiries' },
    { name: 'Revenue', icon: IndianRupee, path: '/revenue' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommandClick = (path) => {
    navigate(path);
    setSearchModalOpen(false);
    setSearchQuery('');
  };

  const colorThemes = [
    { name: 'Default', primary: '222 47% 11%', class: '' },
    { name: 'Lavender Dream', primary: '262 83% 58%', class: 'theme-lavender' },
    { name: 'Sunset Glow', primary: '9 100% 64%', class: 'theme-sunset' },
    { name: 'Emerald', primary: '142 76% 36%', class: 'theme-emerald' },
  ];

  const changeColorTheme = (themeClass) => {
    document.documentElement.className = document.documentElement.className
      .split(' ')
      .filter(c => !c.startsWith('theme-') && c !== 'dark')
      .join(' ');

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
    if (themeClass) {
      document.documentElement.classList.add(themeClass);
    }
    setPaletteOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-card border-b border-border/40 px-6 py-3 flex items-center justify-between transition-all duration-300">

        {/* Left side: Collapse toggle and search */}
        <div className="flex items-center gap-4 flex-1 max-w-lg">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-secondary/60 text-muted-foreground hover:text-foreground rounded-lg transition-all"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M4 6h16M4 12h10M4 18h16"}
              />
            </svg>
          </button>

          <div className="h-4 w-[1px] bg-border/60" />

          {/* Search Trigger Button - displayed as search icon on mobile, input on desktop */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center justify-start gap-3 w-full bg-secondary/30 hover:bg-secondary/50 border border-border/40 rounded-xl py-1.5 px-3 text-sm text-muted-foreground hover:text-foreground transition-all cursor-pointer md:hidden max-w-[40px] md:max-w-none"
            title="Search Commands"
          >
            <Search size={16} className="shrink-0 text-muted-foreground/80" />
          </button>

          <div
            onClick={() => setSearchModalOpen(true)}
            className="hidden md:flex relative w-full items-center bg-secondary/30 hover:bg-secondary/50 border border-border/40 rounded-xl py-1.5 pl-10 pr-16 text-sm text-muted-foreground/80 hover:text-foreground transition-all cursor-pointer"
          >
            <Search className="absolute left-3 text-muted-foreground/80" size={16} />
            <span>Type a command...</span>
            <kbd className="absolute right-3 pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/80 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground/80">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right side buttons & Profile */}
        <div className="flex items-center gap-4">


          <button className="relative p-2 hover:bg-secondary/60 text-muted-foreground hover:text-foreground rounded-lg transition-all">
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-secondary/60 text-muted-foreground hover:text-foreground rounded-lg transition-all"
          >
            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <div className="relative" ref={paletteRef}>
            <button
              onClick={() => setPaletteOpen(!paletteOpen)}
              className="p-2 hover:bg-secondary/60 text-muted-foreground hover:text-foreground rounded-lg transition-all"
            >
              <Palette size={19} />
            </button>

            <AnimatePresence>
              {paletteOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl p-3 z-50 space-y-2 text-sm"
                >
                  <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wider px-1">Themes</div>
                  <div className="grid grid-cols-2 gap-2">
                    {colorThemes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => changeColorTheme(theme.class)}
                        className="flex items-center gap-1.5 p-1.5 hover:bg-secondary/60 rounded-lg text-xs font-medium w-full text-left"
                      >
                        <div
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: theme.name === 'Default' ? '#0f172a' : theme.name === 'Emerald' ? '#10b981' : theme.name === 'Violet' ? '#8b5cf6' : '#f59e0b' }}
                        />
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-[1px] bg-border/60" />

          {/* User profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-full overflow-hidden border border-border hover:opacity-90 active:scale-95 transition-all focus:outline-none"
            >
              <img
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${authUser?.email}`}
                alt={authUser?.displayName}
                className="w-8 h-8 bg-muted rounded-full object-cover"
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 text-foreground"
                >
                  <div className="p-4 border-b border-border/40 flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${authUser?.email}`}
                      alt={authUser?.displayName}
                      className="w-10 h-10 bg-muted rounded-full object-cover"
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-sm truncate">{authUser?.displayName || 'Admin'}</h4>
                      <p className="text-xs text-muted-foreground truncate">{authUser?.email || 'admin@gruhap.com'}</p>
                    </div>
                  </div>

                  <div className="p-2 space-y-0.5 border-b border-border/40 text-sm font-medium">
                    <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary/50 transition-all text-left">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-indigo-500" />
                        <span>Upgrade to Pro</span>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </button>
                    <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary/50 transition-all text-left">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>Account</span>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </button>
                    <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary/50 transition-all text-left">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} />
                        <span>Billing</span>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </button>
                    <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary/50 transition-all text-left">
                      <div className="flex items-center gap-2">
                        <Bell size={16} />
                        <span>Notifications</span>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </button>
                  </div>

                  <div className="p-2 border-b border-border/40 text-sm font-medium">
                    <button
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all text-left"
                    >
                      <LogOut size={16} />
                      <span>Log out</span>
                    </button>
                  </div>

                  <div className="p-4 bg-secondary/10 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Credits</span>
                      <span className="text-primary hover:underline cursor-pointer flex items-center gap-0.5">
                        5 left <ChevronRight size={10} />
                      </span>
                    </div>

                    <div className="w-full bg-secondary/50 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[40%] rounded-full" />
                    </div>

                    <p className="text-[10px] text-muted-foreground font-medium">Daily credits used first</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Command Palette Modal (Search Box Popup) */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 font-sans">
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchModalOpen(false)}
              className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-sm"
            />

            {/* Command Palette Card (Screenshot design) */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[480px] bg-[#09090b] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-[#fafafa] z-10"
            >
              {/* Top Search bar */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800">
                <Search size={18} className="text-zinc-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent border-0 outline-none text-sm placeholder-zinc-500 text-white"
                />
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Items List */}
              <div className="p-2 max-h-[300px] overflow-y-auto">
                <div className="px-3 py-2 text-xs font-semibold text-zinc-500 tracking-wider">
                  Dashboards
                </div>

                <div className="space-y-0.5">
                  {filteredCommands.length === 0 ? (
                    <div className="px-3 py-4 text-center text-sm text-zinc-500">
                      No results found
                    </div>
                  ) : (
                    filteredCommands.map((cmd) => {
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.name}
                          onClick={() => handleCommandClick(cmd.path)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-all text-left font-medium text-sm text-zinc-300 hover:text-white"
                        >
                          <Icon size={16} className="text-zinc-400 shrink-0" />
                          <span>{cmd.name}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
