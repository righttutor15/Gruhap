import { Search, TrendingUp, Clock, Plus, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";

import { fadeUp, tapShrink } from "@/lib/motion";
import { subCommunities, formatMembers } from "@/lib/communities";

interface CommunityHeaderProps {
  search: string;
  onSearchChange: (v: string) => void;
  sortBy: string;
  onSortChange: (v: string) => void;
  onAskClick: () => void;
  totalQuestions: number;
}

const sortOptions = [
  { label: "Trending", icon: TrendingUp },
  { label: "Recent", icon: Clock },
];

const typingSuggestions = [
  "Search for NEET biology doubts...",
  "Ask about JEE Physics problems...",
  "Discuss UI/UX design trends...",
  "Find study tips for final exams...",
  "Ask about career roadmaps...",
];


const CommunityHeader = ({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  onAskClick,
  totalQuestions,
}: CommunityHeaderProps) => {
  const totalMembers = subCommunities.reduce((acc, c) => acc + c.members, 0);
  const totalOnline = subCommunities.reduce((acc, c) => acc + c.activeNow, 0);
  const displayText = useTypewriter(typingSuggestions);


  return (
    <>
      {/* Title bar */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <Link
            to="/"
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-destructive" />
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Community
              </h1>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-muted-foreground">
                {formatMembers(totalMembers)} members
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {formatMembers(totalOnline)} online
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="text-xs text-muted-foreground">{totalQuestions} posts</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search + Sort + Ask */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.06 }}
        className="flex flex-col sm:flex-row gap-3 mb-5"
      >
        <div className="relative flex-1 group">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors"
          />
          <input
            type="text"
            placeholder=""
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted text-sm text-foreground placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          {!search && (
            <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
              <span className="text-sm text-muted-foreground">{displayText}</span>
              <motion.span
                className="inline-block w-0.5 h-4 bg-cta ml-0.5"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            </div>
          )}

        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5">
            {sortOptions.map(({ label, icon: Icon }) => (
              <motion.button
                key={label}
                onClick={() => onSortChange(label)}
                whileTap={tapShrink}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium transition-all ${
                  sortBy === label
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={13} /> {label}
              </motion.button>
            ))}
          </div>
          <motion.button
            onClick={onAskClick}
            whileHover={{ scale: 1.03 }}
            whileTap={tapShrink}
            className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center gap-1.5"
          >
            <Plus size={14} /> Create Post
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default CommunityHeader;
