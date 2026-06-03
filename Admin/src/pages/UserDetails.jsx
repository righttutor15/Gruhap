import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Shield, Clock, Calendar, CreditCard,
  Zap, BookOpen, Trophy, Flame, MapPin, Phone, Globe,
  CheckCircle2, XCircle, MoreVertical, TrendingUp
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const activityTypeColors = {
  test: 'bg-indigo-500',
  question: 'bg-cta-orange',
  login: 'bg-emerald-500',
  billing: 'bg-rose-500',
};

const activityTypeIcons = {
  test: Trophy,
  question: BookOpen,
  login: Globe,
  billing: CreditCard,
};

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}`);
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground font-bold">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted-foreground font-bold">User not found</p>
        <button onClick={() => navigate('/users')} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm">Back to Users</button>
      </div>
    );
  }

  const quickStats = [
    { label: 'Total Sessions', value: user.totalSessions, icon: Zap, color: 'bg-primary' },
    { label: 'Tokens Used', value: user.tokensUsed, icon: BookOpen, color: 'bg-cta-orange' },
    { label: 'Avg. Score', value: user.avgScore, icon: Trophy, color: 'bg-indigo-500' },
    { label: 'Streak Days', value: user.streakDays, icon: Flame, color: 'bg-emerald-500' },
  ];

  const planStyles = {
    Enterprise: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    Pro: 'bg-cta-orange/10 text-cta-orange border-cta-orange/20',
    Free: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/users')}
          className="p-2.5 glass-card rounded-xl hover:bg-secondary/50 transition-all border border-border/30"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-0.5">User Profile</h1>
          <p className="text-muted-foreground text-sm font-medium">Detailed user information and analytics</p>
        </div>
      </div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-elevated rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-72 h-72 -mr-20 -mt-20 bg-gradient-to-br from-primary/8 via-cta-orange/5 to-transparent rounded-full blur-3xl" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 relative z-10">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-2xl border-4 border-background shadow-xl object-cover"
            />
            <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
              }`} />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h2 className="text-2xl font-display font-bold">{user.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit ${planStyles[user.plan]}`}>
                <Shield size={12} />
                {user.plan} Plan
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                }`}>
                {user.status === 'Active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                {user.status}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-3 max-w-2xl">{user.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Mail size={13} /> {user.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={13} /> {user.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} /> {user.location}</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} /> Joined {user.joined}</span>
              {user.website && <span className="flex items-center gap-1.5"><Globe size={13} /> {user.website}</span>}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg flex items-center gap-2">
              <Mail size={16} /> Message
            </button>
            <button className="p-2 glass-card rounded-xl hover:bg-secondary/50 transition-all border border-border/30">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="glass-card-elevated p-5 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg mb-3`}>
              <stat.icon size={18} />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card-elevated p-6 rounded-3xl lg:col-span-2 h-[360px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-display font-bold">Daily Usage</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Minutes spent this week</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
              <TrendingUp size={12} /> +18%
            </span>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={user.dailyUsage}>
                <defs>
                  <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#aa3bff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#aa3bff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="#aa3bff"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#usageGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Subject Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card-elevated p-6 rounded-3xl h-[360px] flex flex-col"
        >
          <h3 className="text-lg font-display font-bold mb-2">Subject Focus</h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={user.subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {user.subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-display font-bold">4</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Subjects</span>
            </div>
          </div>
          <div className="space-y-1.5 mt-2">
            {user.subjectData.map((item) => (
              <div key={item.name} className="flex justify-between items-center px-2 py-1 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity & Billing Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card-elevated p-6 rounded-3xl lg:col-span-3"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-bold">Activity Timeline</h3>
            <button className="text-xs font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-1">
            {user.activityLog.map((entry, i) => {
              const IconComp = activityTypeIcons[entry.type];
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="flex items-start gap-3 py-3 border-b border-border/15 last:border-0 group hover:bg-secondary/5 rounded-xl px-2 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg ${activityTypeColors[entry.type]} flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm`}>
                    <IconComp size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{entry.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{entry.detail}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                    <Clock size={10} /> {entry.time}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Subscription & Billing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-card-elevated p-6 rounded-3xl lg:col-span-2 flex flex-col"
        >
          <h3 className="text-lg font-display font-bold mb-6">Subscription & Billing</h3>

          <div className="space-y-5 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Current Plan</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${planStyles[user.plan]}`}>
                {user.plan}
              </span>
            </div>

            <div className="h-px bg-border/20" />

            <div className="space-y-4">
              {[
                { label: 'Renewal Date', value: user.renewalDate, icon: Calendar },
                { label: 'Lifetime Spend', value: user.lifetimeSpend, icon: CreditCard },
                { label: 'Payment Method', value: user.paymentMethod, icon: Shield },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon size={14} className="text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-border/20" />

            {/* Usage Quota Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Token Quota</span>
                <span className="text-xs font-bold">68%</span>
              </div>
              <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '68%' }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.8 }}
                  className="h-full bg-gradient-to-r from-primary to-cta-orange rounded-full"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">17,000 / 25,000 tokens used this month</p>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:opacity-90 transition-all shadow-lg">
              Change Plan
            </button>
            <button className="flex-1 px-4 py-2.5 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl font-bold text-xs transition-all">
              View Invoices
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDetails;
