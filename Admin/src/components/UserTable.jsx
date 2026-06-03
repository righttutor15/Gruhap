import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Mail, Shield, Clock, Search, Filter, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const UserTable = ({ users: propUsers, loading: propLoading }) => {
  const navigate = useNavigate();
  const [localUsers, setLocalUsers] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [search, setSearch] = useState('');

  const users = propUsers !== undefined ? propUsers : localUsers;
  const loading = propLoading !== undefined ? propLoading : localLoading;

  useEffect(() => {
    if (propUsers !== undefined) return;
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`);
        const data = await response.json();
        if (data.success) setLocalUsers(data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLocalLoading(false);
      }
    };
    fetchUsers();
  }, [propUsers]);

  // Show first 5 as preview
  const previewUsers = users.slice(0, 5);

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-border/50">
      <div className="p-6 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-display font-bold">Recent Users</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Loading users...</td>
              </tr>
            ) : previewUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">No users found.</td>
              </tr>
            ) : (
              previewUsers.map((user, index) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={user.id}
                  onClick={() => navigate(`/users/${user.id}`)}
                  className="hover:bg-secondary/10 transition-colors group cursor-pointer"
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
                      user.plan === 'Pro'        ? 'bg-cta-orange/10 text-cta-orange' :
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

      {/* Footer — View All navigates to /users/all */}
      <div className="p-4 border-t border-border/30 bg-secondary/10 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">
          Showing {previewUsers.length} of {users.length} users
        </span>
        <button
          onClick={() => navigate('/users/all')}
          className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-all group"
        >
          View All Users
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default UserTable;
