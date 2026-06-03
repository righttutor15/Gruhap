import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Clock, CheckCircle2, ArrowDownRight, MoreHorizontal,
  Search, ArrowLeft, IndianRupee, Download, TrendingUp
} from 'lucide-react';

const STATUSES = ['All', 'Completed', 'Pending', 'Failed'];
const PLANS = ['All', 'Pro', 'Enterprise'];

const AllTransactionsPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'amount'

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/revenue`);
        const data = await res.json();
        if (data.success) setTransactions(data.data.transactions || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  const filtered = transactions.filter((tx) => {
    const q = search.toLowerCase();
    const matchSearch =
      tx.name?.toLowerCase().includes(q) ||
      tx.email?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || tx.status === statusFilter;
    const matchPlan   = planFilter   === 'All' || tx.plan   === planFilter;
    return matchSearch && matchStatus && matchPlan;
  });

  const totalRevenue = transactions
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => {
      const num = parseFloat(String(t.amount).replace(/[^0-9.]/g, '')) || 0;
      return sum + num;
    }, 0);

  const statusCount = (s) => transactions.filter((t) => t.status === s).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/revenue')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/40 border border-border/50 hover:bg-secondary/70 transition-all text-sm font-bold"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-1">All Transactions</h1>
            <p className="text-muted-foreground font-medium">
              Complete payment history — {transactions.length} records
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl font-bold text-sm transition-all">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* ── KPI chips ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Completed',
            value: statusCount('Completed'),
            color: 'text-emerald-500',
            border: 'border-emerald-500/20',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Pending',
            value: statusCount('Pending'),
            color: 'text-amber-500',
            border: 'border-amber-500/20',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'Failed',
            value: statusCount('Failed'),
            color: 'text-rose-500',
            border: 'border-rose-500/20',
            bg: 'bg-rose-500/10',
          },
          {
            label: 'Total Records',
            value: transactions.length,
            color: 'text-foreground',
            border: 'border-border/30',
            bg: '',
          },
        ].map(({ label, value, color, border, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`glass-card p-4 rounded-2xl border ${border} ${bg}`}
          >
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
            <span className={`text-2xl font-display font-bold ${color}`}>{value}</span>
          </motion.div>
        ))}
      </div>

      {/* ── Filters Bar ── */}
      <div className="glass-card rounded-2xl p-4 border border-border/30 flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full bg-secondary/30 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === s
                  ? s === 'Completed' ? 'bg-emerald-500 text-white shadow'
                  : s === 'Pending'   ? 'bg-amber-500 text-white shadow'
                  : s === 'Failed'    ? 'bg-rose-500 text-white shadow'
                  : 'bg-primary text-primary-foreground shadow'
                  : 'bg-secondary/30 border border-border/50 hover:bg-secondary/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Plan filter */}
        <div className="flex items-center gap-1.5">
          {PLANS.map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                planFilter === p
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'bg-secondary/30 border border-border/50 hover:bg-secondary/60'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground font-medium ml-auto whitespace-nowrap">
          {filtered.length} of {transactions.length} records
        </span>
      </div>

      {/* ── Table ── */}
      <div className="glass-card rounded-3xl overflow-hidden border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/20">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">#</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading transactions…
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-muted-foreground">
                    <IndianRupee size={40} className="mx-auto mb-3 opacity-20" />
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.5) }}
                    className="hover:bg-secondary/10 transition-colors group"
                  >
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono font-bold">
                      #{String(index + 1).padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={tx.avatar}
                          alt={tx.name}
                          className="w-9 h-9 rounded-full border-2 border-primary/10"
                        />
                        <div>
                          <div className="font-bold text-sm">{tx.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail size={10} /> {tx.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        tx.plan === 'Enterprise' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-cta-orange/10 text-cta-orange'
                      }`}>
                        {tx.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-sm">{tx.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                        <Clock size={12} /> {tx.date}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${
                        tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        tx.status === 'Pending'   ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-rose-500/10 text-rose-500'
                      }`}>
                        {tx.status === 'Completed' ? <CheckCircle2 size={10} /> :
                         tx.status === 'Pending'   ? <Clock size={10} /> :
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-border/30 bg-secondary/5 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">
              Showing <span className="font-bold text-foreground">{filtered.length}</span> of{' '}
              <span className="font-bold text-foreground">{transactions.length}</span> transactions
            </p>
            {totalRevenue > 0 && (
              <p className="text-xs font-bold flex items-center gap-1 text-emerald-500">
                <TrendingUp size={12} />
                ₹{totalRevenue.toLocaleString('en-IN')} confirmed revenue
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTransactionsPage;
