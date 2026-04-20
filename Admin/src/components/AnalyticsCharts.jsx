import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const USER_GROWTH_DATA = [
  { name: 'Jan', users: 400, tokens: 2400 },
  { name: 'Feb', users: 300, tokens: 1398 },
  { name: 'Mar', users: 600, tokens: 9800 },
  { name: 'Apr', users: 800, tokens: 3908 },
  { name: 'May', users: 500, tokens: 4800 },
  { name: 'Jun', users: 900, tokens: 3800 },
];

const CATEGORY_DATA = [
  { name: 'JEE Prep', value: 45, color: '#aa3bff' },
  { name: 'NEET Prep', value: 30, color: '#2495d5' },
  { name: 'K12 Subjects', value: 25, color: '#f59e0b' },
];

const AnalyticsCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* User Growth Chart */}
      <div className="glass-card-elevated p-6 rounded-3xl min-h-[400px] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold">User Growth</h2>
          <select className="bg-secondary/30 border border-border/50 rounded-lg px-3 py-1 text-xs font-bold outline-none">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={USER_GROWTH_DATA}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#aa3bff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#aa3bff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#aa3bff" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution Chart */}
      <div className="glass-card-elevated p-6 rounded-3xl min-h-[400px] flex flex-col">
        <h2 className="text-xl font-display font-bold mb-6">Popular Categories</h2>
        <div className="flex-1 w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CATEGORY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {CATEGORY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-display font-bold">100%</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Traffic</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {CATEGORY_DATA.map((item) => (
            <div key={item.name} className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold whitespace-nowrap">{item.name}</span>
              </div>
              <span className="text-sm font-display font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
