import React from 'react';

const HelpDemo = () => (
  <div className="demo-view p-8">
    <h2 className="text-2xl font-bold mb-6">Help & Support</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { q: "How do AI tokens work?", a: "Each question you ask uses 1 token. Free users get 10 tokens per day which reset at midnight." },
        { q: "Can I use Gruhap for NEET?", a: "Absolutely! Choose NEET Prep from the category menu to get specialist medical entrance support." },
        { q: "Is there a mobile app?", a: "We are currently optimized for mobile browsers, with a dedicated app launching in Late 2026." },
        { q: "How to reset my password?", a: "Go to Settings > Security (Beta) to send a password reset link to your registered email." }
      ].map((item, i) => (
        <div key={i} className="glass-card-elevated p-6 rounded-2xl">
          <p className="font-bold mb-2">Q: {item.q}</p>
          <p className="text-sm text-muted-foreground">A: {item.a}</p>
        </div>
      ))}
      <div className="md:col-span-2 glass-card-elevated p-8 rounded-2xl text-center">
        <h3 className="text-lg font-bold mb-2">Still need help?</h3>
        <p className="text-muted-foreground mb-6">Our support team is available Mon-Fri, 9am - 6pm IST.</p>
        <button className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90">Contact Support</button>
      </div>
    </div>
  </div>
);

export default HelpDemo;
