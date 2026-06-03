import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Clock, CheckCircle2, AlertCircle, MoreHorizontal, ArrowRight } from 'lucide-react';

const InquiriesTable = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/inquiries`);
        const data = await response.json();
        if (data.success) setInquiries(data.data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading inquiries...</div>;
  }

  // Preview: first 5
  const previewItems = inquiries.slice(0, 5);

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-border/50 bg-white/50 dark:bg-card/30">
      <div className="p-6 border-b border-border/30 flex items-center justify-between">
        <h2 className="text-xl font-display font-bold">User Inquiries</h2>
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-tight">
          {inquiries.length} Total Requests
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-secondary/20 dark:bg-secondary/5">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Inquiry</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {previewItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">No inquiries found.</td>
              </tr>
            ) : (
              previewItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-secondary/5 dark:hover:bg-secondary/10 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{item.name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail size={12} /> {item.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <div className="font-bold text-sm mb-1">{item.subject}</div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.message}</p>
                      <div className="flex items-center gap-1 mt-2 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                        <Clock size={10} /> {item.date}
                      </div>
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

      {/* Footer — navigates to /inquiries/all */}
      <div className="p-4 border-t border-border/30 bg-secondary/5 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">
          Showing {previewItems.length} of {inquiries.length} tickets
        </span>
        <button
          onClick={() => navigate('/inquiries/all')}
          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-all group"
        >
          View All Support Tickets
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default InquiriesTable;
