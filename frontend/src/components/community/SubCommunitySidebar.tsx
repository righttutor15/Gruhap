import { motion } from "framer-motion";
import { Users, Flame, Plus } from "lucide-react";
import { subCommunities, formatMembers, type SubCommunity } from "@/lib/communities";
import { fadeUp, tapShrink } from "@/lib/motion";

interface SubCommunitySidebarProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
  onCreateClick: () => void;
  communities: SubCommunity[];
}

const SubCommunitySidebar = ({ selected, onSelect, onCreateClick, communities }: SubCommunitySidebarProps) => {
  return (
    <motion.aside
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="w-full lg:w-72 shrink-0"
    >
      {/* Header */}
      <div className="glass-card-elevated rounded-2xl p-4 mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-destructive" />
            <h2 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
              Communities
            </h2>
          </div>
          <motion.button
            onClick={onCreateClick}
            whileHover={{ scale: 1.05 }}
            whileTap={tapShrink}
            className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center"
            title="Create Community"
          >
            <Plus size={14} />
          </motion.button>
        </div>
        <p className="text-xs text-muted-foreground">
          Join a community to see relevant posts
        </p>
      </div>

      {/* "All" option */}
      <motion.button
        onClick={() => onSelect(null)}
        whileTap={tapShrink}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${
          selected === null
            ? "bg-primary text-primary-foreground shadow-sm"
            : "glass-card text-muted-foreground hover:text-foreground"
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
          <Users size={14} />
        </div>
        <div className="text-left flex-1">
          <span className="block">All Communities</span>
          <span className="text-[11px] opacity-70">Browse everything</span>
        </div>
      </motion.button>

      {/* Sub-communities list */}
      <div className="space-y-1 max-h-[60vh] overflow-y-auto scrollbar-none">
        {communities.map((sub, i) => (
          <SubCommunityItem
            key={sub.id}
            sub={sub}
            isActive={selected === sub.id}
            index={i}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Create community CTA */}
      <motion.button
        onClick={onCreateClick}
        whileTap={tapShrink}
        className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border-2 border-dashed border-muted-foreground/20 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
      >
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <Plus size={14} />
        </div>
        <span>Create Community</span>
      </motion.button>
    </motion.aside>
  );
};

const SubCommunityItem = ({
  sub,
  isActive,
  index,
  onSelect,
}: {
  sub: SubCommunity;
  isActive: boolean;
  index: number;
  onSelect: (id: string) => void;
}) => {
  const Icon = sub.icon;
  return (
    <motion.button
      onClick={() => onSelect(sub.id)}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      whileTap={tapShrink}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "hover:bg-muted/60 text-foreground"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isActive ? "bg-primary-foreground/20" : sub.color
        }`}
      >
        <Icon size={15} />
      </div>
      <div className="text-left flex-1 min-w-0">
        <span className="block truncate text-[13px]">{sub.shortName}</span>
        <span className="text-[11px] opacity-60">{formatMembers(sub.members)} members</span>
      </div>
      {sub.isCustom && (
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
          NEW
        </span>
      )}
      {!sub.isCustom && (
        <div className="flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] opacity-50">{sub.activeNow}</span>
        </div>
      )}
    </motion.button>
  );
};

export default SubCommunitySidebar;
