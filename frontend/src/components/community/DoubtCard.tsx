import { useState, useRef } from "react";
import { MessageCircle, ThumbsUp, ThumbsDown, Send, Sparkles, Share2, Bookmark } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { tapShrink } from "@/lib/motion";
import { getCommunityByName } from "@/lib/communities";

interface Reply {
  id: number;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

interface Doubt {
  id: number;
  author: string;
  avatar: string;
  category: string;
  title: string;
  body: string;
  time: string;
  likes: number;
  replies: Reply[];
}

interface DoubtCardProps {
  doubt: Doubt;
  index: number;
  onLike: (id: number) => void;
  onReplyLike: (doubtId: number, replyId: number) => void;
  onReply: (doubtId: number, text: string) => void;
}

const replyVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: "auto" as const,
    marginTop: 12,
    transition: { type: "spring" as const, stiffness: 300, damping: 28 },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const DoubtCard = ({ doubt, index, onLike, onReplyLike, onReply }: DoubtCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Swipe gesture
  const x = useMotionValue(0);
  const rotateZ = useTransform(x, [-200, 0, 200], [-5, 0, 5]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 0.85, 1, 0.85, 0.5]);
  const likeIndicator = useTransform(x, [0, 100], [0, 1]);
  const dislikeIndicator = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      // Swiped right = like
      if (!liked) {
        onLike(doubt.id);
        setLiked(true);
      }
    }
  };

  const handleLike = () => {
    if (!liked) {
      onLike(doubt.id);
      setLiked(true);
    }
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onReply(doubt.id, replyText.trim());
    setReplyText("");
  };

  const community = getCommunityByName(doubt.category);
  const CommunityIcon = community?.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      style={{ x, rotateZ, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
      className="glass-card-elevated rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y relative"
    >
      {/* Swipe indicators */}
      <motion.div
        style={{ opacity: likeIndicator }}
        className="absolute inset-y-0 right-0 w-20 bg-emerald-500/10 flex items-center justify-center rounded-r-2xl pointer-events-none z-10"
      >
        <ThumbsUp size={24} className="text-emerald-500" />
      </motion.div>
      <motion.div
        style={{ opacity: dislikeIndicator }}
        className="absolute inset-y-0 left-0 w-20 bg-destructive/10 flex items-center justify-center rounded-l-2xl pointer-events-none z-10"
      >
        <ThumbsDown size={24} className="text-destructive" />
      </motion.div>

      {/* Reddit-style vote bar + content */}
      <div className="flex">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 py-4 px-3 bg-muted/30 shrink-0">
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 0.8 }}
            className={`p-1 rounded transition-colors ${
              liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <motion.div animate={liked ? { scale: [1, 1.5, 1] } : {}} transition={{ duration: 0.3 }}>
              <ThumbsUp size={16} fill={liked ? "currentColor" : "none"} />
            </motion.div>
          </motion.button>
          <span className={`text-xs font-bold ${liked ? "text-primary" : "text-foreground"}`}>
            {doubt.likes}
          </span>
          <button className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
            <ThumbsDown size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          {/* Sub-community tag */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                community?.color || "bg-secondary text-secondary-foreground"
              }`}
            >
              {CommunityIcon && <CommunityIcon size={12} />}
              {community?.shortName || doubt.category}
            </motion.span>
            <span className="text-xs text-muted-foreground">
              Posted by <span className="font-medium text-foreground/80">{doubt.author}</span>
            </span>
            <span className="text-xs text-muted-foreground">· {doubt.time}</span>
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-semibold text-foreground mb-1 leading-snug">
            {doubt.title}
          </h3>
          {doubt.body && (
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
              {doubt.body}
            </p>
          )}

          {/* Action bar */}
          <div className="flex items-center gap-1 -ml-2">
            <motion.button
              onClick={() => setExpanded(!expanded)}
              whileTap={tapShrink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                expanded
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <MessageCircle size={14} fill={expanded ? "currentColor" : "none"} />
              {doubt.replies.length} {doubt.replies.length === 1 ? "Reply" : "Replies"}
            </motion.button>

            <motion.button
              whileTap={tapShrink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Share2 size={14} /> Share
            </motion.button>

            <motion.button
              onClick={() => setSaved(!saved)}
              whileTap={tapShrink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                saved
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save"}
            </motion.button>
          </div>

          {/* Replies */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                variants={replyVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden"
              >
                {doubt.replies.length > 0 && (
                  <div className="space-y-2 mb-3 pl-3 border-l-2 border-border">
                    {doubt.replies.map((reply, ri) => (
                      <motion.div
                        key={reply.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ri * 0.05 }}
                        className="pl-3 py-2"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={reply.avatar}
                            alt={reply.author}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-semibold text-foreground">{reply.author}</span>
                          <span className="text-[11px] text-muted-foreground">· {reply.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed ml-8">
                          {reply.text}
                        </p>
                        <div className="flex items-center gap-3 ml-8 mt-1">
                          <motion.button
                            onClick={() => onReplyLike(doubt.id, reply.id)}
                            whileTap={{ scale: 0.85 }}
                            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ThumbsUp size={11} /> {reply.likes}
                          </motion.button>
                          <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                            Reply
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {doubt.replies.length === 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-3">
                    <Sparkles size={13} /> No replies yet — be the first!
                  </div>
                )}

                {/* Reply input */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="text"
                    placeholder="What are your thoughts?"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmitReply()}
                    className="flex-1 px-3 py-2 rounded-lg bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  />
                  <motion.button
                    onClick={handleSubmitReply}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0"
                  >
                    <Send size={13} />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default DoubtCard;
