import React from 'react';

const BuyTokenDemo = () => (
  <div className="demo-view p-8">
    <h2 className="text-2xl font-bold mb-6">Upgrade Your Plan</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass-card-elevated p-6 rounded-2xl border-2 border-transparent hover:border-cta transition-all">
        <h3 className="text-xl font-bold mb-2">Free</h3>
        <p className="text-4xl font-bold mb-4">₹0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
        <ul className="space-y-2 text-sm text-muted-foreground mb-6">
          <li>• 10 AI messages per day</li>
          <li>• Basic study materials</li>
          <li>• Community access</li>
        </ul>
        <button className="w-full py-2 bg-secondary rounded-lg font-semibold cursor-not-allowed">Current Plan</button>
      </div>
      <div className="glass-card-elevated p-6 rounded-2xl border-2 border-cta relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cta text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
        <h3 className="text-xl font-bold mb-2">Pro</h3>
        <p className="text-4xl font-bold mb-4">₹499<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
        <ul className="space-y-2 text-sm text-muted-foreground mb-6">
          <li>• Unlimited AI messages</li>
          <li>• Advanced Mock Tests</li>
          <li>• Priority Support</li>
          <li>• Personal Mentor</li>
        </ul>
        <button className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90">Upgrade Now</button>
      </div>
      <div className="glass-card-elevated p-6 rounded-2xl border-2 border-transparent hover:border-cta transition-all">
        <h3 className="text-xl font-bold mb-2">Enterprise</h3>
        <p className="text-4xl font-bold mb-4">Custom</p>
        <ul className="space-y-2 text-sm text-muted-foreground mb-6">
          <li>• Institutional access</li>
          <li>• Custom content</li>
          <li>• Dedicated support</li>
          <li>• Analytics for schools</li>
        </ul>
        <button className="w-full py-2 bg-secondary rounded-lg font-semibold">Contact Us</button>
      </div>
    </div>
  </div>
);

export default BuyTokenDemo;
