import React from 'react';

const BalanceDemo = () => (
  <div className="demo-view p-8">
    <h2 className="text-2xl font-bold mb-6">Wallet & Usage</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="glass-card-elevated p-8 rounded-2xl">
        <p className="text-muted-foreground text-sm mb-1 uppercase tracking-wider font-bold">Current Plan</p>
        <h3 className="text-3xl font-bold text-cta mb-6">Free Plan</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Daily AI Tokens</span>
              <span className="font-bold">4 / 10 used</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-cta" style={{ width: '40%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Study Hours</span>
              <span className="font-bold">12 / 50 hrs</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: '24%' }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="glass-card-elevated p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <span className="text-sm">Total Questions Solved</span>
            <span className="font-bold">142</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <span className="text-sm">Last Practice Test</span>
            <span className="font-bold text-green-500">82% Score</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <span className="text-sm">Tokens Reset In</span>
            <span className="font-bold">08h 22m</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BalanceDemo;
