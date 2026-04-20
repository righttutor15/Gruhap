import React from 'react';
import { Users, Coins, TrendingUp, Zap, Sparkles } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import AnalyticsCharts from '../components/AnalyticsCharts';
import UserTable from '../components/UserTable';
import InquiriesTable from '../components/InquiriesTable';
import TokenUsageChart from '../components/TokenUsageChart';
import RevenueCharts from '../components/RevenueCharts';
import { motion } from 'framer-motion';

const Dashboard = () => {


  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            Welcome back, <span className="text-primary font-bold">Admin</span> <Sparkles size={16} className="text-cta-orange animate-pulse" />
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-background ring-offset-2 ring-offset-background"
                src={`https://i.pravatar.cc/100?u=${i}`}
                alt=""
              />
            ))}
          </div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">+12 Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Users" 
          value="1,284" 
          icon={Users} 
          trend="up" 
          trendValue={12.5} 
          color="bg-primary"
        />
        <StatsCard 
          title="Active Tokens" 
          value="85.4k" 
          icon={Coins} 
          trend="up" 
          trendValue={8.2} 
          color="bg-cta-orange"
        />
        <StatsCard 
          title="Avg. Session" 
          value="24m 12s" 
          icon={Zap} 
          trend="down" 
          trendValue={3.1} 
          color="bg-blue-500"
        />
        <StatsCard 
          title="Revenue" 
          value="₹45,200" 
          icon={TrendingUp} 
          trend="up" 
          trendValue={15.4} 
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <AnalyticsCharts />
        </div>
        <TokenUsageChart />
      </div>

      <RevenueCharts />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <UserTable />
        <InquiriesTable />
      </div>

    </div>
  );
};


export default Dashboard;
