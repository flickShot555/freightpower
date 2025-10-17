import React, { useState } from 'react';
import '../../styles/carrier/CarrierDashboard.css';
import '../../styles/admin/AdminDashboard.css';
import TrackingVisibility from './TrackingVisibility';
import AdminAnalytics from './AdminAnalytics';
import UsersRoles from './UsersRoles';
import Carriers from './Carriers';
import Shippers from './Shippers';
import Drivers from './Drivers';
import ServiceProviders from './ServiceProviders';
import ComplianceAudit from './ComplianceAudit';
import DocumentVault from './DocumentVault';
import AdminMessaging from './Messaging';
import Tasks from './Tasks';
import HiringOnboarding from './HiringOnboarding';

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarDark, setIsSidebarDark] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-house' },
        { key: 'tracking', label: 'Tracking & Visibility', icon: 'fa-solid fa-location-dot' },
        { key: 'analytics', label: 'Analytics', icon: 'fa-solid fa-chart-line' }
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { key: 'users', label: 'Users & Roles', icon: 'fa-solid fa-users' },
        { key: 'carriers', label: 'Carriers', icon: 'fa-solid fa-truck' },
        { key: 'shippers', label: 'Shippers / Brokers', icon: 'fa-solid fa-people-group' },
        { key: 'drivers', label: 'Drivers', icon: 'fa-solid fa-person' },
        { key: 'service-providers', label: 'Service Providers', icon: 'fa-solid fa-briefcase' }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { key: 'document-vault', label: 'Document Vault', icon: 'fa-regular fa-folder' },
        { key: 'compliance-audit', label: 'Compliance & Audit', icon: 'fa-solid fa-shield-halved' },
        { key: 'messages', label: 'Messages', icon: 'fa-solid fa-envelope' },
        { key: 'tasks', label: 'Tasks / To-Do', icon: 'fa-solid fa-list-check' },
        { key: 'hiring', label: 'Hiring & Onboarding', icon: 'fa-solid fa-user-plus' }
      ]
    },
    {
      title: 'SYSTEM & TOOLS',
      items: [
        { key: 'support', label: 'Support Hub', icon: 'fa-regular fa-circle-question' },
        { key: 'system-settings', label: 'System Settings', icon: 'fa-solid fa-gear' },
        { key: 'my-profile', label: 'My Profile', icon: 'fa-regular fa-user' },
        { key: 'notifications', label: 'Notifications', icon: 'fa-regular fa-bell' },
        { key: 'logout', label: 'Logout', icon: 'fa-solid fa-right-from-bracket' }
      ]
    }
  ];

  return (
    <div className={`fp-dashboard-root ${isDarkMode ? 'dark-root' : ''}`}>
      <div className="fp-topbar">
        <div className="topbar-row topbar-row-1">
          <div className="topbar-left" style={{display:'flex',alignItems:'center',gap:12}}>
            <button className="hamburger" aria-label="Open sidebar" onClick={() => setIsSidebarOpen(true)}>
              <i className="fa-solid fa-bars" />
            </button>
            <div className="brand-block" style={{display:'flex',alignItems:'center',gap:12}}>
              <div className="logo">FreightPower AI</div>
            </div>
          </div>

          <div style={{flex:1,display:'flex',justifyContent:'center'}}>
            <div className="search-input-container" style={{width:720,maxWidth:'70%'}}>
              <input className="search-input" placeholder="Search by user, carrier, or document..." />
            </div>
          </div>

          <div className="topbar-right actions-right" style={{display:'flex',alignItems:'center',gap:12}}>
            <button className="search-toggle" aria-label="Open search">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
            <div className="icons">
              <div className="notif" style={{position:'relative'}}>
                <i className="fa-regular fa-bell notif-icon" aria-hidden="true" />
                <span className="notif-badge" style={{position:'absolute',right:-6,top:-6}}>3</span>
              </div>
              <i className="fa-regular fa-comments" style={{fontSize:18}} aria-hidden="true" />
            </div>

            <div className="profile" style={{display:'flex',alignItems:'center',gap:8}}>
              <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="avatar" className="avatar-img"/>
              <div className="profile-labels" style={{textAlign:'right'}}>
                <div style={{fontWeight:700}}>Farhan Salad</div>
                <div className="muted" style={{fontSize:12}}>Sub-Admin</div>
                <i className="fa-solid fa-caret-down" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`fp-content-row ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <aside className={`fp-sidebar ${isSidebarOpen ? 'open' : ''} ${isSidebarDark ? 'dark' : ''}`}>
          <div className="sidebar-header">
            <div className="brand-row">
              <div className="logo">FreightPower Admin</div>
            </div>
            <div className="chips sidebar-chips">
              <span className="chip-cd success">Admin</span>
            </div>
          </div>

          <nav className="fp-nav">
            {navGroups.map((group) => (
              <div className="nav-group" key={group.title}>
                <div className="nav-group-title">{group.title}</div>
                <ul>
                  {group.items.map((it) => (
                    <li
                      className={`nav-item ${activeNav === it.key ? 'active' : ''}`}
                      key={it.key}
                      onClick={() => { setActiveNav(it.key); if (isSidebarOpen) setIsSidebarOpen(false); }}
                      role="button"
                      tabIndex={0}
                    >
                      <i className={`${it.icon} icon`} aria-hidden="true"></i>
                      <span className="label">{it.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* Dark mode control - toggles site theme when clicked */}
          <div className="sidebar-dark-control" aria-hidden="false">
            <span className="dark-label">Dark Mode</span>
            <button
              className={`dark-toggle ${isDarkMode ? 'on' : ''}`}
              aria-pressed={isDarkMode}
              aria-label="Toggle dark mode"
              onClick={() => setIsDarkMode((s) => !s)}
            >
              <span className="dark-toggle-knob" />
            </button>
          </div>

          <button className="sidebar-close" aria-label="Close sidebar" onClick={() => setIsSidebarOpen(false)}>
            <i className="fa-solid fa-xmark" />
          </button>
        </aside>

        {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)} />}

        <main className="adm-main fp-main">

          {activeNav === 'tracking' && (
            <TrackingVisibility />
          )}

          {activeNav === 'analytics' && (
            <AdminAnalytics />
          )}

          {activeNav === 'users' && (
            <UsersRoles />
          )}

          {activeNav === 'carriers' && (
            <Carriers />
          )}

          {activeNav === 'shippers' && (
            <Shippers />
          )}

          {activeNav === 'drivers' && (
            <Drivers />
          )}

          {activeNav === 'service-providers' && (
            <ServiceProviders />
          )}

          {activeNav === 'document-vault' && (
            <DocumentVault />
          )}

          {activeNav === 'compliance-audit' && (
            <ComplianceAudit />
          )}

          {activeNav === 'messages' && (
            <AdminMessaging />
          )}

          {activeNav === 'tasks' && (
            <Tasks />
          )}

          {activeNav === 'hiring' && (
            <HiringOnboarding />
          )}

          {activeNav === 'dashboard' && (
            <>
            <header className="fp-header">
            <div className="fp-header-titles">
              <h2>Welcome, Farhan Salad <span role="img" aria-label="wave">👋</span></h2>
              <p className="fp-subtitle">Role: Compliance & Operations Sub-Admin — Last login: Today at 8:45 AM</p>
            </div>
          </header>

          <div className="buttons-aa">
              <button className="btn small-cd">+ Add User</button>
              <button className="btn ghost-cd small">Upload Document</button>
              <button className="btn ghost-cd small">Assign Task</button>
              <button className="btn small ghost-cd">Support</button>
            </div>
            <section className="fp-grid">
            <div className="card stats-card">
              <div className="card-header"><h3>Pending Documents</h3><i className="fa-regular fa-file card-icon"/></div>
              <div className="statss"><div>42</div></div>
            </div>

            <div className="card stats-card">
              <div className="card-header"><h3>Active Carriers</h3><i className="fa-solid fa-truck card-icon"/></div>
              <div className="statss"><div>18</div></div>
            </div>

            <div className="card stats-card">
              <div className="card-header"><h3>Active Drivers</h3><i className="fa-solid fa-user card-icon"/></div>
              <div className="statss"><div>24</div></div>
            </div>

            <div className="card stats-card">
              <div className="card-header"><h3>Pending Onboardings</h3><i className="fa-solid fa-hourglass-half card-icon"/></div>
              <div className="statss"><div>9</div></div>
            </div>

            <div className="card stats-card">
              <div className="card-header"><h3>Support Tickets</h3><i className="fa-solid fa-ticket card-icon"/></div>
              <div className="statss"><div>12</div></div>
            </div>

            <div className="card stats-card">
              <div className="card-header"><h3>Compliance Rate</h3><i className="fa-solid fa-shield-halved card-icon"/></div>
              <div className="statss"><div>94% <span>+2% this week</span></div></div>
            </div>
          </section>

          {/* Lower content: recent activity (left) and support/messages (right) */}
          <section className="adm-lower-grid">
            <div>
              <div className="card recent-activity-card">
                <div className="card-row"><h3>Recent Activity</h3></div>
                <ul className="recent-list">
                  <li className="msg-item">
                    <div className="msg-body">
                      <div className="msg-head"><strong>Carrier "SpeedFast LLC"</strong> <span className="muted">submitted insurance doc</span></div>
                      <div className="muted">09:12 AM</div>
                    </div>
                    <div className="tag"><span className="int-status-badge resolved">Verified</span></div>
                  </li>

                  <li className="msg-item">
                    <div className="msg-body">
                      <div className="msg-head"><strong>Driver "John M."</strong> <span className="muted">completed onboarding</span></div>
                      <div className="muted">09:09 AM</div>
                    </div>
                    <div className="tag"><span className="int-status-badge resolved">Approved</span></div>
                  </li>

                  <li className="msg-item">
                    <div className="msg-body">
                      <div className="msg-head"><strong>Ticket #1023</strong> <span className="muted">resolved by Sub-Admin</span></div>
                      <div className="muted">08:55 AM</div>
                    </div>
                    <div className="tag"><span className="int-status-badge resolved">Closed</span></div>
                  </li>

                  <li className="msg-item">
                    <div className="msg-body">
                      <div className="msg-head"><strong>Compliance form</strong> <span className="muted">flagged missing signature</span></div>
                      <div className="muted">08:40 AM</div>
                    </div>
                    <div className="tag"><span className="int-status-badge pending">Attention</span></div>
                  </li>
                </ul>
                <div style={{marginTop:12}}><a className="view-all">View All Activity Logs</a></div>
              </div>

              <div className="card tasks-card" style={{marginTop:18}}>
                <div className="card-row"><h3>Tasks & To-Do</h3>
                  <div style={{marginBottom: '10px', gap:'8px', display:'flex'}}>
                    <button className="btn small-cd">+ New Task</button>
                    <button className="btn ghost-cd small">Open Task Board</button>
                  </div>
                </div>
                <ul className="recent-list">
                  <li className="task-item"><strong>Review new carrier onboarding</strong><div className="muted">Assigned to: You</div><div className="task-due muted">Due: Today <span className="int-status-badge pending">Pending</span></div></li>
                  <li className="task-item"><strong>Verify driver logs</strong><div className="muted">Assigned to: Koshin A.</div><div className="task-due muted">Due: Tomorrow <span className="int-status-badge in-progress">In Progress</span></div></li>
                  <li className="task-item"><strong>Resolve support ticket #1044</strong><div className="muted">Assigned to: Amina Y.</div><div className="task-due muted">Due: Today <span className="int-status-badge resolved">Resolved</span></div></li>
                </ul>
              </div>
            </div>

            <aside>
              <div className="card notifications-card">
                <div className="card-row"><h3>Support Hub</h3></div>
                <ul className="notifications-list">
                  <li className="notification-item"><div className="note-left"></div><div className="note-body"><div className="note-title" >#1045 - Login Issues</div><div className="note-sub muted">2 hours ago</div></div><div className="note-time"><span className="int-status-badge revoked">High</span></div></li>
                  <li className="notification-item"><div className="note-left"></div><div className="note-body"><div className="note-title">#1046 - Document Upload</div><div className="note-sub muted">4 hours ago</div></div><div className="note-time"><span className="int-status-badge pending">Medium</span></div></li>
                  <li className="notification-item"><div className="note-left"></div><div className="note-body"><div className="note-title">#1047 - Profile Update</div><div className="note-sub muted">6 hours ago</div></div><div className="note-time"><span className="int-status-badge active">Low</span></div></li>
                </ul>
                <div style={{marginTop:12}}><button className="btn small-cd">View All Tickets</button></div>
              </div>

              <div className="card recent-messages" style={{marginTop:18}}>
                <div className="card-row"><h3>Recent Messages</h3></div>
                <ul className="recent-list">
                  <li className="msg-item"><img className="msg-avatar" src="https://randomuser.me/api/portraits/women/65.jpg" alt="sarah" /><div className="msg-body"><div className="msg-head"><strong>Sarah Johnson</strong> <span className="muted">New carrier registration approved</span></div><div className="muted">15 min ago</div></div></li>
                  <li className="msg-item"><img className="msg-avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="mike" /><div className="msg-body"><div className="msg-head"><strong>Mike Davis</strong> <span className="muted">Document verification needed</span></div><div className="muted">1 hour ago</div></div></li>
                </ul>
                <div style={{marginTop:12}}><a className="view-all">View All Messages</a></div>
              </div>
            </aside>
          </section>
            </>
          )}
          
        </main>
      </div>
    </div>
  );
}
