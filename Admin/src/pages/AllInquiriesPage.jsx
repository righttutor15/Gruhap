import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Clock, CheckCircle2, AlertCircle, MoreHorizontal,
  Search, ArrowLeft, Ticket, Download
} from 'lucide-react';

const STATUSES = ['All', 'Pending', 'Urgent', 'Resolved'];

const AllInquiriesPage = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/inquiries`);
        const data = await res.json();
        if (data.success) setInquiries(data.data);
      } catch (err) {
        console.error('Error fetching inquiries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const filtered = inquiries.filter((i) => {
    const q = search.toLowerCase();
    const matchSearch =
      i.name?.toLowerCase().includes(q) ||
      i.email?.toLowerCase().includes(q) ||
      i.subject?.toLowerCase().includes(q) ||
      i.message?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCount = (s) => inquiries.filter((i) => i.status === s).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/inquiries')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/40 border border-border/50 hover:bg-secondary/70 transition-all text-sm font-bold"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-1">All Support Tickets</h1>
            <p className="text-muted-foreground font-medium">
              Complete inquiries log — {inquiries.length} total
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl font-bold text-sm transition-all">
          <Download size={16} /> Export
        </button>
      </div>

      {/* ── Status summary chips ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending',  color: 'bg-amber-500/10  text-amber-500',   border: 'border-amber-500/20' },
          { label: 'Urgent',   color: 'bg-rose-500/10   text-rose-500',    border: 'border-rose-500/20'  },
          { label: 'Resolved', color: 'bg-emerald-500/10 text-emerald-500', border: 'border-emerald-500/20' },
        ].map(({ label, color, border }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-4 rounded-2xl border ${border} cursor-pointer hover:scale-[1.02] transition-transform`}
            onClick={() => setStatusFilter(statusFilter === label ? 'All' : label)}
          >
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
            <span className={`text-2xl font-display font-bold ${color.split(' ')[1]}`}>
              {statusCount(label)}
            </span>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-2xl border border-border/30"
        >
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total</p>
          <span className="text-2xl font-display font-bold">{inquiries.length}</span>
        </motion.div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="glass-card rounded-2xl p-4 border border-border/30 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or subject…"
            className="w-full bg-secondary/30 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === s
                  ? s === 'Pending'  ? 'bg-amber-500 text-white shadow'
                  : s === 'Urgent'   ? 'bg-rose-500 text-white shadow'
                  : s === 'Resolved' ? 'bg-emerald-500 text-white shadow'
                  : 'bg-primary text-primary-foreground shadow'
                  : 'bg-secondary/30 border border-border/50 hover:bg-secondary/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground font-medium ml-auto whitespace-nowrap">
          {filtered.length} of {inquiries.length} tickets
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</th>
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
                      Loading tickets…
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-muted-foreground">
                    <Ticket size={40} className="mx-auto mb-3 opacity-20" />
                    No tickets match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.5) }}
                    className="hover:bg-secondary/5 transition-colors group"
                  >
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono font-bold">
                      #{String(index + 1).padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col min-w-[140px]">
                        <span className="font-bold text-sm">{item.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail size={12} /> {item.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-sm">{item.subject}</span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <Clock size={12} /> {item.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                        item.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' :
                        item.status === 'Urgent'   ? 'bg-rose-500/10 text-rose-500 animate-pulse' :
                                                     'bg-amber-500/10 text-amber-500'
                      }`}>
                        {item.status === 'Resolved' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-secondary/50 rounded-xl transition-all">
                        <MoreHorizontal size={18} className="text-muted-foreground group-hover:text-foreground" />
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
              <span className="font-bold text-foreground">{inquiries.length}</span> tickets
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllInquiriesPage;
