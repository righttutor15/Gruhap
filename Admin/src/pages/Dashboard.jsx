import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, IndianRupee, TrendingUp, TrendingDown, Repeat,
  ArrowRight, Mail, Shield, Clock, CheckCircle2, ArrowDownRight,
  Sparkles, Activity, BarChart2, Download
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

/* ─── tiny helpers ─────────────────────────────────────────── */
const Trend = ({ value, isPositive }) => (
  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
    }`}>
    {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
    {value}%
  </span>
);

/* Custom recharts tooltip */
const ChartTip = ({ contentStyle, ...rest }) => (
  <Tooltip
    contentStyle={{
      backgroundColor: 'hsl(var(--card))',
      borderColor: 'hsl(var(--border))',
      borderRadius: '14px',
      fontSize: '12px',
      fontWeight: 'bold',
      boxShadow: '0 10px 30px rgba(0,0,0,.15)',
    }}
    cursor={{ fill: 'hsl(var(--secondary)/0.3)' }}
    {...rest}
  />
);

/* ─── KPI card ─────────────────────────────────────────────── */
const KpiCard = ({ icon: Icon, label, value, trendValue, isPositive, accent, delay, sublabel }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -6, scale: 1.02 }}
    className="glass-card-elevated p-6 rounded-3xl relative overflow-hidden group"
  >
    {/* glow */}
    <div className="absolute top-0 right-0 w-36 h-36 -mr-10 -mt-10 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-60" />

    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl ${accent} flex items-center justify-center text-white shadow-lg`}>
        <Icon size={22} />
      </div>
      <Trend value={trendValue} isPositive={isPositive} />
    </div>

    <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest mb-1">{label}</p>
    <h3 className="text-2xl font-display font-bold leading-none mb-1">{value}</h3>
    {sublabel && <p className="text-[10px] text-muted-foreground font-medium">{sublabel}</p>}
  </motion.div>
);

/* ─── main Dashboard ───────────────────────────────────────── */
import DateRangePicker from '../components/DateRangePicker';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async (range) => {
    setLoading(true);
    try {
      const startStr = range.startDate.toISOString().split('T')[0];
      const endStr = range.endDate.toISOString().split('T')[0];
      const [sRes, rRes, uRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stats?startDate=${startStr}&endDate=${endStr}`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/revenue?startDate=${startStr}&endDate=${endStr}`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users?startDate=${startStr}&endDate=${endStr}`),
      ]);
      const [sJson, rJson, uJson] = await Promise.all([
        sRes.json(), rRes.json(), uRes.json()
      ]);
      if (sJson.success) setStats(sJson.data);
      if (rJson.success) setRevenue(rJson.data);
      if (uJson.success) setUsers(uJson.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(dateRange);
  }, [dateRange]);

  const handleDateChange = (newRange) => {
    setDateRange(newRange);
  };

  /* derive KPI values from fetched data */
  const kpiStats = stats ? [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.kpiData.find(k => k.title === 'Total Users')?.value ?? '—',
      trendValue: stats.kpiData.find(k => k.title === 'Total Users')?.trendValue ?? 0,
      isPositive: stats.kpiData.find(k => k.title === 'Total Users')?.trend === 'up',
      accent: 'bg-primary',
      sublabel: 'Registered accounts',
    },
    {
      icon: IndianRupee,
      label: 'Total Revenue',
      value: revenue?.kpiData.find(k => k.title === 'Total Revenue')?.value ?? '—',
      trendValue: revenue?.kpiData.find(k => k.title === 'Total Revenue')?.trendValue ?? 0,
      isPositive: true,
      accent: 'bg-emerald-500',
      sublabel: 'Last 12 months',
    },
    {
      icon: Repeat,
      label: 'Monthly Revenue',
      value: revenue?.kpiData.find(k => k.title === 'Monthly Recurring')?.value ?? '—',
      trendValue: revenue?.kpiData.find(k => k.title === 'Monthly Recurring')?.trendValue ?? 0,
      isPositive: true,
      accent: 'bg-indigo-500',
      sublabel: 'MRR this month',
    },
    {
      icon: TrendingUp,
      label: 'User Growth',
      value: stats.userGrowthData.length > 0
        ? `+${stats.userGrowthData[stats.userGrowthData.length - 1].users}`
        : '—',
      trendValue: 19.2,
      isPositive: true,
      accent: 'bg-cta-orange',
      sublabel: 'New users this month',
    },
  ] : [];

  const recentUsers = users.slice(0, 6);
  const recentTxns = (revenue?.transactions ?? []).slice(0, 6);

  /* Monthly revenue bar data */
  const monthlyData = revenue?.monthlyRevenue ?? [];
  /* User growth area data */
  const growthData = stats?.userGrowthData ?? [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            Welcome back, <span className="text-primary font-bold">Admin</span>
            <Sparkles size={15} className="text-cta-orange animate-pulse" />
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <DateRangePicker onChange={handleDateChange} defaultRange={dateRange} />
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl font-bold text-sm transition-all">
            <Download size={15} /> Export Report
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-3xl p-6 h-36 animate-pulse bg-secondary/10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpiStats.map((k, i) => (
            <KpiCard key={k.label} {...k} delay={i * 0.08} />
          ))}
        </div>
      )}

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* User Growth — spans 3 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card-elevated rounded-3xl p-6 lg:col-span-3 flex flex-col h-[340px]"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-display font-bold">User Growth</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Monthly new users</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
              <Activity size={13} /> Live
            </div>
          </div>
          <div className="flex-1 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ugGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.3)" />
                <XAxis
                  dataKey="name"
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                />
                <YAxis
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                />
                <ChartTip formatter={(v) => [v, 'Users']} />
                <Area
                  type="monotone" dataKey="users"
                  stroke="hsl(var(--primary))" strokeWidth={3}
                  fillOpacity={1} fill="url(#ugGrad)"
                  dot={{ fill: 'hsl(var(--primary))', r: 4, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Revenue — spans 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card-elevated rounded-3xl p-6 lg:col-span-2 flex flex-col h-[340px]"
        >
          <div className="mb-4">
            <h3 className="text-lg font-display font-bold">Monthly Revenue</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Revenue vs Expenses</p>
          </div>
          <div className="flex items-center gap-4 mb-3 text-xs font-bold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: 'hsl(var(--primary))' }} /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" /> Expenses</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={4} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.3)" />
                <XAxis
                  dataKey="month"
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                />
                <YAxis
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <ChartTip formatter={(v, n) => [`₹${v.toLocaleString('en-IN')}`, n === 'revenue' ? 'Revenue' : 'Expenses']} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={18} />
                <Bar dataKey="expenses" fill="#f87171" radius={[6, 6, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── Two Tables ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent New Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-card rounded-3xl overflow-hidden border border-border/50"
        >
          <div className="px-6 py-5 border-b border-border/30 flex items-center justify-between">
            <div>
              <h3 className="text-base font-display font-bold">Recent New Users</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">Latest registrations</p>
            </div>
            <button
              onClick={() => navigate('/users/all')}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-all group"
            >
              View All <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/10">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">User</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Plan</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Joined</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan="4" className="px-5 py-3">
                        <div className="h-8 rounded-lg bg-secondary/20 animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : recentUsers.length === 0 ? (
                  <tr><td colSpan="4" className="px-5 py-8 text-center text-muted-foreground text-sm">No users found.</td></tr>
                ) : (
                  recentUsers.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + i * 0.05 }}
                      onClick={() => navigate(`/users/${user.id}`)}
                      className="hover:bg-secondary/10 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-primary/10" />
                          <div>
                            <div className="font-bold text-sm leading-none">{user.name}</div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                              <Mail size={9} /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${user.plan === 'Enterprise' ? 'bg-indigo-500/10 text-indigo-500' :
                          user.plan === 'Pro' ? 'bg-cta-orange/10 text-cta-orange' :
                            'bg-slate-500/10 text-slate-500'
                          }`}>
                          <Shield size={9} /> {user.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={11} /> {user.joined}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                          {user.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-border/20 bg-secondary/5 text-xs text-muted-foreground font-medium">
            Showing {recentUsers.length} of {users.length} users
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="glass-card rounded-3xl overflow-hidden border border-border/50"
        >
          <div className="px-6 py-5 border-b border-border/30 flex items-center justify-between">
            <div>
              <h3 className="text-base font-display font-bold">Recent Transactions</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">Latest payment activity</p>
            </div>
            <button
              onClick={() => navigate('/revenue/all-transactions')}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-all group"
            >
              View All <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/10">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">User</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Plan</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan="4" className="px-5 py-3">
                        <div className="h-8 rounded-lg bg-secondary/20 animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : recentTxns.length === 0 ? (
                  <tr><td colSpan="4" className="px-5 py-8 text-center text-muted-foreground text-sm">No transactions found.</td></tr>
                ) : (
                  recentTxns.map((tx, i) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 + i * 0.05 }}
                      className="hover:bg-secondary/10 transition-colors group"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={tx.avatar} alt={tx.name} className="w-8 h-8 rounded-full border border-primary/10" />
                          <div>
                            <div className="font-bold text-sm leading-none">{tx.name}</div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                              <Mail size={9} /> {tx.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tx.plan === 'Enterprise' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-cta-orange/10 text-cta-orange'
                          }`}>
                          {tx.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-bold text-sm">{tx.amount}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                          tx.status === 'Pending' ? 'bg-amber-500/10  text-amber-500' :
                            'bg-rose-500/10   text-rose-500'
                          }`}>
                          {tx.status === 'Completed' ? <CheckCircle2 size={9} /> :
                            tx.status === 'Pending' ? <Clock size={9} /> :
                              <ArrowDownRight size={9} />}
                          {tx.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-border/20 bg-secondary/5 text-xs text-muted-foreground font-medium">
            Showing {recentTxns.length} of {(revenue?.transactions ?? []).length} transactions
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Dashboard;
