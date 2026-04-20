import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typed from "typed.js";
import './Dashboard.css';
import wellnessImg from '@/assets/wellness.png';
import fitnessImg from '@/assets/fitness.png';
import nutritionImg from '@/assets/nutrition-plan.png';

// --- Demo Components ---

const BuyTokenDemo = () => (
  <div className="demo-view p-8">
    <h2 className="text-2xl font-bold mb-6">Upgrade Your Plan</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass-card-elevated p-6 rounded-2xl border-2 border-transparent hover:border-cta transition-all">
        <h3 className="text-xl font-bold mb-2">Free</h3>
        <p className="text-4xl font-bold mb-4">₹0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
        <ul className="space-y-2 text-sm text-muted-foreground mb-6">
          <li>• 10 AI messages per day</li>
          <li>• Basic study materials</li>
          <li>• Community access</li>
        </ul>
        <button className="w-full py-2 bg-secondary rounded-lg font-semibold cursor-not-allowed">Current Plan</button>
      </div>
      <div className="glass-card-elevated p-6 rounded-2xl border-2 border-cta relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cta text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
        <h3 className="text-xl font-bold mb-2">Pro</h3>
        <p className="text-4xl font-bold mb-4">₹499<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
        <ul className="space-y-2 text-sm text-muted-foreground mb-6">
          <li>• Unlimited AI messages</li>
          <li>• Advanced Mock Tests</li>
          <li>• Priority Support</li>
          <li>• Personal Mentor</li>
        </ul>
        <button className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90">Upgrade Now</button>
      </div>
      <div className="glass-card-elevated p-6 rounded-2xl border-2 border-transparent hover:border-cta transition-all">
        <h3 className="text-xl font-bold mb-2">Enterprise</h3>
        <p className="text-4xl font-bold mb-4">Custom</p>
        <ul className="space-y-2 text-sm text-muted-foreground mb-6">
          <li>• Institutional access</li>
          <li>• Custom content</li>
          <li>• Dedicated support</li>
          <li>• Analytics for schools</li>
        </ul>
        <button className="w-full py-2 bg-secondary rounded-lg font-semibold">Contact Us</button>
      </div>
    </div>
  </div>
);

const BalanceDemo = () => (
  <div className="demo-view p-8">
    <h2 className="text-2xl font-bold mb-6">Wallet & Usage</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="glass-card-elevated p-8 rounded-2xl">
        <p className="text-muted-foreground text-sm mb-1 uppercase tracking-wider font-bold">Current Plan</p>
        <h3 className="text-3xl font-bold text-cta mb-6">Free Plan</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Daily AI Tokens</span>
              <span className="font-bold">4 / 10 used</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-cta" style={{ width: '40%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Study Hours</span>
              <span className="font-bold">12 / 50 hrs</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: '24%' }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="glass-card-elevated p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <span className="text-sm">Total Questions Solved</span>
            <span className="font-bold">142</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <span className="text-sm">Last Practice Test</span>
            <span className="font-bold text-green-500">82% Score</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <span className="text-sm">Tokens Reset In</span>
            <span className="font-bold">08h 22m</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SettingsDemo = ({ user }: { user: any }) => (
  <div className="demo-view p-8 max-w-2xl">
    <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
    <div className="glass-card-elevated p-8 rounded-2xl space-y-8">
      <div className="flex items-center gap-6">
        <div className="relative">
          <img src={user.avatar} alt="User" className="w-20 h-20 rounded-full border-4 border-secondary" />
          <div className="absolute bottom-0 right-0 p-1 bg-primary rounded-full text-white cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold">{user.name}</h3>
          <p className="text-muted-foreground">{user.plan} Subscription</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 pt-4 border-t border-secondary">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Email Notifications</p>
            <p className="text-xs text-muted-foreground">Receive weekly progress reports</p>
          </div>
          <div className="w-12 h-6 bg-cta rounded-full relative p-1 cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Adjust interface appearance</p>
          </div>
          <div className="w-12 h-6 bg-secondary rounded-full relative p-1 cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute left-1"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Focus Mode</p>
            <p className="text-xs text-muted-foreground">Reduce distractions during chat</p>
          </div>
          <div className="w-12 h-6 bg-cta rounded-full relative p-1 cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HelpDemo = () => (
  <div className="demo-view p-8">
    <h2 className="text-2xl font-bold mb-6">Help & Support</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { q: "How do AI tokens work?", a: "Each question you ask uses 1 token. Free users get 10 tokens per day which reset at midnight." },
        { q: "Can I use Gruhap for NEET?", a: "Absolutely! Choose NEET Prep from the category menu to get specialist medical entrance support." },
        { q: "Is there a mobile app?", a: "We are currently optimized for mobile browsers, with a dedicated app launching in Late 2026." },
        { q: "How to reset my password?", a: "Go to Settings > Security (Beta) to send a password reset link to your registered email." }
      ].map((item, i) => (
        <div key={i} className="glass-card-elevated p-6 rounded-2xl">
          <p className="font-bold mb-2">Q: {item.q}</p>
          <p className="text-sm text-muted-foreground">A: {item.a}</p>
        </div>
      ))}
      <div className="md:col-span-2 glass-card-elevated p-8 rounded-2xl text-center">
        <h3 className="text-lg font-bold mb-2">Still need help?</h3>
        <p className="text-muted-foreground mb-6">Our support team is available Mon-Fri, 9am - 6pm IST.</p>
        <button className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90">Contact Support</button>
      </div>
    </div>
  </div>
);

const PlaceholderDemo = ({ title }: { title: string }) => (
  <div className="demo-view p-8 flex flex-col items-center justify-center h-full text-center">
    <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
    </div>
    <h2 className="text-4xl font-bold mb-4">{title} Demo</h2>
    <p className="text-muted-foreground max-w-md">This feature is currently under development. Stay tuned for updates in the next release!</p>
  </div>
);

// --- Dashboard Component ---
const Dashboard = () => {
  // Demo mode: No real auth context for now
  const isAuthenticated = true;

  const [activeSection, setActiveSection] = useState('chats');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCategoryOpen, setIsSidebarCategoryOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [messages, setMessages] = useState<{ text: string, sender: string }[]>([]);
  const [isInputCategoryOpen, setIsInputCategoryOpen] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ id: string, name: string, messages: any[] }[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatCounter, setChatCounter] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [currentView, setCurrentView] = useState('chat');
  const navigate = useNavigate();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const userInfo = {
    name: 'Anirban Sarkar',
    plan: 'Free',
    avatar: 'https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369991.png'
  };

  const topRightAvatar = "https://img.freepik.com/premium-photo/web-developer-digital-avatar-generative-ai_934475-9048.jpg";

  const mainNavItems = [
    {
      id: 'new-chat',
      label: 'New chat',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )
    },
    {
      id: 'search',
      label: 'Search chats',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      )
    },
    {
      id: 'category',
      label: 'Category',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
  ];

  const sidebarCategories = ['JEE Prep', 'NEET Prep', 'K12 Subjects'];
  const categories = ['JEE Prep', 'NEET Prep', 'K12 Subjects'];

  const quickActions = [
    { text: "Physics", iconType: "physics" },
    { text: "Chemistry", iconType: "chemistry" },
    { text: "Mathematics", iconType: "mathematics" },
    { text: "Biology", iconType: "biology" },
    { text: "Mock Tests", iconType: "mockTests" },
    { text: "Revision", iconType: "revision" },
    { text: "PYQs", iconType: "pyqs" },
    { text: "Formulas", iconType: "formulas" },
  ];

  const scrollingActions = [...quickActions, ...quickActions, ...quickActions];

  const toggleCategoryDropdown = () => setIsCategoryOpen(!isCategoryOpen);
  const toggleSidebarCategory = () => setIsSidebarCategoryOpen(!isSidebarCategoryOpen);
  const toggleAvatarMenu = () => setIsAvatarMenuOpen(!isAvatarMenuOpen);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleInputCategoryDropdown = () => setIsInputCategoryOpen(!isInputCategoryOpen);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const handleInputCategorySelect = (category: string) => {
    console.log('Selected category:', category);
    setIsInputCategoryOpen(false);
  };

  const switchView = (view: string) => {
    setCurrentView(view);
    setIsAvatarMenuOpen(false);
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  const toggleChatMenu = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === chatId ? null : chatId);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChatId === chatId) {
      setMessages([]);
      setHasSubmitted(false);
      setActiveChatId(null);
    }
    setOpenMenuId(null);
  };

  const handleStartRename = (e: React.MouseEvent, chat: any) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditingName(chat.name);
    setOpenMenuId(null);
  };

  const handleRenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  const handleRenameSubmit = (e: React.FormEvent | React.FocusEvent, chatId: string) => {
    e.preventDefault();
    if (editingName.trim()) {
      setChatHistory(prev => prev.map(chat =>
        chat.id === chatId ? { ...chat, name: editingName.trim() } : chat
      ));
    }
    setEditingChatId(null);
    setEditingName('');
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRenameSubmit(e, chatId);
    } else if (e.key === 'Escape') {
      setEditingChatId(null);
      setEditingName('');
    }
  };

  const saveCurrentChat = () => {
    if (messages.length > 0) {
      const existingChatIndex = chatHistory.findIndex(chat => chat.id === activeChatId);

      if (existingChatIndex !== -1) {
        const updatedHistory = [...chatHistory];
        updatedHistory[existingChatIndex] = {
          ...updatedHistory[existingChatIndex],
          messages: [...messages]
        };
        setChatHistory(updatedHistory);
      } else {
        const newChat = {
          id: `chat-${Date.now()}`,
          name: `Chat History ${chatCounter}`,
          messages: [...messages]
        };

        let updatedHistory = [newChat, ...chatHistory];
        if (updatedHistory.length > 10) {
          updatedHistory = updatedHistory.slice(0, 10);
        }

        setChatHistory(updatedHistory);
        setChatCounter(prev => prev + 1);
        setActiveChatId(newChat.id);
      }
    }
  };

  const handleNewChat = () => {
    saveCurrentChat();

    if (typedInstanceRef.current) {
      typedInstanceRef.current.destroy();
      typedInstanceRef.current = null;
    }

    setMessages([]);
    setInputValue('');
    setHasSubmitted(false);
    setIsAiTyping(false);
    setSelectedCategory('Category');
    setActiveSection('chats');
    setActiveChatId(null);
    setOpenMenuId(null);
    setEditingChatId(null);

    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  const loadChat = (chatId: string) => {
    if (editingChatId) return;
    saveCurrentChat();

    const chatToLoad = chatHistory.find(chat => chat.id === chatId);
    if (chatToLoad) {
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
        typedInstanceRef.current = null;
      }

      setMessages([...chatToLoad.messages]);
      setHasSubmitted(true);
      setActiveChatId(chatId);
      setInputValue('');
      setIsAiTyping(false);
      setOpenMenuId(null);

      if (isMobile) {
        setIsMobileSidebarOpen(false);
      }
    }
  };

  const handleNavItemClick = (itemId: string) => {
    if (itemId === 'new-chat') {
      // New Chat is currently non-interactive for the demo as requested
      console.log('New Chat clicked - currently non-interactive');
      return;
    }
    if (itemId === 'category') {
      switchView('category-view');
      return;
    }
    if (itemId === 'search') {
      switchView('search-view');
      return;
    }
    setActiveSection(itemId);
  };

  const generateAiResponse = (userMessage: string) => {
    const responses = [
      "I understand you're working on this concept. Let's break it down together!",
      "That's an interesting problem! Here's how we can approach it step-by-step.",
      "I'm here to help you master this topic. Would you like a quick summary first?",
      "Great question! This is a frequent topic in competitive exams. Let's explore it.",
      "I've got you covered! What specific part of this concept is confusing you?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      const userMessage = { text: inputValue, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setHasSubmitted(true);
      setIsAiTyping(true);

      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
        typedInstanceRef.current = null;
      }

      setTimeout(() => {
        const aiResponse = { text: generateAiResponse(inputValue), sender: 'ai' };
        setMessages(prev => [...prev, aiResponse]);
        setIsAiTyping(false);
      }, 1000 + Math.random() * 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (typedInstanceRef.current && e.target.value) {
      typedInstanceRef.current.destroy();
      typedInstanceRef.current = null;
    }
  };

  const renderIcon = (iconType: string) => {
    const icons: Record<string, string> = {
      physics: '⚡', chemistry: '🧪', mathematics: '📐', biology: '🧬',
      mockTests: '📝', revision: '⏳', pyqs: '📚', formulas: '➗'
    };
    return <span className="dashboard-action-icon">{icons[iconType] || '🎯'}</span>;
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileSidebarOpen(false);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dashboard-category-dropdown')) setIsCategoryOpen(false);
      if (!target.closest('.sidebar-category-container')) setIsSidebarCategoryOpen(false);
      if (!target.closest('.top-avatar-container')) setIsAvatarMenuOpen(false);
      if (!target.closest('.input-category-dropdown-container')) setIsInputCategoryOpen(false);
      if (!target.closest('.chat-menu-container')) setOpenMenuId(null);
      if (!target.closest('.chat-rename-input') && editingChatId) {
        setEditingChatId(null);
        setEditingName('');
      }
      if (isMobile && !target.closest('.dashboard-sidebar') && !target.closest('.mobile-menu-btn') &&
        !target.closest('.mobile-sidebar-overlay') && !target.closest('.sidebar-category-menu') &&
        !target.closest('.sidebar-category-container')) {
        setIsMobileSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, editingChatId]);

  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingChatId]);

  useEffect(() => {
    if (!textareaRef.current || hasSubmitted || inputValue) return;
    const desktopStrings = [
      "Ask Gruhap about Calculus integration...", "Ask Gruhap to explain Organic Chemistry...",
      "Ask Gruhap for a NEET study plan...", "Ask Gruhap to solve this Physics problem..."
    ];
    const mobileStrings = [
      "Ask Gruhap: Calculus...", "Ask Gruhap: Chemistry...",
      "Ask Gruhap: NEET Plan...", "Ask Gruhap: Physics..."
    ];
    const typed = new Typed(textareaRef.current, {
      strings: isMobile ? mobileStrings : desktopStrings,
      typeSpeed: 30, backSpeed: 20, backDelay: 900, startDelay: 500,
      loop: true, showCursor: false, smartBackspace: true, attr: "placeholder",
      onBegin: () => setIsTyping(true),
      preStringTyped: () => setIsTyping(true),
      onStringTyped: () => setIsTyping(false),
      onDestroy: () => setIsTyping(false),
    });
    typedInstanceRef.current = typed;
    return () => { if (typedInstanceRef.current) { typedInstanceRef.current.destroy(); typedInstanceRef.current = null; } };
  }, [hasSubmitted, inputValue, isMobile]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  return (
    <div className="dashboard-container">
      {isMobile && isMobileSidebarOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isMobile && isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            {!sidebarCollapsed && <span className="brand-name">GruhaP</span>}
          </div>
          {!isMobile && (
            <button className="sidebar-toggle-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} aria-label="Toggle sidebar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="12" y2="16" />
              </svg>
            </button>
          )}
        </div>

        <div className="sidebar-content">
          <nav className="main-nav">
            {mainNavItems.map(item => (
              <div key={item.id} className="sidebar-category-container">
                <button
                  className={`nav-item ${item.id === 'new-chat' ? 'new-chat-btn' : ''} ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleNavItemClick(item.id)}
                  title={item.label}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                  {!sidebarCollapsed && item.id === 'category' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      className={`sidebar-dropdown-arrow ${isSidebarCategoryOpen ? 'open' : ''}`}>
                      <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                  )}
                </button>
                {!sidebarCollapsed && item.id === 'category' && isSidebarCategoryOpen && (
                  <div className="sidebar-category-menu">
                    {sidebarCategories.map((category, index) => (
                      <button key={index} className="sidebar-category-item"
                        onClick={() => { console.log('Selected:', category); if (isMobile) { setIsMobileSidebarOpen(false); setIsSidebarCategoryOpen(false); } }}>
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="recents-section">
              <h3 className="section-title">CHATS</h3>
              <div className="recent-items">
                {chatHistory.length === 0 ? (
                  <p className="no-chats-text">No chat history yet</p>
                ) : (
                  chatHistory.map((chat) => (
                    <div key={chat.id} className={`recent-item-container ${activeChatId === chat.id ? 'active' : ''}`}>
                      {editingChatId === chat.id ? (
                        <input
                          ref={editInputRef}
                          type="text"
                          className="chat-rename-input"
                          value={editingName}
                          onChange={handleRenameChange}
                          onKeyDown={(e) => handleRenameKeyDown(e, chat.id)}
                          onBlur={(e) => handleRenameSubmit(e, chat.id)}
                        />
                      ) : (
                        <button
                          className={`recent-item ${activeChatId === chat.id ? 'active' : ''}`}
                          onClick={() => loadChat(chat.id)}
                        >
                          <span className="recent-text">{chat.name}</span>
                        </button>
                      )}
                      <div className="chat-menu-container">
                        <button
                          className="chat-menu-btn"
                          onClick={(e) => toggleChatMenu(e, chat.id)}
                          aria-label="Chat options"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                          </svg>
                        </button>
                        {openMenuId === chat.id && (
                          <div className="chat-dropdown-menu">
                            <button
                              className="chat-dropdown-item"
                              onClick={(e) => handleStartRename(e, chat)}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              Rename
                            </button>
                            <button
                              className="chat-dropdown-item delete"
                              onClick={(e) => handleDeleteChat(e, chat.id)}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="main-header">
          {isMobile && (
            <button className="mobile-menu-btn" onClick={toggleMobileSidebar} aria-label="Open menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="12" y2="16" />
              </svg>
            </button>
          )}
          <div className="top-avatar-container">
            <img src={topRightAvatar} alt="Top Avatar" className="top-avatar" onClick={toggleAvatarMenu} />
            {isAvatarMenuOpen && (
              <div className="top-avatar-menu">
                <button className="top-avatar-item" onClick={() => switchView('buy-token')}>Buy Token</button>
                <button className="top-avatar-item" onClick={() => switchView('balance')}>Balance</button>
                <button className="top-avatar-item" onClick={() => switchView('settings')}>Settings</button>
                <button className="top-avatar-item" onClick={() => switchView('help')}>Help</button>
                <button className="top-avatar-item">Log Out</button>
              </div>
            )}
          </div>
        </div>
        <div className="main-content">
          {currentView === 'chat' ? (
            <>
              {!hasSubmitted && (
                <div className="welcome-section">
                  <h1 className="welcome-title">Welcome back, {userInfo.name.split(' ')[0]}!</h1>
                </div>
              )}

              {hasSubmitted && (
                <div className="messages-container">
                  {messages.map((message, index) => (
                    <div key={index} className={`message-wrapper ${message.sender === 'ai' ? 'ai-message-wrapper' : 'user-message-wrapper'}`}>
                      <div className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}>{message.text}</div>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="message-wrapper ai-message-wrapper">
                      <div className="message ai-message typing-indicator"><span></span><span></span><span></span></div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              <div className={`dashboard-chat-section ${hasSubmitted ? 'chat-submitted' : ''}`}>
                {isMobile && !hasSubmitted && (
                  <div className="mobile-category-buttons">
                    <button id="mobile-category-wellness" className="mobile-category-btn-one mobile-category-mental-health">
                      <img src={wellnessImg} alt="JEE" className="mobile-category-icon-img" />
                      <span className="mobile-category-text">JEE Prep</span>
                    </button>
                    <button id="mobile-category-fitness" className="mobile-category-btn-two mobile-category-fitness">
                      <img src={fitnessImg} alt="NEET" className="mobile-category-icon-img" />
                      <span className="mobile-category-text">NEET Prep</span>
                    </button>
                    <button id="mobile-category-nutrition" className="mobile-category-btn-three mobile-category-nutritionist">
                      <img src={nutritionImg} alt="K12" className="mobile-category-icon-img" />
                      <span className="mobile-category-text">K12 Subjects</span>
                    </button>
                    <button id="mobile-category-more" className="mobile-category-btn-four mobile-category-more">
                      <img src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png" alt="More" className="mobile-category-icon-img" />
                      <span className="mobile-category-text">More</span>
                    </button>
                  </div>
                )}

                <div className="dashboard-input-container">
                  <div className="dashboard-input-left">
                    <div className="input-category-dropdown-container">
                      <button className="dashboard-add-btn" aria-label="Category dropdown" onClick={toggleInputCategoryDropdown}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          className={`dropdown-arrow-icon ${isInputCategoryOpen ? 'open' : ''}`}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      {isInputCategoryOpen && (
                        <div className="input-category-dropdown">
                          {categories.map((category, index) => (
                            <button key={index} className="input-category-item" onClick={() => handleInputCategorySelect(category)}>{category}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="dashboard-input-top">
                    <textarea ref={textareaRef} className={`dashboard-textarea ${isTyping ? "typing-active" : ""}`}
                      rows={1} value={inputValue} onChange={handleInputChange} onKeyPress={handleKeyPress}
                      placeholder={hasSubmitted ? "Ask anything" : ""} />
                  </div>
                  <div className="dashboard-input-right">
                    <button className="dashboard-submit-btn" aria-label="Submit" onClick={handleSubmit}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {!isMobile && !hasSubmitted && (
                  <div className="dashboard-actions-wrapper">
                    <div className="dashboard-scrolling-actions">
                      {scrollingActions.map((action, index) => (
                        <button key={index} className="dashboard-action-btn">
                          {renderIcon(action.iconType)}
                          <span className="dashboard-action-text">{action.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="demo-view-container overflow-y-auto h-full">
              <div className="p-8 pb-0">
                <button
                  onClick={() => switchView('chat')}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  Back to Chat
                </button>
              </div>

              {currentView === 'buy-token' && <BuyTokenDemo />}
              {currentView === 'balance' && <BalanceDemo />}
              {currentView === 'settings' && <SettingsDemo user={userInfo} />}
              {currentView === 'help' && <HelpDemo />}
              {currentView === 'search-view' && <PlaceholderDemo title="Search" />}
              {currentView === 'category-view' && <PlaceholderDemo title="Categories" />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
