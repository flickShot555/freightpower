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
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const streamRef = React.useRef(null);

  const [showChatMobile, setShowChatMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 900);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  async function refreshThreads() {
    const data = await getJson('/messaging/threads');
    setThreads(data.threads || []);
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
      // ignore; fallback to manual refresh
    }
  }

  const filteredThreads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (threads || []).filter(t => {
      const title = String(t.display_title || t.other_display_name || t.title || '').toLowerCase();
      const last = String(t.last_message?.text || '').toLowerCase();
      return !q || title.includes(q) || last.includes(q);
    });
  }, [threads, search]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        // Ensure driver has their carrier direct thread available
        await postJson('/messaging/driver/threads/my-carrier', {});
        await refreshThreads();
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

  const handleSend = async () => {
    if (!message.trim() || !selectedThread) return;
    const text = message.trim();
    setMessage('');
    await postJson(`/messaging/threads/${selectedThread.id}/messages`, { text });
    await refreshThreads();
    await selectThread({ ...selectedThread });
  };

  const handleSelectChat = (thread) => {
    selectThread(thread);
    if (window.innerWidth <= 640) setShowChatMobile(true);
  };

  const handleBack = () => setShowChatMobile(false);

  return (
    <>
      <header className="messaging-header">
        <div className="header-content">
          <h1>Messaging</h1>
          <p className="header-subtitle">Chat with your carrier</p>
        </div>
      </header>

      <div className="messaging-root">
        {(!isMobile || !showChatMobile) && (
          <aside className="sidebar">
            <div className="sidebar-header">
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <button
                  className="chat-filter-btn"
                  onClick={async () => {
                    try {
                      setError('');
                      setLoading(true);
                      await postJson('/messaging/driver/threads/my-carrier', {});
                      await refreshThreads();
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
            </div>

            <div className="chats-list">
              {error && <div style={{ padding: 12, color: '#b91c1c' }}>{error}</div>}
              {loading && <div style={{ padding: 12, opacity: 0.8 }}>Loading…</div>}
              {!loading && filteredThreads.length === 0 && (
                <div style={{ padding: 12, opacity: 0.8 }}>No conversations yet.</div>
              )}

              {filteredThreads.map(t => (
                <div
                  key={t.id}
                  className={`chat-item${selectedThread && selectedThread.id === t.id ? ' active' : ''}`}
                  onClick={() => handleSelectChat(t)}
                >
                  <div className="chat-avatar">
                    {t.other_photo_url ? (
                      <img
                        src={t.other_photo_url}
                        alt="avatar"
                        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      initials(t.display_title || t.other_display_name || t.title)
                    )}
                  </div>
                  <div className="chat-info">
                    <div className="chat-title">{t.display_title || t.other_display_name || t.title || 'Conversation'}</div>
                    <div className="chat-last">{t.last_message?.text || ''}</div>
                  </div>
                  <div className="chat-meta">
                    <span className="chat-time">{fmtTime(t.last_message_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        {((!isMobile && selectedThread) || (isMobile && showChatMobile && selectedThread)) && (
          <main className="main-chat">
            <div className="chat-header">
              {isMobile && (
                <button className="back-btn" onClick={handleBack} style={{ marginRight: 12, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>
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
                <i className="fa-solid fa-ellipsis-v"></i>
              </div>
            </div>

            <div className="messages-area">
              {messages.map((m) => (
                <div key={m.id} className={`message-row${m.sender_role === 'driver' ? ' sent' : ''}`}>
                  <div className="message-bubble">{m.text}</div>
                  <div className="message-meta">{fmtTime(m.created_at)}</div>
                </div>
              ))}
            </div>

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
