import { motion } from "framer-motion";
import { Coins, Wallet, Zap, ShieldCheck } from "lucide-react";

export const TokenInfo = () => (
  <div className="p-4 space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
        <Coins size={20} />
      </div>
      <div>
        <h3 className="font-display font-bold text-lg">Gruhap Tokens</h3>
        <p className="text-xs text-muted-foreground">Used for high-priority AI processing</p>
      </div>
    </div>
    <div className="bg-muted/50 rounded-2xl p-4 flex items-center justify-between">
      <span className="text-sm font-medium">Available Balance</span>
      <span className="text-2xl font-bold text-amber-500">2,450</span>
    </div>
    <button className="w-full py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors">
      Buy More Tokens
    </button>
  </div>
);

export const BalanceInfo = () => (
  <div className="p-4 space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
        <Wallet size={20} />
      </div>
      <div>
        <h3 className="font-display font-bold text-lg">Your Wallet</h3>
        <p className="text-xs text-muted-foreground">Credits for premium tutoring sessions</p>
      </div>
    </div>
    <div className="bg-muted/50 rounded-2xl p-4 flex items-center justify-between">
      <span className="text-sm font-medium">Credit Balance</span>
      <span className="text-2xl font-bold text-emerald-500">₹450.00</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <button className="py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">History</button>
      <button className="py-2 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors">Add Money</button>
    </div>
  </div>
);

export const SubscriptionInfo = () => (
  <div className="p-4 space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <ShieldCheck size={20} />
      </div>
      <div>
        <h3 className="font-display font-bold text-lg">Pro Plan</h3>
        <p className="text-xs text-muted-foreground">Active until June 15, 2026</p>
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium px-1">
        <span>AI Queries Used</span>
        <span>85%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "85%" }}
          className="h-full bg-primary"
        />
      </div>
    </div>
    <button className="w-full py-2.5 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors">
      Manage Subscription
    </button>
  </div>
);
