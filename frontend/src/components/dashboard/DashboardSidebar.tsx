import React from 'react';
import { ChatHistory } from './types';

interface DashboardSidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  activeSection: string;
  handleNavItemClick: (id: string) => void;
  mainNavItems: { id: string; label: string; icon: React.ReactNode }[];
  isSidebarCategoryOpen: boolean;
  setIsSidebarCategoryOpen: (open: boolean) => void;
  sidebarCategories: string[];
  chatHistory: ChatHistory[];
  activeChatId: string | null;
  editingChatId: string | null;
  editingName: string;
  editInputRef: React.RefObject<HTMLInputElement>;
  handleRenameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRenameKeyDown: (e: React.KeyboardEvent, id: string) => void;
  handleRenameSubmit: (e: any, id: string) => void;
  loadChat: (id: string) => void;
  openMenuId: string | null;
  toggleChatMenu: (e: React.MouseEvent, id: string) => void;
  handleStartRename: (e: React.MouseEvent, chat: ChatHistory) => void;
  handleDeleteChat: (e: React.MouseEvent, id: string) => void;
  navigate: (path: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  isMobile,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  activeSection,
  handleNavItemClick,
  mainNavItems,
  isSidebarCategoryOpen,
  setIsSidebarCategoryOpen,
  sidebarCategories,
  chatHistory,
  activeChatId,
  editingChatId,
  editingName,
  editInputRef,
  handleRenameChange,
  handleRenameKeyDown,
  handleRenameSubmit,
  loadChat,
  openMenuId,
  toggleChatMenu,
  handleStartRename,
  handleDeleteChat,
  navigate
}) => {
  return (
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
  );
};

export default DashboardSidebar;
