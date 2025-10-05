import React, { useState } from 'react';
import '../../styles/carrier/Messaging.css';

const mockChats = [
  {
    id: 1,
    name: "John's Logistics",
    avatar: 'JL',
    lastMessage: 'Load #12345 - Can you confirm pickup?',
    lastTime: '2m',
    unread: 2,
    type: 'Broker',
    messages: [
      { from: 'them', text: 'Hi! I have a load from Chicago to Dallas. Are you available for pickup tomorrow?', time: '2:30 PM' },
      { from: 'me', text: 'Yes, we can handle that. What’s the rate and pickup time?', time: '2:32 PM' },
      { from: 'them', text: 'Rate is $2,800. Pickup at 8 AM from Warehouse District. Can you confirm?', time: '2:35 PM' },
      { from: 'me', text: 'Can we do $2,850? I can guarantee pickup at 8 AM sharp.', time: '3:15 PM' },
      { from: 'them', text: "Deal! I'll send the load confirmation shortly.", time: '3:18 PM' },
      { from: 'them', text: <><i className="fa-solid fa-file-pdf" style={{color:'#ef4444',marginRight:6}}></i> load_confirmation_12345.pdf</>, time: '3:18 PM', file: true },
    ],
    contact: {
      name: 'John Smith',
      role: 'Broker • John’s Logistics',
      phone: '(555) 123-4567',
      email: 'john@johnslogistics.co',
    },
    load: {
      id: '#12345',
      route: 'Chicago → Dallas',
      rate: '$2,800',
      status: 'Confirmed',
    },
    sharedFiles: [
      { name: 'load_confirmation_12345.pdf', icon: 'fa-file-pdf', color: '#ef4444' }
    ]
  },
  {
    id: 2,
    name: 'Mike Rodriguez',
    avatar: 'MR',
    lastMessage: 'Delivered successfully. BOL attached.',
    lastTime: '7m',
    unread: 0,
    type: 'Driver',
    messages: [
      { from: 'them', text: 'Delivered successfully. BOL attached.', time: '7m' },
    ]
  },
  {
    id: 3,
    name: 'System Alert',
    avatar: 'S',
    lastMessage: 'ELD compliance check required',
    lastTime: '1h',
    unread: 1,
    type: 'System',
    messages: [
      { from: 'them', text: 'ELD compliance check required', time: '1h' },
    ]
  },
  {
    id: 4,
    name: 'TransFreight Corp',
    avatar: 'TF',
    lastMessage: 'Counter offer: $2,850 for Chicago...',
    lastTime: '3h',
    unread: 0,
    type: 'Broker',
    messages: [
      { from: 'them', text: 'Counter offer: $2,850 for Chicago to Dallas.', time: '3h' },
    ]
  },
];

const filterTypes = ['All', 'Brokers', 'Drivers', 'System'];

export default function Messaging() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [message, setMessage] = useState('');

  // Responsive state: show chat or contacts on mobile
  const [showChatMobile, setShowChatMobile] = useState(false);

  const filteredChats = mockChats.filter(
    chat => (filter === 'All' || chat.type === filter) &&
      (chat.name.toLowerCase().includes(search.toLowerCase()) || chat.lastMessage.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSend = () => {
    if (message.trim() && selectedChat) {
      setSelectedChat({
        ...selectedChat,
        messages: [
          ...selectedChat.messages,
          { from: 'me', text: message, time: 'Now' }
        ]
      });
      setMessage('');
    }
  };

  // Handle selecting a chat (mobile: show chat screen)
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (window.innerWidth <= 640) setShowChatMobile(true);
  };

  // Handle back to contacts (mobile)
  const handleBack = () => {
    setShowChatMobile(false);
  };

  // Responsive: show only contacts or chat on mobile/medium (reactive, up to 900px)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 900);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <>
      {/* Messaging Header */}
      <header className="messaging-header">
        <div className="header-content">
          <h1>Messaging</h1>
          <p className="header-subtitle">Chat with brokers, drivers, and system alerts</p>
        </div>
      </header>
      <div className="messaging-root">
        {/* Sidebar (Contacts) */}
        {(!isMobile || !showChatMobile) && (
          <aside className="sidebar">
            <div className="sidebar-header">
              <div className="sidebar-search">
                <i className="fa-solid fa-search"></i>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="filter-buttons">
                {filterTypes.map(type => (
                  <button
                    key={type}
                    className={`chat-filter-btn${filter === type ? ' active' : ''}`}
                    onClick={() => setFilter(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="chats-list">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-item${selectedChat && selectedChat.id === chat.id ? ' active' : ''}`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className="chat-avatar">{chat.avatar}</div>
                  <div className="chat-info">
                    <div className="chat-title">{chat.name}</div>
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

        {/* Main Chat Area */}
        {((!isMobile && selectedChat) || (isMobile && showChatMobile && selectedChat)) && (
          <main className="main-chat">
            {/* Chat Header */}
            <div className="chat-header">
              {isMobile && (
                <button className="back-btn" onClick={handleBack} style={{marginRight:12,background:'none',border:'none',fontSize:20,cursor:'pointer'}}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
              )}
              <div className="header-info">
                <div className="header-avatar">{selectedChat.avatar}</div>
                <div>
                  <div className="header-title">{selectedChat.name}</div>
                </div>
              </div>
              <div className="header-actions">
                <i className="fa-solid fa-phone"></i>
                <i className="fa-solid fa-video"></i>
                <i className="fa-solid fa-ellipsis-v"></i>
              </div>
            </div>
            {/* Messages */}
            <div className="messages-area">
              {selectedChat.messages.map((msg, idx) => (
                <div key={idx} className={`message-row${msg.from === 'me' ? ' sent' : ''}`}>
                  <div className="message-bubble">{msg.text}</div>
                  <div className="message-meta">{msg.time}</div>
                </div>
              ))}
            </div>
            {/* Message Input */}
            <div className="message-input-area">
              <input
                className="message-input"
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button className="send-btn" onClick={handleSend}>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </main>
        )}
      </div>
    </>
  );
}
