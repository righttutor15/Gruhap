import React from 'react';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie
} from 'recharts';

const REVENUE_DATA = [
  { name: 'Mon', revenue: 4000, active: 2400 },
  { name: 'Tue', revenue: 3000, active: 1398 },
  { name: 'Wed', revenue: 6000, active: 9800 },
  { name: 'Thu', revenue: 8000, active: 3908 },
  { name: 'Fri', revenue: 5000, active: 4800 },
  { name: 'Sat', revenue: 9000, active: 3800 },
  { name: 'Sun', revenue: 7000, active: 4300 },
];

const SUBSCRIPTION_DATA = [
  { name: 'Free', value: 70, color: 'hsl(var(--muted))' },
  { name: 'Pro', value: 20, color: 'hsl(var(--cta-orange))' },
  { name: 'Enterprise', value: 10, color: 'hsl(var(--primary))' },
];

const RevenueCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Weekly Revenue */}
      <div className="glass-card-elevated p-6 rounded-3xl lg:col-span-2 h-[400px]">
        <h3 className="text-lg font-display font-bold mb-6">Revenue Overview</h3>
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
              <XAxis 
                dataKey="name" 
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
              <Bar 
                dataKey="revenue" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subscription Breakdown */}
      <div className="glass-card-elevated p-6 rounded-3xl h-[400px] flex flex-col">
        <h3 className="text-lg font-display font-bold mb-6">User Base</h3>
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={SUBSCRIPTION_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {SUBSCRIPTION_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-display font-bold">1.2k</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Total Users</span>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          {SUBSCRIPTION_DATA.map((item) => (
            <div key={item.name} className="flex justify-between items-center px-2 py-1 rounded-lg bg-secondary/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold">{item.name}</span>
              </div>
              <span className="text-xs font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueCharts;
