import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommunityHeader from "@/components/community/CommunityHeader";
import AskDoubtForm from "@/components/community/AskDoubtForm";
import DoubtCard from "@/components/community/DoubtCard";
import SubCommunitySidebar from "@/components/community/SubCommunitySidebar";
import TrendingSidebar from "@/components/community/TrendingSidebar";
import CreateCommunityModal from "@/components/community/CreateCommunityModal";
import { staggerContainer } from "@/lib/motion";
import { getCommunityById, subCommunities, addCommunity, type SubCommunity } from "@/lib/communities";

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

const initialDoubts: Doubt[] = [
  {
    id: 1,
    author: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    category: "NEET Biology",
    title: "Can someone explain the difference between mitosis and meiosis in simple terms?",
    body: "I keep getting confused between the two. Especially the stages and what happens in each phase. Any mnemonics or tricks would help!",
    time: "2 hours ago",
    likes: 24,
    replies: [
      { id: 1, author: "Rahul Verma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", text: "Think of it this way: Mitosis = Making Identical Two (2 identical cells), Meiosis = Making Eggs/sperm (4 unique cells). Mitosis is for growth, Meiosis is for reproduction!", time: "1 hour ago", likes: 15 },
      { id: 2, author: "Ananya Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", text: "Also remember: Meiosis has crossing over (exchange of genetic material) which is why offspring are genetically unique. Mitosis doesn't have this.", time: "45 min ago", likes: 8 },
    ],
  },
  {
    id: 2,
    author: "Arjun Reddy",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    category: "JEE Physics",
    title: "How to solve projectile motion problems faster in JEE?",
    body: "I understand the concepts but I take too long solving these in exams. What shortcuts or approaches do toppers use?",
    time: "5 hours ago",
    likes: 31,
    replies: [
      { id: 1, author: "Kavya Singh", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face", text: "Break every projectile problem into horizontal and vertical components immediately. Time of flight depends only on vertical motion. This saves so much time!", time: "3 hours ago", likes: 12 },
    ],
  },
  {
    id: 3,
    author: "Sneha Gupta",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    category: "Mathematics",
    title: "Best way to memorize the periodic table trends?",
    body: "Electronegativity, ionization energy, atomic radius... so many trends to remember. How do you all keep them straight?",
    time: "1 day ago",
    likes: 42,
    replies: [],
  },
  {
    id: 4,
    author: "Vikram Joshi",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    category: "K12 Math",
    title: "Struggling with trigonometric identities - any tips?",
    body: "I can never remember which identity to use when. Is there a systematic approach to solving trig problems?",
    time: "3 days ago",
    likes: 18,
    replies: [
      { id: 1, author: "Meera Das", avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=face", text: "Start with the basic ones: sin²+cos²=1, then derive everything else. Practice converting everything to sin and cos first - it simplifies 90% of problems.", time: "2 days ago", likes: 9 },
    ],
  },
  {
    id: 5,
    author: "Riya Menon",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    category: "Study Tips",
    title: "Pomodoro technique actually works — here's my modified version",
    body: "I do 40 min study + 10 min break instead of 25/5. For NEET subjects, longer focus blocks help me stay in flow. Anyone else modify their Pomodoro?",
    time: "6 hours ago",
    likes: 56,
    replies: [],
  },
];

const Community = () => {
  const [doubts, setDoubts] = useState<Doubt[]>(initialDoubts);
  const [communities, setCommunities] = useState<SubCommunity[]>([...subCommunities]);
  const [sortBy, setSortBy] = useState("Trending");
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAsk, setShowAsk] = useState(false);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("NEET Biology");
  const feedRef = useRef<HTMLDivElement>(null);
  const newPostRef = useRef<HTMLDivElement>(null);

  const handleReply = (doubtId: number, text: string) => {
    setDoubts((prev) =>
      prev.map((d) =>
        d.id === doubtId
          ? {
              ...d,
              replies: [
                ...d.replies,
                { id: d.replies.length + 1, author: "You", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face", text, time: "Just now", likes: 0 },
              ],
            }
          : d
      )
    );
  };

  const handleLike = (doubtId: number) => {
    setDoubts((prev) =>
      prev.map((d) => (d.id === doubtId ? { ...d, likes: d.likes + 1 } : d))
    );
  };

  const handleReplyLike = (doubtId: number, replyId: number) => {
    setDoubts((prev) =>
      prev.map((d) =>
        d.id === doubtId
          ? { ...d, replies: d.replies.map((r) => (r.id === replyId ? { ...r, likes: r.likes + 1 } : r)) }
          : d
      )
    );
  };

  const handleAsk = () => {
    if (!newTitle.trim()) return;
    const newDoubt: Doubt = {
      id: Date.now(),
      author: "You",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
      category: newCategory,
      title: newTitle,
      body: newBody,
      time: "Just now",
      likes: 0,
      replies: [],
    };
    setDoubts([newDoubt, ...doubts]);
    setNewTitle("");
    setNewBody("");
    setShowAsk(false);
    setTimeout(() => {
      newPostRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleCreateCommunity = (community: SubCommunity) => {
    const updated = addCommunity(community);
    setCommunities([...updated]);
    setSelectedCommunity(community.id);
  };

  const getFilterCategory = () => {
    if (!selectedCommunity) return null;
    const community = getCommunityById(selectedCommunity);
    return community?.name || null;
  };

  const filterCat = getFilterCategory();

  const filtered = doubts
    .filter((d) => {
      const matchCat = !filterCat || d.category === filterCat;
      const matchSearch =
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.body.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => (sortBy === "Trending" ? b.likes - a.likes : b.id - a.id));

  const askCategories = communities.map((c) => c.name);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <CommunityHeader
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onAskClick={() => setShowAsk(!showAsk)}
            totalQuestions={doubts.length}
          />

          {/* 3-column layout */}
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Left sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <SubCommunitySidebar
                  selected={selectedCommunity}
                  onSelect={setSelectedCommunity}
                  onCreateClick={() => setShowCreateCommunity(true)}
                  communities={communities}
                />
              </div>
            </div>

            {/* Mobile community pills */}
            <div className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none -mx-4 px-4">
                <motion.button
                  onClick={() => setSelectedCommunity(null)}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    selectedCommunity === null
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  All
                </motion.button>
                {communities.map((sub) => {
                  const Icon = sub.icon;
                  return (
                    <motion.button
                      key={sub.id}
                      onClick={() => setSelectedCommunity(sub.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                        selectedCommunity === sub.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon size={12} /> {sub.shortName}
                    </motion.button>
                  );
                })}
                <motion.button
                  onClick={() => setShowCreateCommunity(true)}
                  whileTap={{ scale: 0.95 }}
                  className="px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 border-2 border-dashed border-muted-foreground/30 text-muted-foreground"
                >
                  + New
                </motion.button>
              </div>
            </div>

            {/* Main feed */}
            <div className="flex-1 min-w-0" ref={feedRef}>
              <AnimatePresence>
                {showAsk && (
                  <AskDoubtForm
                    show={showAsk}
                    title={newTitle}
                    body={newBody}
                    category={newCategory}
                    categories={askCategories}
                    onTitleChange={setNewTitle}
                    onBodyChange={setNewBody}
                    onCategoryChange={setNewCategory}
                    onSubmit={handleAsk}
                    onClose={() => setShowAsk(false)}
                  />
                )}
              </AnimatePresence>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                <AnimatePresence>
                  {filtered.map((doubt, i) => (
                    <div key={doubt.id} ref={i === 0 ? newPostRef : undefined}>
                      <DoubtCard
                        doubt={doubt}
                        index={i}
                        onLike={handleLike}
                        onReplyLike={handleReplyLike}
                        onReply={handleReply}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <Sparkles size={36} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">No posts found. Be the first!</p>
                </motion.div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <TrendingSidebar />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Create Community Modal */}
      <CreateCommunityModal
        open={showCreateCommunity}
        onClose={() => setShowCreateCommunity(false)}
        onCreate={handleCreateCommunity}
      />
    </div>
  );
};

export default Community;
