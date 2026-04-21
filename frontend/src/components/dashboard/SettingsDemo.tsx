import React from 'react';

interface SettingsDemoProps {
  user: {
    name: string;
    avatar: string;
    plan: string;
  };
}

const SettingsDemo: React.FC<SettingsDemoProps> = ({ user }) => (
  <div className="demo-view p-8 max-w-2xl">
    <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
    <div className="glass-card-elevated p-8 rounded-2xl space-y-8">
      <div className="flex items-center gap-6">
        <div className="relative">
          <img src={user.avatar} alt="User" className="w-20 h-20 rounded-full border-4 border-secondary" />
          <div className="absolute bottom-0 right-0 p-1 bg-primary rounded-full text-white cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold">{user.name}</h3>
          <p className="text-muted-foreground">{user.plan} Subscription</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 pt-4 border-t border-secondary">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Email Notifications</p>
            <p className="text-xs text-muted-foreground">Receive weekly progress reports</p>
          </div>
          <div className="w-12 h-6 bg-cta rounded-full relative p-1 cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Adjust interface appearance</p>
          </div>
          <div className="w-12 h-6 bg-secondary rounded-full relative p-1 cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute left-1"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Focus Mode</p>
            <p className="text-xs text-muted-foreground">Reduce distractions during chat</p>
          </div>
          <div className="w-12 h-6 bg-cta rounded-full relative p-1 cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsDemo;
