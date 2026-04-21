import React from 'react';

interface DashboardHeaderProps {
  isMobile: boolean;
  toggleMobileSidebar: () => void;
  topRightAvatar: string;
  isAvatarMenuOpen: boolean;
  toggleAvatarMenu: () => void;
  switchView: (view: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isMobile,
  toggleMobileSidebar,
  topRightAvatar,
  isAvatarMenuOpen,
  toggleAvatarMenu,
  switchView
}) => {
  return (
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
  );
};

export default DashboardHeader;
