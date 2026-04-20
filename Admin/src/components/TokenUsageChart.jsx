import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';

const TOKEN_DATA = [
  { time: '00:00', tokens: 1200 },
  { time: '04:00', tokens: 800 },
  { time: '08:00', tokens: 2400 },
  { time: '12:00', tokens: 5600 },
  { time: '16:00', tokens: 8200 },
  { time: '20:00', tokens: 4500 },
  { time: '23:59', tokens: 2100 },
];

const TokenUsageChart = () => {
  return (
    <div className="glass-card-elevated p-6 rounded-3xl h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-bold">Token Consumption</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Real-time AI Load</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Live
          </span>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TOKEN_DATA}>
            <defs>
              <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--cta-orange))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--cta-orange))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
            <XAxis 
              dataKey="time" 
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
            <Area 
              type="monotone" 
              dataKey="tokens" 
              stroke="hsl(var(--cta-orange))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#tokenGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TokenUsageChart;
