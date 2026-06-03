import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Shield, Clock, Search, Filter, MoreVertical,
  ArrowLeft, Users, Download, UserPlus
} from 'lucide-react';

const PLANS = ['All', 'Free', 'Pro', 'Enterprise'];
const STATUSES = ['All', 'Active', 'Inactive'];

const AllUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`);
        const data = await res.json();
        if (data.success) setUsers(data.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    const matchPlan = planFilter === 'All' || u.plan === planFilter;
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/users')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/40 border border-border/50 hover:bg-secondary/70 transition-all text-sm font-bold"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-1">All Users</h1>
            <p className="text-muted-foreground font-medium">
              Complete user directory — {users.length} total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl font-bold text-sm transition-all">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg">
            <UserPlus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="glass-card rounded-2xl p-4 border border-border/30 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
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

        {/* Plan filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {PLANS.map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${planFilter === p
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'bg-secondary/30 border border-border/50 hover:bg-secondary/60'
                }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === s
                  ? s === 'Active' ? 'bg-emerald-500 text-white shadow'
                    : s === 'Inactive' ? 'bg-rose-500 text-white shadow'
                      : 'bg-primary text-primary-foreground shadow'
                  : 'bg-secondary/30 border border-border/50 hover:bg-secondary/60'
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground font-medium ml-auto whitespace-nowrap">
          {filtered.length} of {users.length} users
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading users…
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-muted-foreground">
                    <Users size={40} className="mx-auto mb-3 opacity-20" />
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.5) }}
                    onClick={() => navigate(`/users/${user.id}`)}
                    className="hover:bg-secondary/10 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono font-bold">
                      #{String(index + 1).padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border-2 border-primary/10"
                        />
                        <div>
                          <div className="font-bold text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${user.plan === 'Enterprise' ? 'bg-indigo-500/10 text-indigo-500' :
                          user.plan === 'Pro' ? 'bg-cta-orange/10 text-cta-orange' :
                            'bg-slate-500/10 text-slate-500'
                        }`}>
                        <Shield size={12} /> {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} /> {user.joined}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground group-hover:text-foreground"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-border/30 bg-secondary/5 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">
              Showing <span className="font-bold text-foreground">{filtered.length}</span> of{' '}
              <span className="font-bold text-foreground">{users.length}</span> users
            </p>
            <p className="text-xs text-muted-foreground">
              Click any row to view user details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsersPage;
