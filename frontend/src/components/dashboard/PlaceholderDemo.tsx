import React from 'react';

interface PlaceholderDemoProps {
  title: string;
}

const PlaceholderDemo: React.FC<PlaceholderDemoProps> = ({ title }) => (
  <div className="demo-view p-8 flex flex-col items-center justify-center h-full text-center">
    <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
    </div>
    <h2 className="text-4xl font-bold mb-4">{title} Demo</h2>
    <p className="text-muted-foreground max-w-md">This feature is currently under development. Stay tuned for updates in the next release!</p>
  </div>
);

export default PlaceholderDemo;
