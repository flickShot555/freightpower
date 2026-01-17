import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/carrier/Messaging.css';
import { getJson, openEventSource, postJson } from '../../api/http';

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

export default function Messaging() {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [peerType, setPeerType] = useState('drivers'); // drivers | shippers
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const streamRef = React.useRef(null);

  // Responsive state: show chat or contacts on mobile
  const [showChatMobile, setShowChatMobile] = useState(false);

  const filterTypesForPeer = useMemo(() => {
    return peerType === 'drivers' ? ['All', 'Direct', 'Groups'] : ['All', 'Direct'];
  }, [peerType]);

  const filteredThreads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (threads || []).filter(t => {
      const kind = t.kind;
      const peerOk = peerType === 'drivers'
        ? (kind === 'carrier_driver_direct' || kind === 'carrier_driver_group')
        : (kind === 'shipper_carrier_direct');

      const typeOk =
        filter === 'All' ||
        (filter === 'Direct' && (kind === 'carrier_driver_direct' || kind === 'shipper_carrier_direct')) ||
        (filter === 'Groups' && kind === 'carrier_driver_group');

      const title = String(t.display_title || t.other_display_name || t.title || '').toLowerCase();
      const last = String(t.last_message?.text || '').toLowerCase();
      const searchOk = !q || title.includes(q) || last.includes(q);
      return peerOk && typeOk && searchOk;
    });
  }, [threads, search, filter, peerType]);

  async function refreshThreads() {
    const data = await getJson('/messaging/threads');
    setThreads(data.threads || []);
  }

  async function refreshDrivers() {
    const data = await getJson('/messaging/carrier/drivers');
    setDrivers(data.drivers || []);
  }

  async function refreshShippers() {
    const data = await getJson('/messaging/carrier/shippers');
    setShippers(data.shippers || []);
  }

  async function selectThread(thread) {
    if (streamRef.current) {
      try { streamRef.current.close(); } catch (_) {}
      streamRef.current = null;
    }
    setSelectedThread(thread);
    const data = await getJson(`/messaging/threads/${thread.id}/messages?limit=100`);
    setMessages(data.messages || []);

    try {
      const lastTs = (data.messages || []).length ? (data.messages[data.messages.length - 1].created_at || 0) : 0;
      const es = await openEventSource(`/messaging/threads/${thread.id}/stream`, { since: lastTs });
      streamRef.current = es;
      es.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          if (payload?.type === 'message' && payload?.message) {
            setMessages((prev) => {
              const next = [...(prev || [])];
              if (!next.find(m => m.id === payload.message.id)) next.push(payload.message);
              return next;
            });
            refreshThreads().catch(() => {});
          }
        } catch (_) {
          // ignore
        }
      };
    } catch (_) {
      // SSE might fail in dev if backend not running; UI still works via manual refresh.
    }
  }

  const handleSend = async () => {
    if (!message.trim() || !selectedThread) return;
    const text = message.trim();
    setMessage('');
    await postJson(`/messaging/threads/${selectedThread.id}/messages`, { text });
    await refreshThreads();
    await selectThread({ ...selectedThread });
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        await Promise.all([refreshThreads(), refreshDrivers(), refreshShippers()]);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load messaging');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      if (streamRef.current) {
        try { streamRef.current.close(); } catch (_) {}
        streamRef.current = null;
      }
    };
  }, []);

  // Handle selecting a chat (mobile: show chat screen)
  const handleSelectChat = (chat) => {
    selectThread(chat);
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
          <p className="header-subtitle">Chat with your {peerType === 'drivers' ? 'drivers' : 'shippers'}</p>
        </div>
      </header>
      <div className="messaging-root">
        {/* Sidebar (Contacts) */}
        {(!isMobile || !showChatMobile) && (
          <aside className="sidebar">
            <div className="sidebar-header">
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <button
                  className={`chat-filter-btn${peerType === 'drivers' ? ' active' : ''}`}
                  onClick={() => {
                    setPeerType('drivers');
                    setFilter('All');
                    setSelectedThread(null);
                    setMessages([]);
                  }}
                >
                  Drivers
                </button>
                <button
                  className={`chat-filter-btn${peerType === 'shippers' ? ' active' : ''}`}
                  onClick={() => {
                    setPeerType('shippers');
                    setFilter('All');
                    setSelectedThread(null);
                    setMessages([]);
                  }}
                >
                  Shippers
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <select
                  style={{ flex: 1, padding: '8px 10px', borderRadius: 8 }}
                  defaultValue=""
                  onChange={async (e) => {
                    const pickedId = e.target.value;
                    if (!pickedId) return;
                    try {
                      const res = peerType === 'drivers'
                        ? await postJson('/messaging/carrier/threads/direct', { driver_id: pickedId })
                        : await postJson('/messaging/carrier/threads/shipper-direct', { shipper_id: pickedId });
                      await refreshThreads();
                      await selectThread(res.thread);
                      if (window.innerWidth <= 640) setShowChatMobile(true);
                    } catch (err) {
                      setError(err?.message || 'Failed to start chat');
                    } finally {
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Start chat with {peerType === 'drivers' ? 'driver' : 'shipper'}…</option>
                  {peerType === 'drivers' && drivers.map((d) => (
                    <option key={d.id} value={d.id}>{d.name || d.email || d.id}</option>
                  ))}
                  {peerType === 'shippers' && shippers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name || s.email || s.id}</option>
                  ))}
                </select>
                <button
                  className="chat-filter-btn"
                  onClick={async () => {
                    try {
                      setError('');
                      setLoading(true);
                      await Promise.all([refreshThreads(), refreshDrivers(), refreshShippers()]);
                    } catch (e) {
                      setError(e?.message || 'Refresh failed');
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Refresh
                </button>
              </div>
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
                {filterTypesForPeer.map(type => (
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
              {error && (
                <div style={{ padding: 12, color: '#b91c1c' }}>{error}</div>
              )}
              {loading && (
                <div style={{ padding: 12, opacity: 0.8 }}>Loading…</div>
              )}
              {!loading && filteredThreads.length === 0 && (
                <div style={{ padding: 12, opacity: 0.8 }}>No conversations yet.</div>
              )}
              {filteredThreads.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-item${selectedThread && selectedThread.id === chat.id ? ' active' : ''}`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className="chat-avatar">
                    {chat.other_photo_url ? (
                      <img
                        src={chat.other_photo_url}
                        alt="avatar"
                        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      initials(chat.display_title || chat.other_display_name || chat.title)
                    )}
                  </div>
                  <div className="chat-info">
                    <div className="chat-title">{chat.display_title || chat.other_display_name || chat.title || 'Conversation'}</div>
                    <div className="chat-last">{chat.last_message?.text || ''}</div>
                  </div>
                  <div className="chat-meta">
                    <span className="chat-time">{fmtTime(chat.last_message_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Main Chat Area */}
        {((!isMobile && selectedThread) || (isMobile && showChatMobile && selectedThread)) && (
          <main className="main-chat">
            {/* Chat Header */}
            <div className="chat-header">
              {isMobile && (
                <button className="back-btn" onClick={handleBack} style={{marginRight:12,background:'none',border:'none',fontSize:20,cursor:'pointer'}}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
              )}
              <div className="header-info">
                <div className="header-avatar">
                  {selectedThread.other_photo_url ? (
                    <img
                      src={selectedThread.other_photo_url}
                      alt="avatar"
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    initials(selectedThread.display_title || selectedThread.other_display_name || selectedThread.title)
                  )}
                </div>
                <div>
                  <div className="header-title">{selectedThread.display_title || selectedThread.other_display_name || selectedThread.title || 'Conversation'}</div>
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
              {messages.map((msg) => (
                <div key={msg.id} className={`message-row${msg.sender_role === 'carrier' ? ' sent' : ''}`}>
                  <div className="message-bubble">{msg.text}</div>
                  <div className="message-meta">{fmtTime(msg.created_at)}</div>
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
