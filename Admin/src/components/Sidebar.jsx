import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, Moon, Sun, LogOut, Inbox, IndianRupee, MoreVertical, Sparkles, User, CreditCard, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ isDarkMode, toggleDarkMode, handleLogout, authUser, isCollapsed, setIsCollapsed }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'User Management', path: '/users' },
    { icon: Inbox, label: 'Inquiries', path: '/inquiries' },
    { icon: IndianRupee, label: 'Revenue', path: '/revenue' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <>
      {/* Blurred background overlay for mobile when sidebar is open (drawer mode) */}
      {!isCollapsed && (
        <div
          onClick={() => setIsCollapsed(true)}
          className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm z-40 lg:hidden cursor-pointer animate-in fade-in duration-200"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen glass-card border-r border-border/50 z-50 flex flex-col p-4 transition-all duration-300",
          isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64"
        )}
      >
        {/* Brand Header */}
        <div className={cn("flex items-center gap-3 mb-10 px-2 mt-2", isCollapsed ? "justify-center" : "")}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shrink-0">
            <LayoutDashboard size={22} />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-display font-bold tracking-tight text-gradient whitespace-nowrap">
              GruhaP Admin
            </span>
          )}
        </div>

        {/* Nav Menu */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsCollapsed(true);
                }
              }}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground",
                  isCollapsed ? "justify-center" : ""
                )
              }
              title={isCollapsed ? item.label : ""}
            >
              <item.icon size={20} className="transition-transform group-hover:scale-110 shrink-0" />
              {!isCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer / User Profile Card */}
        <div className="mt-auto pt-4 border-t border-border/30 space-y-4">
          {/* Theme Toggle in collapsed mode */}
          <button
            onClick={toggleDarkMode}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all duration-200",
              isCollapsed ? "justify-center" : ""
            )}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} className="shrink-0" /> : <Moon size={20} className="shrink-0" />}
            {!isCollapsed && <span className="font-semibold text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* Profile widget at bottom (Screenshot 3 style) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={cn(
                "w-full text-white bg-blue-600 hover:bg-blue-700 rounded-xl p-3 flex items-center justify-between shadow-lg shadow-blue-600/10 active:scale-[0.98] transition-all focus:outline-none overflow-hidden",
                isCollapsed ? "justify-center p-2" : "gap-3"
              )}
            >
              <img
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${authUser?.email}`}
                alt={authUser?.displayName}
                className="w-8 h-8 rounded-full object-cover bg-blue-700 border border-blue-500/50 shrink-0"
              />

              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-bold truncate leading-none mb-1 text-white">
                      {authUser?.displayName || 'Admin'}
                    </p>
                    <p className="text-[10px] text-blue-200 truncate leading-none">
                      {authUser?.email || 'admin@gruhap.com'}
                    </p>
                  </div>
                  <MoreVertical size={16} className="text-blue-200 hover:text-white shrink-0 transition-colors" />
                </>
              )}
            </button>

            {/* Profile Popover / Dropdown menu */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "absolute bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 text-foreground w-64",
                    isCollapsed ? "left-14 bottom-2" : "bottom-14 left-0 w-full"
                  )}
                >
                  {/* Header User section */}
                  <div className="p-3 border-b border-border/40 flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${authUser?.email}`}
                      alt={authUser?.displayName}
                      className="w-8 h-8 bg-muted rounded-full object-cover"
                    />
                    <div className="overflow-hidden">
                      <h5 className="font-bold text-xs truncate leading-none mb-1">{authUser?.displayName || 'Admin'}</h5>
                      <p className="text-[10px] text-muted-foreground truncate leading-none">{authUser?.email || 'admin@gruhap.com'}</p>
                    </div>
                  </div>

                  {/* Dropdown Options */}
                  <div className="p-1.5 space-y-0.5 border-b border-border/40 text-xs font-semibold text-muted-foreground hover:text-foreground">
                    <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-secondary/50 text-foreground transition-all text-left">
                      <Sparkles size={14} className="text-indigo-500 shrink-0" />
                      <span>Upgrade to Pro</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-secondary/50 text-foreground transition-all text-left">
                      <User size={14} className="shrink-0" />
                      <span>Account</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-secondary/50 text-foreground transition-all text-left">
                      <CreditCard size={14} className="shrink-0" />
                      <span>Billing</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-secondary/50 text-foreground transition-all text-left">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span>Notifications</span>
                    </button>
                  </div>

                  {/* Logout option */}
                  <div className="p-1.5 border-b border-border/40 text-xs font-semibold">
                    <button
                      onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-all text-left"
                    >
                      <LogOut size={14} className="shrink-0" />
                      <span>Log out</span>
                    </button>
                  </div>

                  {/* Credits section */}
                  <div className="p-3 bg-secondary/15 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-muted-foreground">Credits</span>
                      <span className="text-primary hover:underline cursor-pointer flex items-center">
                        5 left <ChevronRight size={8} />
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-secondary/50 h-1 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[40%] rounded-full" />
                    </div>

                    <p className="text-[9px] text-muted-foreground font-semibold leading-none">Daily credits used first</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
