import React, { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import DateRangePicker from '../components/DateRangePicker';
import { Users, UserPlus, FileDown, ShieldAlert, Sparkles, Activity } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });

  const fetchFilteredUsers = async (range) => {
    setLoading(true);
    try {
      const startStr = range.startDate.toISOString().split('T')[0];
      const endStr = range.endDate.toISOString().split('T')[0];
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users?startDate=${startStr}&endDate=${endStr}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error loading filtered users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredUsers(dateRange);
  }, [dateRange]);

  const handleDateChange = (newRange) => {
    setDateRange(newRange);
  };

  // Compute stats dynamically from active list
  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.plan === 'Pro' || u.plan === 'Enterprise').length;
  const premiumPercentage = totalUsers ? ((premiumUsers / totalUsers) * 100).toFixed(1) : '0';
  const activeToday = users.filter(u => u.status === 'Active').length;
  const activePercentage = totalUsers ? ((activeToday / totalUsers) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-1 font-bold">User Management</h1>
          <p className="text-muted-foreground font-medium">View and manage your application users.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker onChange={handleDateChange} defaultRange={dateRange} />
          
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl font-bold text-sm transition-all">
            <FileDown size={18} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg">
            <UserPlus size={18} /> Add User
          </button>
        </div>
      </div>

      {/* KPI Cards calculated from dynamic list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-border/30 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Users</p>
          <h3 className="text-2xl font-display font-bold inline-flex items-center gap-2">
            {loading ? '...' : totalUsers.toLocaleString()} 
            <span className="text-emerald-500 text-sm font-bold">+12%</span>
          </h3>
        </div>
        
        <div className="glass-card p-6 rounded-3xl border border-border/30 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Premium Users</p>
          <h3 className="text-2xl font-display font-bold inline-flex items-center gap-2">
            {loading ? '...' : premiumUsers.toLocaleString()} 
            <span className="text-indigo-500 text-sm font-bold">{premiumPercentage}%</span>
          </h3>
        </div>
        
        <div className="glass-card p-6 rounded-3xl border border-border/30 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Active Users</p>
          <h3 className="text-2xl font-display font-bold inline-flex items-center gap-2">
            {loading ? '...' : activeToday.toLocaleString()} 
            <span className="text-cta-orange text-sm font-bold">{activePercentage}%</span>
          </h3>
        </div>
      </div>

      <UserTable users={users} loading={loading} />
    </div>
  );
};

export default UserManagement;
