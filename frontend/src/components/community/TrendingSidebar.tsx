import { motion } from "framer-motion";
import { TrendingUp, Award, Zap } from "lucide-react";
import { fadeUp } from "@/lib/motion";

const trendingTopics = [
  { label: "Organic Chemistry Reactions", posts: 128 },
  { label: "Newton's Laws Tricks", posts: 95 },
  { label: "Cell Division Diagrams", posts: 87 },
  { label: "Quadratic Equations", posts: 74 },
  { label: "Chemical Bonding Tips", posts: 63 },
];

const topContributors = [
  { name: "Priya S.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face", points: 1240 },
  { name: "Rahul V.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face", points: 980 },
  { name: "Ananya P.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face", points: 870 },
];

const TrendingSidebar = () => {
  return (
    <motion.aside
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.15 }}
      className="w-full lg:w-72 shrink-0 space-y-3"
    >
      {/* Trending Topics */}
      <div className="glass-card-elevated rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-destructive" />
          <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
            Trending
          </h3>
        </div>
        <div className="space-y-2">
          {trendingTopics.map((topic, i) => (
            <motion.div
              key={topic.label}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              className="flex items-center justify-between py-1.5 group cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                <span className="text-sm text-foreground group-hover:text-primary truncate transition-colors">
                  {topic.label}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground shrink-0">{topic.posts} posts</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="glass-card-elevated rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-amber-500" />
          <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
            Top Helpers
          </h3>
        </div>
        <div className="space-y-2.5">
          {topContributors.map((user, i) => (
            <motion.div
              key={user.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                {i === 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px]">👑</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground block truncate">{user.name}</span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Zap size={10} className="text-amber-500" /> {user.points} karma
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Community Rules */}
      <div className="glass-card-elevated rounded-2xl p-4">
        <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-2">
          Rules
        </h3>
        <ol className="space-y-1.5 text-xs text-muted-foreground list-decimal list-inside">
          <li>Be respectful & supportive</li>
          <li>No spam or self-promotion</li>
          <li>Use appropriate sub-community</li>
          <li>Show your work when asking</li>
          <li>Credit sources & solutions</li>
        </ol>
      </div>
    </motion.aside>
  );
};

export default TrendingSidebar;
