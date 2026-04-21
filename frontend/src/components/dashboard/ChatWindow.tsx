import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, UserInfo, scrollingActions, renderIcon } from './types';

interface ChatWindowProps {
  hasSubmitted: boolean;
  userInfo: UserInfo;
  messages: Message[];
  isAiTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
  wellnessImg: string;
  fitnessImg: string;
  nutritionImg: string;
  isInputCategoryOpen: boolean;
  toggleInputCategoryDropdown: () => void;
  categories: string[];
  handleInputCategorySelect: (category: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  isTyping: boolean;
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSubmit: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  hasSubmitted,
  userInfo,
  messages,
  isAiTyping,
  messagesEndRef,
  isMobile,
  wellnessImg,
  fitnessImg,
  nutritionImg,
  isInputCategoryOpen,
  toggleInputCategoryDropdown,
  categories,
  handleInputCategorySelect,
  textareaRef,
  isTyping,
  inputValue,
  handleInputChange,
  handleKeyPress,
  handleSubmit
}) => {
  return (
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
              <div className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                {message.sender === 'ai' ? (
                  <div className="ai-markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                  </div>
                ) : (
                  message.text
                )}
              </div>
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
            <button className="mobile-category-btn-one mobile-category-mental-health">
              <img src={wellnessImg} alt="JEE" className="mobile-category-icon-img" />
              <span className="mobile-category-text">JEE Prep</span>
            </button>
            <button className="mobile-category-btn-two mobile-category-fitness">
              <img src={fitnessImg} alt="NEET" className="mobile-category-icon-img" />
              <span className="mobile-category-text">NEET Prep</span>
            </button>
            <button className="mobile-category-btn-three mobile-category-nutritionist">
              <img src={nutritionImg} alt="K12" className="mobile-category-icon-img" />
              <span className="mobile-category-text">K12 Subjects</span>
            </button>
            <button className="mobile-category-btn-four mobile-category-more">
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
            <button className="dashboard-submit-btn" aria-label="Submit" onClick={() => handleSubmit()}>
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
                  <span className="dashboard-action-icon">{renderIcon(action.iconType)}</span>
                  <span className="dashboard-action-text">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatWindow;
