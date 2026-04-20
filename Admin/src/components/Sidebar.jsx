import React from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, Moon, Sun, LogOut, Inbox } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}


const Sidebar = ({ isDarkMode, toggleDarkMode }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'User Management', path: '/users' },
    { icon: Inbox, label: 'Inquiries', path: '/inquiries' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];


  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-card border-r border-border/50 z-50 flex flex-col p-6 transition-all duration-300">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
          <LayoutDashboard size={24} />
        </div>
        <span className="text-xl font-display font-bold tracking-tight text-gradient">GruhaP Admin</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon size={20} className="transition-transform group-hover:scale-110" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-border/30 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all duration-200"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span className="font-medium text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all duration-200">
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
