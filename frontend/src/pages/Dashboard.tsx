import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUp,
  LogOut,
  Settings,
  User,
  Mic,
  MoreHorizontal,
  Sparkles,
  ChevronLeft,
  X,
  MessageSquare,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sendMessageToGroq, generateChatTitle } from '@/services/groqService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Types from original logic
interface Message {
  text: string;
  sender: 'user' | 'ai';
}

interface ChatHistoryItem {
  id: string;
  name: string;
  messages: Message[];
  timestamp: number;
}

// Extracted ChatInput component for reuse
const ChatInput = ({ message, setMessage, handleSend, isAiTyping, showGlow }: any) => {
  return (
    <motion.form
      onSubmit={handleSend}
      className="relative group w-full"
    >
      {showGlow && (
        <motion.div
          animate={{
            scale: [1, 1.03, 1],
            opacity: [0.7, 1, 0.7],
            background: [
              "linear-gradient(to right, hsl(var(--brand-blue)/0.3), hsl(var(--cta-orange)/0.2), hsl(228 90% 70% / 0.3))",
              "linear-gradient(to right, hsl(var(--cta-orange)/0.3), hsl(var(--brand-blue)/0.2), hsl(var(--cta-orange)/0.3))",
              "linear-gradient(to right, hsl(var(--brand-blue)/0.3), hsl(var(--cta-orange)/0.2), hsl(228 90% 70% / 0.3))"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-2 rounded-full blur-2xl group-focus-within:opacity-100 transition-opacity"
        />
      )}
      <div className={`relative bg-white/95 backdrop-blur-xl rounded-full flex items-center gap-1 p-2 pl-6 shadow-2xl border ${showGlow ? 'border-white/90 ring-1 ring-brand-blue/10' : 'border-border/40'}`}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Chat with Gruhap"
          className="flex-1 bg-transparent outline-none text-base py-3 text-foreground placeholder:text-foreground/40 min-w-0"
        />
        <button type="button" className="p-2.5 rounded-full bg-white/70 text-foreground/70 hover:text-foreground transition-all flex-shrink-0">
          <Plus size={18} />
        </button>
        <button type="button" className="p-2.5 rounded-full bg-white/70 text-foreground/70 hover:text-foreground transition-all flex-shrink-0">
          <Mic size={18} />
        </button>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          type="submit"
          disabled={!message.trim() || isAiTyping}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-cta to-amber-500 text-cta-foreground flex items-center justify-center shadow-lg disabled:opacity-30 flex-shrink-0"
        >
          <ArrowUp size={18} />
        </motion.button>
      </div>
      {showGlow && (
        <p className="mt-6 text-center text-xs text-foreground/40 font-medium">
          Gruhap can make mistakes. Please double-check important answers.
        </p>
      )}
      {!showGlow && (
        <p className="mt-4 text-center text-[10px] text-foreground/40">
          Gruhap can make mistakes. Please double-check important answers.
        </p>
      )}
    </motion.form>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [currentView, setCurrentView] = useState<'chat' | 'profile' | 'settings'>('chat');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filtered chats for search
  const filteredChats = chatHistory.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close search on Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gruhap_chats');
    if (saved) {
      setChatHistory(JSON.parse(saved));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "good morning";
    if (h < 17) return "good afternoon";
    if (h < 21) return "good evening";
    return "good night";
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isAiTyping) return;

    const userText = message;
    setMessage("");
    const isFirstMessage = messages.length === 0;

    const userMessage: Message = { text: userText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    setIsAiTyping(true);

    let currentChatId = activeChatId;

    if (isFirstMessage) {
      const newChatId = `chat-${Date.now()}`;
      const tempTitle = userText.slice(0, 30) + (userText.length > 30 ? '...' : '');
      const newChat: ChatHistoryItem = { 
        id: newChatId, 
        name: tempTitle, 
        messages: [userMessage],
        timestamp: Date.now()
      };

      setChatHistory(prev => [newChat, ...prev]);
      setActiveChatId(newChatId);
      currentChatId = newChatId;

      localStorage.setItem('gruhap_chats', JSON.stringify([newChat, ...chatHistory]));

      generateChatTitle(userText).then(title => {
        setChatHistory(prev => prev.map(chat => chat.id === newChatId ? { ...chat, name: title } : chat));
        const updatedHistory = JSON.parse(localStorage.getItem('gruhap_chats') || '[]');
        localStorage.setItem('gruhap_chats', JSON.stringify(updatedHistory.map((c: any) => c.id === newChatId ? { ...c, name: title } : c)));
      });
    }

    try {
      const conversationHistory = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })) as any;
      conversationHistory.push({ role: 'user', content: userText });

      const aiText = await sendMessageToGroq(userText, conversationHistory);
      const aiMessage: Message = { text: aiText, sender: 'ai' };

      setMessages(prev => {
        const updated = [...prev, aiMessage];
        if (currentChatId) {
          // Update both state and localStorage
          setChatHistory(prevHistory => {
            const updatedHistory = prevHistory.map(chat => 
              chat.id === currentChatId ? { ...chat, messages: updated } : chat
            );
            localStorage.setItem('gruhap_chats', JSON.stringify(updatedHistory));
            return updatedHistory;
          });
        }
        return updated;
      });
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAiTyping(false);
    }
  };

  const loadChat = (id: string) => {
    const chat = chatHistory.find(c => c.id === id);
    if (chat) {
      setMessages(chat.messages);
      setActiveChatId(id);
      setCurrentView('chat');
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setCurrentView('chat');
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = chatHistory.filter(c => c.id !== id);
    setChatHistory(updated);
    localStorage.setItem('gruhap_chats', JSON.stringify(updated));
    if (activeChatId === id) {
      handleNewChat();
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "Recent";
    return new Intl.DateTimeFormat('en-GB', { 
      day: '2-digit', 
      month: 'short' 
    }).format(new Date(timestamp));
  };

  return (
    <div className="h-screen w-full flex bg-background text-foreground overflow-hidden">
      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSearchOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-muted/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center px-4 py-4 border-b border-border/30">
                <Search className="text-muted-foreground mr-3" size={20} />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats and projects..." 
                  className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/60"
                />
                <button onClick={() => setSearchOpen(false)} className="p-1 rounded-md hover:bg-accent text-muted-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto py-2">
                {filteredChats.length > 0 ? (
                  <div className="px-2 space-y-1">
                    {filteredChats.map((chat) => (
                      <button 
                        key={chat.id} 
                        onClick={() => { loadChat(chat.id); setSearchOpen(false); }}
                        className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-accent group transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                            <MessageSquare size={16} className="text-muted-foreground group-hover:text-cta transition-colors" />
                          </div>
                          <span className="text-sm font-medium truncate text-foreground/80 group-hover:text-foreground">
                            {chat.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
                          <span className="group-hover:text-muted-foreground">{formatDate(chat.timestamp)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <p className="text-sm">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
              
              <div className="px-4 py-3 bg-accent/30 border-t border-border/30 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                <span>Recent Searches</span>
                <span className="opacity-50">Esc to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed lg:relative z-40 w-[260px] h-full flex flex-col bg-muted/40 border-r border-border flex-shrink-0"
          >
            {/* Sidebar content remains the same */}
            <div className="flex items-center justify-between px-4 h-14 flex-shrink-0">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-cta flex items-center justify-center shadow-sm">
                  <span className="text-cta-foreground font-display font-bold">G</span>
                </div>
                <span className="font-display font-bold text-lg tracking-tight">Gruhap</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors">
                <PanelLeftClose size={18} />
              </button>
            </div>

            <div className="px-3 pt-2 space-y-1 flex-shrink-0">
              <button onClick={handleNewChat} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent text-sm font-medium transition-colors border border-transparent hover:border-border">
                <Plus size={16} className="text-muted-foreground" /> New chat
              </button>
              <button onClick={() => setSearchOpen(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent text-sm font-medium transition-colors">
                <Search size={16} className="text-muted-foreground" /> Search
              </button>
            </div>

            <div className="flex-1 px-3 mt-4 overflow-y-auto scrollbar-thin">
              <div className="text-xs font-medium text-muted-foreground px-3 mb-1 uppercase tracking-wider">Recent</div>
              <ul className="space-y-0.5">
                {chatHistory.map((chat) => (
                  <li key={chat.id}>
                    <button onClick={() => loadChat(chat.id)} className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeChatId === chat.id ? 'bg-accent text-foreground font-medium' : 'text-foreground/80 hover:bg-accent/50 hover:text-foreground'}`}>
                      <span className="truncate">{chat.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button onClick={(e) => e.stopPropagation()} className="p-1 rounded hover:bg-muted-foreground/10 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={14} className="text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => handleDeleteChat(e, chat.id)} className="text-destructive">Delete Chat</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 border-t border-border flex-shrink-0">
              <button onClick={() => setCurrentView('profile')} className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${currentView === 'profile' ? 'bg-accent' : 'hover:bg-accent'}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cta to-amber-400 flex items-center justify-center text-cta-foreground font-bold text-sm">A</div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium truncate">Anirban</div>
                  <div className="text-[11px] text-muted-foreground truncate">Free plan</div>
                </div>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
        <header className="h-14 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 bg-background/70 backdrop-blur-md border-b border-border/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-md hover:bg-accent transition-colors"><PanelLeftOpen size={18} /></button>
            )}
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cta flex items-center justify-center"><span className="text-cta-foreground font-display font-bold text-sm">G</span></div>
              <span className="font-display font-bold">Gruhap</span>
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-full bg-gradient-to-br from-cta to-amber-400 flex items-center justify-center text-cta-foreground font-bold text-sm ring-2 ring-background hover:ring-cta/40 transition-all">A</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCurrentView('profile')}><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentView('settings')}><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/login"><LogOut className="mr-2 h-4 w-4" /> Sign out</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 relative overflow-hidden flex flex-col items-center">
          {/* Background effects - only show when NO messages */}
          {messages.length === 0 && currentView === 'chat' && (
            <>
              <div className="pointer-events-none absolute inset-0 opacity-[0.22]" style={{ backgroundImage: "linear-gradient(hsl(var(--brand-blue) / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--brand-blue) / 0.08) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2 w-[720px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--brand-blue)/0.10),transparent_72%)] blur-[100px]" />
                <div className="absolute left-1/2 top-[58%] -translate-x-1/2 w-[180px] h-[100px] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--brand-blue-light)/0.08),transparent_72%)] blur-[60px]" />
              </div>
            </>
          )}

          {currentView === 'chat' && (
            <div className="w-full h-full flex flex-col items-center relative">
              {/* Messages Area */}
              <div className="flex-1 w-full overflow-y-auto scrollbar-none px-4 md:px-6">
                <div className="max-w-3xl mx-auto w-full pt-10 pb-40">
                  {messages.length === 0 ? (
                    <div className="h-[75vh] flex flex-col items-center justify-center text-center">
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cta via-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-cta/20 mb-6">
                          <Sparkles className="text-white" size={24} />
                        </motion.div>
                        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-2">Hey, <span className="text-gradient">{greeting}!</span></h1>
                        <p className="text-base md:text-lg text-muted-foreground mb-10">How can I help you today?</p>

                        {/* Centered Input for New Chat */}
                        <div className="w-full max-w-2xl px-4">
                          <ChatInput
                            message={message}
                            setMessage={setMessage}
                            handleSend={handleSend}
                            isAiTyping={isAiTyping}
                            showGlow={true}
                          />
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-[#333] text-white' : 'bg-muted/50 border border-border/50 text-foreground'}`}>
                            {msg.sender === 'user' ? (
                              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            ) : (
                              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/5 prose-pre:p-4 prose-pre:rounded-xl">
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                                  {msg.text}
                                </ReactMarkdown>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {isAiTyping && (
                        <div className="flex justify-start">
                          <div className="bg-muted/50 border border-border/50 px-5 py-3.5 rounded-2xl flex items-center gap-1.5">
                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Input Area - only show when there ARE messages */}
              {messages.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pt-12">
                  <div className="max-w-2xl mx-auto">
                    <ChatInput
                      message={message}
                      setMessage={setMessage}
                      handleSend={handleSend}
                      isAiTyping={isAiTyping}
                      showGlow={false}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {(currentView === 'profile' || currentView === 'settings') && (
            <div className="flex-1 w-full overflow-y-auto p-6 md:p-10">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-border/50">
                <button onClick={() => setCurrentView('chat')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"><ChevronLeft size={16} /> Back to chat</button>
                <h2 className="text-3xl font-bold mb-2 capitalize">{currentView}</h2>
                <p className="text-muted-foreground mb-8">Manage your {currentView} and preferences below.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                      <div className="w-10 h-10 rounded-xl bg-cta/10 flex items-center justify-center mb-4"><Settings size={20} className="text-cta" /></div>
                      <h4 className="font-bold mb-2">Option {i}</h4>
                      <p className="text-sm text-muted-foreground">Detailed description of this {currentView} option.</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;



