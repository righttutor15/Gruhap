import { ArrowRight, MessageCircle, ThumbsUp, Users, Flame, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getCommunityById } from "@/lib/communities";

// Pull fresh references by id (resilient if list ordering changes)
const cUiUx = getCommunityById("ui-ux")!;
const cMarketing = getCommunityById("digital-marketing")!;
const cCommunication = getCommunityById("communication")!;
const cPersonality = getCommunityById("personality-dev")!;
const cCoding = getCommunityById("coding")!;
const cJeePhysics = getCommunityById("jee-physics")!;
const cNeetBio = getCommunityById("neet-bio")!;

const previewDoubts = [
  {
    id: 1,
    author: "Ananya S.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    category: cUiUx,
    title: "Roast my portfolio — first 3 case studies, brutal feedback welcome 🙏",
    likes: 52,
    replies: 18,
    time: "2h",
    isHot: true,
  },
  {
    id: 2,
    author: "Rohan K.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    category: cCommunication,
    title: "How do you stop saying 'umm' and 'like' in interviews? It's killing me.",
    likes: 47,
    replies: 23,
    time: "4h",
    isHot: true,
  },
  {
    id: 3,
    author: "Meera P.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    category: cMarketing,
    title: "First Instagram ad campaign — what budget and targeting should I start with?",
    likes: 31,
    replies: 12,
    time: "6h",
    isHot: false,
  },
  {
    id: 4,
    author: "Arjun R.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    category: cJeePhysics,
    title: "Why does a charged particle in a magnetic field move in a circle?",
    likes: 28,
    replies: 9,
    time: "1d",
    isHot: false,
  },
];

const featuredCommunities = [cUiUx, cCommunication, cCoding, cPersonality, cMarketing, cNeetBio];

const CommunitySection = () => {
  return (
    <section className="py-20 hero-gradient relative overflow-hidden" id="community">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Where students <span className="text-gradient">solve doubts together</span>
          </h2>
          <p className="text-muted-foreground">
            Real questions. Real answers. From students prepping for the same exams as you.
          </p>
        </motion.div>

        {/* Live preview grid */}
        <div className="grid lg:grid-cols-3 gap-5 mb-8">
          {/* LEFT — Trending Discussions (spans 2 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 glass-card-elevated rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-destructive" />
                <h3 className="font-display font-bold text-foreground">Trending Discussions</h3>
              </div>
              <span className="text-[11px] text-muted-foreground">Updated live</span>
            </div>

            <div className="space-y-3">
              {previewDoubts.map((doubt, i) => {
                const Icon = doubt.category.icon;
                return (
                  <motion.div
                    key={doubt.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    whileHover={{ y: -2 }}
                    className="flex gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    {/* Vote count */}
                    <div className="flex flex-col items-center justify-center bg-muted/40 rounded-lg px-2.5 py-2 shrink-0 min-w-[44px]">
                      <ThumbsUp size={12} className="text-muted-foreground" />
                      <span className="text-sm font-bold text-foreground tabular-nums">{doubt.likes}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${doubt.category.color}`}>
                          <Icon size={10} />
                          {doubt.category.shortName}
                        </span>
                        {doubt.isHot && (
                          <span className="text-[10px] font-bold text-destructive">🔥 Hot</span>
                        )}
                        <span className="text-[11px] text-muted-foreground">
                          {doubt.author} · {doubt.time}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {doubt.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageCircle size={11} /> {doubt.replies} replies
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} /> {doubt.likes * 8}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Link
              to="/community"
              className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
            >
              See all discussions <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* RIGHT column — Communities + Live ticker */}
          <div className="space-y-5">
            {/* Featured communities */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass-card-elevated rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users size={16} className="text-primary" />
                <h3 className="font-display font-bold text-foreground">Popular Hubs</h3>
              </div>

              <div className="space-y-2">
                {featuredCommunities.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${c.color}`}>
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-foreground truncate">{c.name}</div>
                        <div className="text-[11px] text-muted-foreground line-clamp-1">{c.description}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card-elevated rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left"
        >
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
              Ready to join the movement?
            </h3>
            <p className="text-sm text-muted-foreground">
              Ask your first doubt. Get answers in minutes. It's free.
            </p>
          </div>
          <Link
            to="/community"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shrink-0 shadow-lg"
          >
            Join Our Community <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
