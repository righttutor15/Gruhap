import React from 'react';
import UserTable from '../components/UserTable';
import { Users, UserPlus, FileDown } from 'lucide-react';

const UserManagement = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-1 font-bold">User Management</h1>
          <p className="text-muted-foreground font-medium">View and manage your application users.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl font-bold text-sm transition-all">
            <FileDown size={18} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg">
            <UserPlus size={18} /> Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-border/30">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Users</p>
          <h3 className="text-2xl font-display font-bold inline-flex items-center gap-2">
            1,284 <span className="text-emerald-500 text-sm font-bold">+12%</span>
          </h3>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-border/30">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Premium Users</p>
          <h3 className="text-2xl font-display font-bold inline-flex items-center gap-2">
            452 <span className="text-indigo-500 text-sm font-bold">35.2%</span>
          </h3>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-border/30">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Active Today</p>
          <h3 className="text-2xl font-display font-bold inline-flex items-center gap-2">
            156 <span className="text-cta-orange text-sm font-bold">+5%</span>
          </h3>
        </div>
      </div>

      <UserTable />
    </div>
  );
};

export default UserManagement;
