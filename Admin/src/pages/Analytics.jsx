import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, TrendingUp, TrendingDown, Zap, BarChart3, Monitor, Smartphone, Tablet, Calendar } from 'lucide-react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import TokenUsageChart from '../components/TokenUsageChart';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const Analytics = () => {
  const [data, setData] = useState({
    analyticsKpiData: [],
    peakHours: [],
    platformData: [],
    deviceStats: [],
    userGrowthData: [],
    categoryData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`);
        const json = await response.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const kpiIcons = {
    'Daily Active Users': Users,
    'Avg. Session': Clock,
    'Bounce Rate': TrendingDown,
    'Conversion Rate': Zap
  };

  const deviceIcons = {
    'Desktop': Monitor,
    'Mobile': Smartphone,
    'Tablet': Tablet
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground font-bold">Loading analytics data...</p>
      </div>
    );
  }

  const totalSessions = data.platformData.reduce((sum, p) => sum + p.sessions, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Analytics</h1>
          <p className="text-muted-foreground font-medium">Platform usage insights and engagement metrics.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary/30 border border-border/50 rounded-xl px-3 py-2">
          <Calendar size={14} className="text-muted-foreground" />
          <select className="bg-transparent text-xs font-bold outline-none cursor-pointer">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.analyticsKpiData.map((kpi, i) => {
          const Icon = kpiIcons[kpi.title] || Users;
          const kpiColor = kpi.title === 'Daily Active Users' ? 'bg-primary' :
                           kpi.title === 'Avg. Session' ? 'bg-indigo-500' :
                           kpi.title === 'Bounce Rate' ? 'bg-rose-500' : 'bg-emerald-500';

          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card-elevated p-6 rounded-3xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-50" />
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl ${kpiColor} flex items-center justify-center text-white shadow-lg`}>
                  <Icon size={22} />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  kpi.title === 'Bounce Rate'
                    ? (kpi.trend === 'down' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500')
                    : (kpi.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500')
                }`}>
                  {kpi.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {kpi.trendValue}%
                </div>
              </div>
              <p className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wider">{kpi.title}</p>
              <h3 className="text-2xl font-display font-bold leading-none">{kpi.value}</h3>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <AnalyticsCharts userGrowthData={data.userGrowthData} categoryData={data.categoryData} />

      {/* Token Usage + Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TokenUsageChart />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card-elevated p-6 rounded-3xl lg:col-span-2 h-[400px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-display font-bold">Peak Usage Hours</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Active users by hour</p>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.peakHours}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
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
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Platform & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card-elevated p-6 rounded-3xl"
        >
          <h3 className="text-lg font-display font-bold mb-6">Platform Sessions</h3>
          <div className="space-y-4">
            {data.platformData.map((platform, i) => {
              const pct = ((platform.sessions / totalSessions) * 100).toFixed(1);
              return (
                <motion.div
                  key={platform.platform}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-bold flex items-center gap-2">
                      <span className="w-3 h-3 rounded" style={{ backgroundColor: platform.color }} />
                      {platform.platform}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-bold">{platform.sessions.toLocaleString()}</span>
                      <span className="text-xs font-bold w-12 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.6 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-card-elevated p-6 rounded-3xl"
        >
          <h3 className="text-lg font-display font-bold mb-6">Device Breakdown</h3>
          <div className="space-y-5">
            {data.deviceStats.map((device, i) => {
              const Icon = deviceIcons[device.label] || Monitor;
              return (
              <motion.div
                key={device.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="glass-card p-5 rounded-2xl border border-border/20 flex items-center gap-4 hover:bg-secondary/5 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl ${device.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">{device.label}</span>
                    <span className="text-lg font-display font-bold">{device.value}</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: device.value }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.7 + i * 0.1 }}
                      className={`h-full rounded-full ${device.color}`}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">{device.sessions} sessions</p>
                </div>
              </motion.div>
            )})}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
