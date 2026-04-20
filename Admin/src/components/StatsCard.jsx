import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}


const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
  const isPositive = trend === 'up';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card-elevated p-6 rounded-3xl relative overflow-hidden group transition-all duration-300"
    >
      <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-50" />
      
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
          color || "bg-primary"
        )}>
          <Icon size={24} />
        </div>
        
        <div className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
          isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
        )}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trendValue}%
        </div>
      </div>

      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-display font-bold leading-none">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatsCard;
