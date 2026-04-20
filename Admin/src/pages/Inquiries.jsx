import React from 'react';
import InquiriesTable from '../components/InquiriesTable';
import { Mail, MessageSquare, Inbox, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Inquiries = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-1">User Inquiries</h1>
          <p className="text-muted-foreground font-medium">Review and respond to contact form submissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Filter by subject..." 
              className="bg-secondary/30 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Inquiries', value: '48', icon: Inbox, color: 'bg-primary' },
          { label: 'Pending', value: '12', icon: MessageSquare, color: 'bg-amber-500' },
          { label: 'Urgent', value: '02', icon: Mail, color: 'bg-rose-500' },
          { label: 'Resolved Today', value: '08', icon: Inbox, color: 'bg-emerald-500' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-3xl border border-border/30"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <InquiriesTable />
    </div>
  );
};

export default Inquiries;
