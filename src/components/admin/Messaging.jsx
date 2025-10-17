import React, { useState, useEffect } from 'react';
import '../../styles/carrier/Messaging.css';

const mockChats = [
  { id: 1, name: 'Metro Logistics', avatar: 'ML', lastMessage: 'Insurance Document Update Required', lastTime: '2 min ago', unread: 1, type: 'Carrier', messages: [
      { from: 'them', text: 'Hi, I need to update our insurance certificate. The current one expires in 3 days. Can you help me with the process?', time: 'Today 2:15 PM' },
      { from: 'ai', text: 'Carrier requesting assistance with insurance certificate renewal. Current certificate expires in 3 days. Standard compliance update required.', time: 'Today 2:15 PM' },
      { from: 'me', text: "I'll help you with that. Please upload your new insurance certificate through the compliance portal. I'll review it within 2 hours.", time: 'Today 2:18 PM' }
    ], contact: { name: 'Metro Logistics', role: 'Carrier', phone: '', email: '' }, load: { id: '#1452', note: 'Insurance Update' }, sharedFiles: [] },
  { id: 2, name: 'Apex Freight Solutions', avatar: 'AF', lastMessage: 'Load #1452 Rate Confirmation', lastTime: '5 min ago', unread: 0, type: 'Broker', messages: [{ from: 'them', text: 'Confirming the updated rate for delivery to...', time: '5 min ago' }] },
  { id: 3, name: 'Mike Rodriguez', avatar: 'MR', lastMessage: 'Delivery Confirmation - Load #1448', lastTime: '12 min ago', unread: 0, type: 'Driver', messages: [{ from: 'them', text: 'Package delivered successfully. POD attached.', time: '12 min ago' }] }
];

export default function AdminMessaging() {
  const [chats] = useState(mockChats);
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 900);
  const [showChatMobile, setShowChatMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // When switching back to desktop ensure mobile chat overlay closes
  useEffect(() => {
    if (!isMobile) setShowChatMobile(false);
  }, [isMobile]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (isMobile) setShowChatMobile(true);
  };

  const handleBack = () => setShowChatMobile(false);

  const filtered = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMessage.toLowerCase().includes(search.toLowerCase()));

  const handleSend = () => {
    if (!message.trim()) return;
    const updated = { ...selectedChat };
    updated.messages = [...updated.messages, { from: 'me', text: message, time: 'Now' }];
    setSelectedChat(updated);
    setMessage('');
  };

  return (
    <>
      <header className="messaging-header">
        <div className="header-content">
          <h1>Messages</h1>
          <p className="header-subtitle">All conversations — route compliance, carriers, drivers, and brokers</p>
        </div>
      </header>

      <div className="messaging-root admin-messaging-root">
        {/* Left: conversations */}
        {(!isMobile || !showChatMobile) && (
          <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-search">
              <i className="fa-solid fa-search" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..." />
            </div>
            <div className="filter-buttons" style={{marginTop:8}}>
              <button className={`chat-filter-btn active`}>All</button>
              <button className={`chat-filter-btn`}>Direct</button>
              <button className={`chat-filter-btn`}>Compliance</button>
              <button className={`chat-filter-btn`}>Finance</button>
            </div>
          </div>
              <div className="chats-list">
            {filtered.map(chat => (
              <div key={chat.id} className={`chat-item ${selectedChat && selectedChat.id === chat.id ? 'active' : ''}`} onClick={() => handleSelectChat(chat)}>
                <div className="chat-avatar">{chat.avatar}</div>
                <div className="chat-info">
                  <div className="chat-title">{chat.name} <span className="chat-tag">{chat.type}</span></div>
                  <div className="chat-last">{chat.lastMessage}</div>
                </div>
                <div className="chat-meta">
                  <span className="chat-time">{chat.lastTime}</span>
                  {chat.unread > 0 && <span className="chat-unread">{chat.unread}</span>}
                </div>
              </div>
            ))}
          </div>
          </aside>
        )}

        {/* Center: messages */}
        {((!isMobile && selectedChat) || (isMobile && showChatMobile && selectedChat)) && (
          <main className="main-chat">
          <div className="chat-header">
            {isMobile && (
              <button className="back-btn" onClick={handleBack} style={{marginRight:12,background:'none',border:'none',fontSize:20,cursor:'pointer'}}>
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            )}
            <div className="header-info">
              <div className="header-avatar">{selectedChat.avatar}</div>
              <div>
                <div className="header-title">{selectedChat.name} <span className="muted">{selectedChat.load?.id} · {selectedChat.load?.note}</span></div>
                <div className="header-sub muted">{selectedChat.contact?.role || selectedChat.type}</div>
              </div>
            </div>
          </div>

          <div className="messages-area">
            {selectedChat.messages.map((m, i) => (
              <div key={i} className={`message-row${m.from === 'me' ? ' sent' : m.from === 'ai' ? ' ai' : ''}`}>
                <div className="message-bubble">{m.text}</div>
                <div className="message-meta">{m.time}</div>
              </div>
            ))}
          </div>

          <div className="message-input-area">
            <input className="message-input" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message..." onKeyDown={e => e.key === 'Enter' && handleSend()} />
            <button className="send-btn" onClick={handleSend}><i className="fa-solid fa-paper-plane" /></button>
          </div>
          </main>
        )}
      </div>

      <div className="ai-summary">
              <div className="ai-summary-left">
                <span className="aai-icon"><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                <div className="aai-text"><strong>AI Summary:</strong> 163 new messages today. Average response time: 3 minutes. 3 unresolved system tickets. AI Recommends notifying 2 carriers about expiring complaince</div>
              </div>
              <div className="aai-actions">
                <button className="btn small ghost-cd"><i className="fa fa-brain" aria-hidden="true"></i> Apply Suggestion</button>
                <button className="btn small ghost-cd"><i className="fa fa-chart-line" aria-hidden="true"></i> View Reports</button>
                <button className="btn small ghost-cd"><i className="fa fa-bell" aria-hidden="true"></i> Send Reminder</button>
              </div>
            </div>
    </>
  );
}
