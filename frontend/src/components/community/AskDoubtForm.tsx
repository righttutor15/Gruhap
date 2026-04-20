import { motion } from "framer-motion";
import { X } from "lucide-react";
import { tapShrink } from "@/lib/motion";

interface AskDoubtFormProps {
  show: boolean;
  title: string;
  body: string;
  category: string;
  categories: string[];
  onTitleChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const formVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 26 },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.97,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const AskDoubtForm = ({
  title,
  body,
  category,
  categories,
  onTitleChange,
  onBodyChange,
  onCategoryChange,
  onSubmit,
  onClose,
}: AskDoubtFormProps) => {
  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mb-8"
    >
      <div className="glass-card-elevated rounded-2xl p-6 relative">
        <motion.button
          onClick={onClose}
          whileTap={tapShrink}
          className="absolute top-4 right-4 w-8 h-8 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </motion.button>

        <h3 className="font-display text-lg font-semibold text-foreground mb-1">Ask Your Doubt 💬</h3>
        <p className="text-sm text-muted-foreground mb-5">Get help from the community</p>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <motion.button
                key={c}
                onClick={() => onCategoryChange(c)}
                whileTap={tapShrink}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  category === c
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </motion.button>
            ))}
          </div>

          <input
            type="text"
            placeholder="What's your question? Be specific..."
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
          <textarea
            placeholder="Add more context or details (optional)"
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl glass-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-shadow"
          />
          <div className="flex gap-3">
            <motion.button
              onClick={onSubmit}
              whileHover={{ scale: 1.03 }}
              whileTap={tapShrink}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:shadow-lg transition-shadow"
            >
              Post Question 🚀
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
      </div>
    </motion.div>
  );
};

export default AskDoubtForm;
