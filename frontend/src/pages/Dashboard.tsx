import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Typed from "typed.js";
import './Dashboard.css';
import wellnessImg from '@/assets/wellness.png';
import fitnessImg from '@/assets/fitness.png';
import nutritionImg from '@/assets/nutrition-plan.png';
import { sendMessageToGroq, generateChatTitle } from '@/services/groqService';

// Modular Components
import BuyTokenDemo from '@/components/dashboard/BuyTokenDemo';
import BalanceDemo from '@/components/dashboard/BalanceDemo';
import SettingsDemo from '@/components/dashboard/SettingsDemo';
import HelpDemo from '@/components/dashboard/HelpDemo';
import PlaceholderDemo from '@/components/dashboard/PlaceholderDemo';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ChatWindow from '@/components/dashboard/ChatWindow';

// Types and Constants
import { 
  Message, 
  ChatHistory, 
  UserInfo, 
  mainNavItems, 
  sidebarCategories, 
  categories
} from '@/components/dashboard/types';

// --- Demo Components ---
// Moved to @/components/dashboard/*


// --- Dashboard Component ---
const Dashboard = () => {
  // Demo mode: No real auth context for now
  const isAuthenticated = true;

  const [activeSection, setActiveSection] = useState('chats');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCategoryOpen, setIsSidebarCategoryOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInputCategoryOpen, setIsInputCategoryOpen] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>(() => {
    try {
      const saved = localStorage.getItem('gruhap-chat-history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatCounter, setChatCounter] = useState(() => {
    try {
      const saved = localStorage.getItem('gruhap-chat-counter');
      return saved ? parseInt(saved, 10) : 1;
    } catch { return 1; }
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [currentView, setCurrentView] = useState('chat');
  const navigate = useNavigate();
  const location = useLocation();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const userInfo: UserInfo = {
    name: 'Anirban Sarkar',
    plan: 'Free',
    avatar: 'https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369991.png'
  };

  const topRightAvatar = "https://img.freepik.com/premium-photo/web-developer-digital-avatar-generative-ai_934475-9048.jpg";

  const toggleSidebarCategory = () => setIsSidebarCategoryOpen(!isSidebarCategoryOpen);
  const toggleAvatarMenu = () => setIsAvatarMenuOpen(!isAvatarMenuOpen);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleInputCategoryDropdown = () => setIsInputCategoryOpen(!isInputCategoryOpen);

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

  // Save current messages into the active chat in history
  const saveCurrentChat = () => {
    if (messages.length > 0 && activeChatId) {
      setChatHistory(prev => prev.map(chat =>
        chat.id === activeChatId ? { ...chat, messages: [...messages] } : chat
      ));
    }
  };

  const handleNewChat = () => {
    // Save current chat before creating new one
    if (messages.length > 0 && activeChatId) {
      setChatHistory(prev => prev.map(chat =>
        chat.id === activeChatId ? { ...chat, messages: [...messages] } : chat
      ));
    }

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
    setCurrentView('chat');
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

    // Save current chat first
    if (messages.length > 0 && activeChatId) {
      setChatHistory(prev => prev.map(chat =>
        chat.id === activeChatId ? { ...chat, messages: [...messages] } : chat
      ));
    }

    const chatToLoad = chatHistory.find(chat => chat.id === chatId);
    if (chatToLoad) {
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
        typedInstanceRef.current = null;
      }

      setMessages([...chatToLoad.messages]);
      setHasSubmitted(true);
      setActiveChatId(chatId);
      setCurrentView('chat');
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
      handleNewChat();
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

  const handleSubmit = async (overrideText?: string) => {
    const textToSubmit = overrideText || inputValue;
    if (textToSubmit.trim()) {
      const userText = textToSubmit;
      const userMessage = { text: userText, sender: 'user' };
      const isFirstMessage = messages.length === 0 && !activeChatId;

      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setHasSubmitted(true);
      setIsAiTyping(true);

      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
        typedInstanceRef.current = null;
      }

      // If this is the first message, create a new chat entry immediately
      let currentChatId = activeChatId;
      if (isFirstMessage) {
        const newChatId = `chat-${Date.now()}`;
        const tempTitle = userText.slice(0, 35) + (userText.length > 35 ? '...' : '');
        const newChat = {
          id: newChatId,
          name: tempTitle,
          messages: [userMessage],
        };

        setChatHistory(prev => {
          let updated = [newChat, ...prev];
          if (updated.length > 20) updated = updated.slice(0, 20);
          return updated;
        });
        setChatCounter(prev => prev + 1);
        setActiveChatId(newChatId);
        currentChatId = newChatId;

        // Generate AI title in background (non-blocking)
        generateChatTitle(userText).then(title => {
          setChatHistory(prev => prev.map(chat =>
            chat.id === newChatId ? { ...chat, name: title } : chat
          ));
        });
      }

      try {
        // Build conversation history for context
        const conversationHistory = messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text,
        }));

        const aiText = await sendMessageToGroq(userText, conversationHistory);
        const aiMessage = { text: aiText, sender: 'ai' };
        setMessages(prev => {
          const updated = [...prev, aiMessage];
          // Auto-save messages to chat history
          if (currentChatId) {
            setChatHistory(prevHistory => prevHistory.map(chat =>
              chat.id === currentChatId ? { ...chat, messages: updated } : chat
            ));
          }
          return updated;
        });
      } catch (error) {
        console.error('AI response error:', error);
        const errorMessage = { text: 'Sorry, something went wrong. Please try again.', sender: 'ai' };
        setMessages(prev => {
          const updated = [...prev, errorMessage];
          if (currentChatId) {
            setChatHistory(prevHistory => prevHistory.map(chat =>
              chat.id === currentChatId ? { ...chat, messages: updated } : chat
            ));
          }
          return updated;
        });
      } finally {
        setIsAiTyping(false);
      }
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

  // Persist chat history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gruhap-chat-history', JSON.stringify(chatHistory));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [chatHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('gruhap-chat-counter', String(chatCounter));
    } catch (e) {
      console.error('Failed to save chat counter:', e);
    }
  }, [chatCounter]);

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

  // Handle initial query from navigation state (Claude-like landing search)
  useEffect(() => {
    if (location.state && location.state.query) {
      const initialQuery = location.state.query;

      // Clear navigation state to prevent re-submission on refresh
      window.history.replaceState({}, document.title);

      // Select the chats section
      setActiveSection('chats');

      // A small delay to ensure states are ready
      setTimeout(() => {
        handleSubmit(initialQuery);
      }, 500);
    }
  }, [location.state]);

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

      <DashboardSidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        activeSection={activeSection}
        handleNavItemClick={handleNavItemClick}
        mainNavItems={mainNavItems}
        isSidebarCategoryOpen={isSidebarCategoryOpen}
        setIsSidebarCategoryOpen={setIsSidebarCategoryOpen}
        sidebarCategories={sidebarCategories}
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        editingChatId={editingChatId}
        editingName={editingName}
        editInputRef={editInputRef}
        handleRenameChange={handleRenameChange}
        handleRenameKeyDown={handleRenameKeyDown}
        handleRenameSubmit={handleRenameSubmit}
        loadChat={loadChat}
        openMenuId={openMenuId}
        toggleChatMenu={toggleChatMenu}
        handleStartRename={handleStartRename}
        handleDeleteChat={handleDeleteChat}
        navigate={navigate}
      />

      <main className="dashboard-main">
        <DashboardHeader
          isMobile={isMobile}
          toggleMobileSidebar={toggleMobileSidebar}
          topRightAvatar={topRightAvatar}
          isAvatarMenuOpen={isAvatarMenuOpen}
          toggleAvatarMenu={toggleAvatarMenu}
          switchView={switchView}
        />
        <div className="main-content">
          {currentView === 'chat' ? (
              <ChatWindow
                hasSubmitted={hasSubmitted}
                userInfo={userInfo}
                messages={messages}
                isAiTyping={isAiTyping}
                messagesEndRef={messagesEndRef}
                isMobile={isMobile}
                wellnessImg={wellnessImg}
                fitnessImg={fitnessImg}
                nutritionImg={nutritionImg}
                isInputCategoryOpen={isInputCategoryOpen}
                toggleInputCategoryDropdown={toggleInputCategoryDropdown}
                categories={categories}
                handleInputCategorySelect={handleInputCategorySelect}
                textareaRef={textareaRef}
                isTyping={isTyping}
                inputValue={inputValue}
                handleInputChange={handleInputChange}
                handleKeyPress={handleKeyPress}
                handleSubmit={handleSubmit}
              />
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
