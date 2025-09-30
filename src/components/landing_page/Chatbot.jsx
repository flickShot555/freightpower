import { useState, useEffect } from 'react';
import chatbotIcon from '../../assets/chatbot.svg';
import cameraIcon from '../../assets/Camera.svg';
import uploadIcon from '../../assets/Upload.svg';
import smileIcon from '../../assets/face-smile.svg';
import dotsIcon from '../../assets/dots-horizontal.svg';
import '../../styles/landing_page/chatbot.css';

export default function Chatbot({ isOpen, onClose, onMinimizeChange }) {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      setCurrentTime(`Today ${timeString}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleMinimize = () => {
    const next = !isMinimized
    setIsMinimized(next);
    if (typeof onMinimizeChange === 'function') onMinimizeChange(next)
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay">
      <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-avatar-header">
            <img src={chatbotIcon} alt="Chatbot" className="chatbot-header-icon" />
          </div>
          <div className="chatbot-header-controls">
            <button className="chatbot-minimize" onClick={handleMinimize}>
              {isMinimized ? '□' : '−'}
            </button>
            <button className="chatbot-close" onClick={() => { if (typeof onMinimizeChange === 'function') onMinimizeChange(false); onClose && onClose() }}>×</button>
          </div>
        </div>

        {/* Messages - only show when not minimized */}
        {!isMinimized && (
          <>
            <div className="chatbot-messages">
              {/* First Message */}
              <div className="chatbot-message">
                <div className="chatbot-avatar">
                  <img src={chatbotIcon} alt="Chatbot" className="chatbot-avatar-icon" />
                </div>
                <div className="chatbot-message-content">
                  <div className="chatbot-message-header">
                    <span className="chatbot-name">Onboarding Chatbot</span>
                    <span className="chatbot-time">{currentTime}</span>
                  </div>
                  <div className="chatbot-message-text">
                    Lets start your onboarding. Please upload your drivers license or ID
                  </div>
                  
                  {/* File Upload Area */}
                  <div className="chatbot-upload-area">
                    <input
                      type="file"
                      id="file-upload"
                      accept=".svg,.png,.jpg,.jpeg,.gif"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload" className="chatbot-upload-label">
                      <div className="chatbot-upload-icon">
                        <img src={uploadIcon} alt="Upload" className="upload-icon-svg" />
                      </div>
                      <div className="chatbot-upload-text">
                        <span className="upload-link">Click to upload</span> Upload a File<br />
                        SVG, PNG, JPG or GIF (max. 800×400px)
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="chatbot-input-area">
              <button className="chatbot-action-btn">
                <img src={cameraIcon} alt="Camera" className="action-icon" />
              </button>
              <button className="chatbot-action-btn">
                <img src={uploadIcon} alt="Upload" className="action-icon" />
              </button>
              <button className="chatbot-action-btn">
                <img src={smileIcon} alt="Emoji" className="action-icon" />
              </button>
              <button className="chatbot-action-btn">
                <img src={dotsIcon} alt="More" className="action-icon" />
              </button>
              <button className="chatbot-send-button">Send message</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}