import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { tapShrink } from "@/lib/motion";
import { availableIcons, availableColors, type SubCommunity } from "@/lib/communities";

interface CreateCommunityModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (community: SubCommunity) => void;
}

const CreateCommunityModal = ({ open, onClose, onCreate }: CreateCommunityModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  const handleCreate = () => {
    if (!name.trim()) return;
    const slug = name.trim().replace(/\s+/g, "");
    const newCommunity: SubCommunity = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      shortName: `g/${slug}`,
      icon: availableIcons[selectedIcon].icon,
      members: 1,
      description: description.trim() || `Community for ${name.trim()} discussions.`,
      color: availableColors[selectedColor],
      activeNow: 1,
      isCustom: true,
    };
    onCreate(newCommunity);
    setName("");
    setDescription("");
    setSelectedIcon(0);
    setSelectedColor(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card-elevated rounded-2xl p-6 w-full max-w-md relative"
          >
            <motion.button
              onClick={onClose}
              whileTap={tapShrink}
              className="absolute top-4 right-4 w-8 h-8 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </motion.button>

            <h3 className="font-display text-lg font-bold text-foreground mb-1">
              Create Community ✨
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Start a new g/ community for any subject or topic
            </p>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  Community Name
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-medium">g/</span>
                  <input
                    type="text"
                    placeholder="e.g. Hindi, Arts, Physics..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-lg bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  Description (optional)
                </label>
                <textarea
                  placeholder="What's this community about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-shadow"
                />
              </div>

              {/* Icon picker */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  Choose Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableIcons.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.name}
                        onClick={() => setSelectedIcon(i)}
                        whileTap={tapShrink}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          selectedIcon === i
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon size={16} />
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  Choose Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color, i) => {
                    // Extract the bg color part for the swatch
                    const bgClass = color.split(" ")[0];
                    return (
                      <motion.button
                        key={i}
                        onClick={() => setSelectedColor(i)}
                        whileTap={tapShrink}
                        className={`w-8 h-8 rounded-full ${bgClass} transition-all ${
                          selectedColor === i
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                            : ""
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              {name.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${availableColors[selectedColor]}`}>
                    {(() => {
                      const Icon = availableIcons[selectedIcon].icon;
                      return <Icon size={18} />;
                    })()}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground block">
                      g/{name.trim().replace(/\s+/g, "")}
                    </span>
                    <span className="text-xs text-muted-foreground">1 member · Just created</span>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <motion.button
                  onClick={handleCreate}
                  disabled={!name.trim()}
                  whileHover={{ scale: name.trim() ? 1.03 : 1 }}
                  whileTap={name.trim() ? tapShrink : undefined}
                  className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Plus size={14} /> Create
                </motion.button>
                <motion.button
                  onClick={onClose}
                  whileTap={tapShrink}
                  className="px-6 py-2.5 rounded-full glass-card text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCommunityModal;
