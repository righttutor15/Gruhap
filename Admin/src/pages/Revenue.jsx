import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IndianRupee, TrendingUp, TrendingDown, Users, ArrowUpRight, ArrowDownRight,
  FileDown, Calendar, CreditCard, Repeat, AlertTriangle, CheckCircle2, Clock, MoreHorizontal, Mail,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

import DateRangePicker from '../components/DateRangePicker';

const Revenue = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });
  const [data, setData] = useState({
    monthlyRevenue: [],
    planRevenue: [],
    revenueBreakdown: [],
    transactions: [],
    kpiData: []
  });
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async (range) => {
    setLoading(true);
    try {
      const startStr = range.startDate.toISOString().split('T')[0];
      const endStr = range.endDate.toISOString().split('T')[0];
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/revenue?startDate=${startStr}&endDate=${endStr}`);
      const json = await response.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Error fetching revenue:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue(dateRange);
  }, [dateRange]);

  const handleDateChange = (newRange) => {
    setDateRange(newRange);
  };

  const kpiIcons = {
    'Total Revenue': IndianRupee,
    'Monthly Recurring': Repeat,
    'Avg. Per User': Users,
    'Churn Rate': AlertTriangle
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground font-bold">Loading revenue data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Revenue & Finance</h1>
          <p className="text-muted-foreground font-medium">Track earnings, subscriptions, and financial performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker onChange={handleDateChange} defaultRange={dateRange} />
          
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg">
            <FileDown size={16} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.kpiData.map((kpi, i) => {
          const Icon = kpiIcons[kpi.title] || IndianRupee;
          const kpiColor = kpi.title === 'Total Revenue' ? 'bg-emerald-500' :
            kpi.title === 'Monthly Recurring' ? 'bg-primary' :
              kpi.title === 'Avg. Per User' ? 'bg-indigo-500' : 'bg-rose-500';

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
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${kpi.trend === 'up'
                  ? (kpi.title === 'Churn Rate' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-500/10 text-emerald-500')
                  : (kpi.title === 'Churn Rate' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500')
                  }`}>
                  {kpi.title === 'Churn Rate'
                    ? <TrendingDown size={14} />
                    : (kpi.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />)
                  }
                  {kpi.trendValue}%
                </div>
              </div>
              <p className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wider">{kpi.title}</p>
              <h3 className="text-2xl font-display font-bold leading-none mb-1">{kpi.value}</h3>
              <p className="text-[10px] text-muted-foreground font-medium">{kpi.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Trend + Breakdown */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
      {/* Monthly Revenue Trend */}
      {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card-elevated p-6 rounded-3xl lg:col-span-2 h-[420px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-display font-bold">Revenue Trend</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Monthly revenue vs expenses</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs font-bold">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold">
                <span className="w-3 h-3 rounded-full bg-rose-400" /> Expenses
              </span>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyRevenue}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
                <Area type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        Revenue Breakdown Donut
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card-elevated p-6 rounded-3xl h-[420px] flex flex-col"
        >
          <h3 className="text-lg font-display font-bold mb-2">Revenue Sources</h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-display font-bold">₹72k</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">This Month</span>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            {data.revenueBreakdown.map((item) => (
              <div key={item.name} className="flex justify-between items-center px-2 py-1 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div> */}

      {/* Revenue by Plan
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card-elevated p-6 rounded-3xl h-[340px] flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-display font-bold">Revenue by Plan</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Current month comparison</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-400" /> Free</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cta-orange" /> Pro</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-500" /> Enterprise</span>
          </div>
        </div>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.planRevenue} barGap={12}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
              <XAxis
                dataKey="plan"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                tickFormatter={(v) => `₹${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
                formatter={(value, name) => {
                  if (name === 'revenue') return [`₹${value.toLocaleString('en-IN')}`, 'Revenue'];
                  return [value, 'Users'];
                }}
              />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]} barSize={60}>
                {data.planRevenue.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? 'hsl(var(--muted))' : index === 1 ? 'hsl(var(--cta-orange))' : '#aa3bff'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div> */}

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-3xl overflow-hidden border border-border/50"
      >
        <div className="p-6 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-bold">Recent Transactions</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Latest payment activity</p>
          </div>
          <button
            onClick={() => navigate('/revenue/all-transactions')}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-all group"
          >
            View All Transactions
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/20">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {data.transactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.06 }}
                  className="hover:bg-secondary/10 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={tx.avatar} alt={tx.name} className="w-9 h-9 rounded-full border-2 border-primary/10" />
                      <div>
                        <div className="font-bold text-sm">{tx.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail size={10} /> {tx.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${tx.plan === 'Enterprise' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-cta-orange/10 text-cta-orange'
                      }`}>
                      {tx.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-sm">{tx.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock size={12} /> {tx.date}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                      tx.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                      {tx.status === 'Completed' ? <CheckCircle2 size={10} /> :
                        tx.status === 'Pending' ? <Clock size={10} /> :
                          <ArrowDownRight size={10} />}
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground group-hover:text-foreground">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Revenue;
