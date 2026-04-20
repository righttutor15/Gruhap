import React from 'react';
import { MoreVertical, Mail, Shield, Clock, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const USERS_DATA = [
  { id: 1, name: 'Arjun Mehta', email: 'arjun@example.com', plan: 'Pro', status: 'Active', joined: '2024-03-15', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Priya Singh', email: 'priya@example.com', plan: 'Free', status: 'Inactive', joined: '2024-03-10', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Rahul Sharma', email: 'rahul@example.com', plan: 'Enterprise', status: 'Active', joined: '2024-02-28', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Sneha Rao', email: 'sneha@example.com', plan: 'Pro', status: 'Active', joined: '2024-04-01', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, name: 'Vikram Das', email: 'vikram@example.com', plan: 'Free', status: 'Active', joined: '2024-04-05', avatar: 'https://i.pravatar.cc/150?u=5' },
];

const UserTable = () => {
  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-border/50">
      <div className="p-6 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-display font-bold">Recent Users</h2>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="bg-secondary/30 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64 transition-all"
            />
          </div>
          <button className="p-2 bg-secondary/30 border border-border/50 rounded-xl hover:bg-secondary/50 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/20">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {USERS_DATA.map((user, index) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={user.id} 
                className="hover:bg-secondary/10 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-primary/10" />
                    <div>
                      <div className="font-bold text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail size={12} /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                    user.plan === 'Enterprise' ? 'bg-indigo-500/10 text-indigo-500' : 
                    user.plan === 'Pro' ? 'bg-cta-orange/10 text-cta-orange' : 
                    'bg-slate-500/10 text-slate-500'
                  }`}>
                    <Shield size={12} />
                    {user.plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {user.joined}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground group-hover:text-foreground">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-border/30 bg-secondary/10 flex justify-center">
        <button className="text-sm font-bold text-primary hover:underline">View All Users</button>
      </div>
    </div>
  );
};

export default UserTable;
