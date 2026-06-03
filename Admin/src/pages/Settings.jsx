import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Bell, Moon, Sun, Shield, Key, Eye, EyeOff,
  Globe, Trash2, LogOut, Save, Camera, AlertTriangle
} from 'lucide-react';

const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-bold">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${enabled ? 'bg-primary' : 'bg-secondary/60 border border-border/50'
        }`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0.5'
        }`} />
    </button>
  </div>
);

const Settings = () => {
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);

  const apiKey = 'gruhap_sk_live_7f3a9b2c4d5e6f1a8b9c0d1e2f3a4b5c';

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your account preferences and configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-elevated p-6 rounded-3xl"
          >
            <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" /> Profile Information
            </h2>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative group">
                <img
                  src="https://i.pravatar.cc/150?u=admin"
                  alt="Admin"
                  className="w-20 h-20 rounded-2xl border-4 border-background shadow-lg object-cover"
                />
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      defaultValue="GruhaP Admin"
                      className="w-full bg-secondary/20 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Email</label>
                    <input
                      type="email"
                      defaultValue="admin@gruhap.com"
                      className="w-full bg-secondary/20 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Role</label>
                  <input
                    type="text"
                    defaultValue="Super Administrator"
                    disabled
                    className="w-full bg-secondary/10 border border-border/30 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg mt-2">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          </motion.div>


        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Account Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card-elevated p-6 rounded-3xl text-center"
          >
            <img
              src="https://i.pravatar.cc/150?u=admin"
              alt="Admin"
              className="w-20 h-20 rounded-2xl border-4 border-background shadow-lg mx-auto mb-4 object-cover"
            />
            <h3 className="font-display font-bold text-lg">GruhaP Admin</h3>
            <p className="text-xs text-muted-foreground mb-3">admin@gruhap.com</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
              <Shield size={12} /> Super Admin
            </span>

            <div className="mt-6 space-y-3 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">Member Since</span>
                <span className="font-bold">Jan 2024</span>
              </div>
              <div className="h-px bg-border/15" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">Last Login</span>
                <span className="font-bold">Today, 2:30 PM</span>
              </div>
              <div className="h-px bg-border/15" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">Sessions</span>
                <span className="font-bold">342</span>
              </div>
              <div className="h-px bg-border/15" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">2FA Status</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1"><Shield size={10} /> Enabled</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}


          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card-elevated p-6 rounded-3xl border-2 border-rose-500/20"
          >
            <h3 className="text-sm font-display font-bold mb-4 flex items-center gap-2 text-rose-500">
              <AlertTriangle size={16} /> Danger Zone
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 transition-colors border border-rose-500/10">
                <Trash2 size={16} />
                <div className="text-left">
                  <p className="text-sm font-bold">Reset All Data</p>
                  <p className="text-[10px] opacity-70">Clear analytics and reset counters</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 transition-colors border border-rose-500/10">
                <LogOut size={16} />
                <div className="text-left">
                  <p className="text-sm font-bold">Logout All Devices</p>
                  <p className="text-[10px] opacity-70">Sign out from all active sessions</p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
