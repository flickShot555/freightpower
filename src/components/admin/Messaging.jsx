import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/carrier/Messaging.css';
import { getJson, postJson } from '../../api/http';

const CHANNELS = [
  { id: 'all', label: 'All Users' },
  { id: 'carrier', label: 'Carriers' },
  { id: 'driver', label: 'Drivers' },
  { id: 'shipper', label: 'Shippers' },
  { id: 'broker', label: 'Brokers' },
];

function initials(value) {
  const s = String(value || '').trim();
  if (!s) return '?';
  const parts = s.split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase()).join('') || '?';
}

function fmtTime(ts) {
  if (!ts) return '';
  const d = new Date(ts * 1000);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function AdminMessaging() {
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0]);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [targetRole, setTargetRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  async function loadChannel(channelId) {
    const data = await getJson(`/messaging/notifications/channels/${channelId}/messages?limit=100`);
    setMessages(data.messages || []);
  }

  const handleSelectChat = async (channel) => {
    setSelectedChannel(channel);
    if (isMobile) setShowChatMobile(true);
    setError('');
    try {
      setLoading(true);
      await loadChannel(channel.id);
    } catch (e) {
      setError(e?.message || 'Failed to load channel');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setShowChatMobile(false);

  const filteredChannels = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CHANNELS.filter(c => !q || c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  }, [search]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setError('');
    try {
      setLoading(true);
      await postJson('/messaging/admin/notifications/send', {
        text: message.trim(),
        title: title.trim() || null,
        target_role: targetRole,
      });
      setMessage('');
      setTitle('');
      // Refresh currently opened channel if it matches
      await loadChannel(selectedChannel?.id || 'all');
    } catch (e) {
      setError(e?.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await loadChannel('all');
      } catch (e) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search channels..." />
            </div>
          </div>
              <div className="chats-list">
            {filteredChannels.map(ch => (
              <div key={ch.id} className={`chat-item ${selectedChannel && selectedChannel.id === ch.id ? 'active' : ''}`} onClick={() => handleSelectChat(ch)}>
                <div className="chat-avatar">{initials(ch.label)}</div>
                <div className="chat-info">
                  <div className="chat-title">{ch.label}</div>
                  <div className="chat-last">One-way notifications</div>
                </div>
                <div className="chat-meta">
                  <span className="chat-time"></span>
                </div>
              </div>
            ))}
          </div>
          </aside>
        )}

        {/* Center: messages */}
        {((!isMobile && selectedChannel) || (isMobile && showChatMobile && selectedChannel)) && (
          <main className="main-chat">
          <div className="chat-header">
            {isMobile && (
              <button className="back-btn" onClick={handleBack} style={{marginRight:12,background:'none',border:'none',fontSize:20,cursor:'pointer'}}>
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            )}
            <div className="header-info">
              <div className="header-avatar">{initials(selectedChannel.label)}</div>
              <div>
                <div className="header-title">{selectedChannel.label}</div>
                <div className="header-sub muted">Broadcast notifications (one-way)</div>
              </div>
            </div>
          </div>

          <div className="messages-area">
            {error && <div style={{ padding: 12, color: '#b91c1c' }}>{error}</div>}
            {loading && <div style={{ padding: 12, opacity: 0.8 }}>Loading…</div>}
            {!loading && messages.length === 0 && <div style={{ padding: 12, opacity: 0.8 }}>No notifications yet.</div>}
            {messages.map((m) => (
              <div key={m.id} className={'message-row sent'}>
                <div className="message-bubble">
                  {m.title ? <div style={{ fontWeight: 700, marginBottom: 4 }}>{m.title}</div> : null}
                  {m.text}
                </div>
                <div className="message-meta">{fmtTime(m.created_at)}</div>
              </div>
            ))}
          </div>

          <div className="message-input-area">
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff' }}
            >
              {CHANNELS.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <input
              className="message-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Optional title"
              style={{ maxWidth: 220 }}
            />
            <input
              className="message-input"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type a notification..."
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend} disabled={loading}><i className="fa-solid fa-paper-plane" /></button>
          </div>
          </main>
        )}
      </div>
    </>
  );
}
