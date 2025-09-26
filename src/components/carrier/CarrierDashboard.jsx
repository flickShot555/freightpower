import React, { useState } from 'react';
import '../../styles/carrier/CarrierDashboard.css';
import cd_hos from '../../assets/cd_hos.svg';
import safetyScore from '../../assets/safety-score.svg';
import violations from '../../assets/violations.svg';
import leftUx from '../../assets/cd_left_ux.svg';
import arrowRight from '../../assets/cd_arrow_right.svg';
import darkArrowRight from '../../assets/dark_arrow_right.svg';
import alertTriangle from '../../assets/alert_triangle.svg';
import gps from '../../assets/cd_gps.svg';
import bell from '../../assets/bell.svg';
import darkBell from '../../assets/dark_bell.svg';
import darkGps from '../../assets/dark_cd_gps.svg';
import sb_calendar from '../../assets/sb_calendar.svg';
import sb_consent from '../../assets/sb_consent.svg';
import sb_dashboard from '../../assets/sb_dashboard.svg';
import sb_doc from '../../assets/sb_doc.svg';
import sb_messages from '../../assets/sb_messages.svg';
import sb_settings from '../../assets/sb_settings.svg';
import sb_calendar_hover from '../../assets/sb_calendar_hover.svg';
import sb_consent_hover from '../../assets/sb_consent_hover.svg';
import sb_dashboard_hover from '../../assets/sb_dashboard_hover.svg';
import sb_doc_hover from '../../assets/sb_doc_hover.svg';
import sb_messages_hover from '../../assets/sb_messages_hover.svg';
import sb_settings_hover from '../../assets/sb_settings_hover.svg';
import searchIcon from '../../assets/search_black.svg';
import darkSearchIcon from '../../assets/dark_search.svg';
import contactIcon from '../../assets/cd_conatct.svg';
import darkContactIcon from '../../assets/dark_cd_conatct.svg';

export default function CarrierDashboard() {
  const [active, setActive] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  function SidebarNavItem({ item }) {
    const isActive = active === item.key;
    const src = isActive ? item.iconHover : item.icon;

    return (
      <a
        className={`cd-nav-item ${isActive ? 'active' : ''}`}
        onClick={() => setActive(item.key)}
        role="button"
        tabIndex={0}        
      >
        <div className="cd-icon-box"><img src={src} alt={item.label} className="cd-nav-img" /></div>
        <span>{item.label}</span>
      </a>
    );
  }
  return (
    <div className={"carrier-dashboard" + (darkMode ? ' dark' : '')}>
      <aside className="cd-sidebar">
        <div className="cd-logo">
          <div className="cd-logo-text">Logo</div>
        </div>

        <div className="cd-search">
          <div className="cd-search-icon"><img src={darkMode ? darkSearchIcon : searchIcon} alt="search" /></div>
          <input placeholder="Search transactions..." />
        </div>

        <div className="cd-menu-label">MAIN MENU</div>
        <nav className="cd-nav">
          {/* data-driven nav to support hover/active icon swaps */}
          {(() => {
            const items = [
              { key: 'dashboard', label: 'Dashboard', icon: sb_dashboard, iconHover: sb_dashboard_hover },
              { key: 'loads', label: 'My Loads', icon: sb_dashboard, iconHover: sb_dashboard_hover },
              { key: 'documents', label: 'Documents Vault', icon: sb_doc, iconHover: sb_doc_hover },
              { key: 'drivers', label: 'Drivers', icon: sb_doc, iconHover: sb_doc_hover },
              { key: 'compliance', label: 'Compliance Center', icon: sb_messages, iconHover: sb_messages_hover },
              { key: 'calendar', label: 'Calendar & Alerts', icon: sb_calendar, iconHover: sb_calendar_hover },
            ];
            return items.map(item => (
              <SidebarNavItem key={item.key} item={item} />
            ));
          })()}
        </nav>

        <div className="cd-section">
          <div className="cd-section-label">Management</div>
          <nav className="cd-nav small">
            {(() => {
              const items = [
                { key: 'hiring', label: 'Hiring & Onboarding', icon: sb_messages, iconHover: sb_messages_hover },
                { key: 'consent', label: 'Consent & eSignatures', icon: sb_consent, iconHover: sb_consent_hover },
                { key: 'rates', label: 'Rate Management', icon: sb_consent, iconHover: sb_consent_hover },
                { key: 'marketplace', label: 'Marketplace', icon: sb_consent, iconHover: sb_consent_hover },
              ];
              return items.map(item => <SidebarNavItem key={item.key} item={item} />);
            })()}
          </nav>
        </div>

        <div className="cd-section">
          <div className="cd-section-label">Insights</div>
          <nav className="cd-nav small">
            {(() => {
              const items = [
                { key: 'analytics', label: 'Analytics & Reports', icon: sb_settings, iconHover: sb_settings_hover },
                { key: 'alerts', label: 'Alerts Center', icon: sb_consent, iconHover: sb_consent_hover },
                { key: 'insights_calendar', label: 'Calendar', icon: sb_calendar, iconHover: sb_calendar_hover },
              ];
              return items.map(item => <SidebarNavItem key={item.key} item={item} />);
            })()}
          </nav>
        </div>

        <div className="cd-section">
          <div className="cd-section-label">Account</div>
          <nav className="cd-nav small">
            {(() => {
              const items = [
                { key: 'settings', label: 'Settings', icon: sb_settings, iconHover: sb_settings_hover },
              ];
              return items.map(item => <SidebarNavItem key={item.key} item={item} />);
            })()}
          </nav>
        </div>

        <div className="cd-bottom">
          <label className="dark-toggle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            />
            <span className="toggle-track" aria-hidden>
              <span className="toggle-thumb" />
            </span>
            <span className="toggle-label">Dark Mode</span>
          </label>
        </div>
      </aside>

      <main className="cd-main">
        <div className="cd-topbar">
            <div className="cd-top-left">
              <div className="cd-global-search">
                <div className="search-icon"><img src={darkMode ? darkSearchIcon : searchIcon} alt="search" /></div>
                <input placeholder="Search" />
              </div>
            </div>
          <div className="cd-top-right">
            <div className="pills">
              <span className="pill">45 Units</span>
              <span className="pill">12 Reefers</span>
              <span className="pill">28 Dry Vans</span>
            </div>
            <div className="top-icons">
              <div className="icon-wrapper">
                <img src={darkMode ? darkGps : gps} alt="gps" className="top-icon" />
                <span className="dot green" />
              </div>

              <div className="icon-divider" aria-hidden></div>

              <div className="icon-wrapper">
                <img src={darkMode ? darkBell : bell} alt="bell" className="top-icon" />
                <span className="dot red" />
              </div>

              <div className="icon-divider" aria-hidden></div>

              <div className="ux-wrap">
                <img src={leftUx} alt="FreightPower" />
              </div>
            </div>
          </div>
        </div>
  <div className="cd-topbar-divider" />

        <section className="overview">
          <div className="overview-header">
            <div>
              <h1>Dashboard Overview</h1>
              <p className="muted">Welcome back! Here's what's happening with your fleet today.</p>
            </div>
            <div className="overview-controls">
              <button className="btn-contact"><img src={darkMode ? darkContactIcon : contactIcon} alt="contact" />Contact</button>
              <button className="btn-primary">+ Upload BOL</button>
            </div>
          </div>
          <div className="overview-divider" />

          <div className="overview-progress">
            <div className="progress-card">
              <div className="progress-header">
                <div className="progress-title">Documents</div>
                <div className="progress-percent">85%</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width:'85%'}}></div>
              </div>
            </div>

            <div className="progress-card">
              <div className="progress-header">
                <div className="progress-title">Driver Verification</div>
                <div className="progress-percent">85%</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill yellow" style={{width:'85%'}}></div>
              </div>
            </div>
          </div>

          <div className="overview-grid">
            <div className="card compliance">
              <div className="card-header">
                <h3>Compliance Overview</h3>
                <button className="view-all">View All</button>
              </div>
              <ul className="compliance-list">
                <li>
                  <div className="li-left"><img src={cd_hos} alt="hos" /></div>
                  <div className="li-body">
                    <div className="li-title">HOS Compliant</div>
                    <div className="li-sub">All Drivers</div>
                  </div>
                  <div className="li-right"><img src={darkMode ? darkArrowRight : arrowRight} alt="go" /></div>
                </li>

                <li>
                  <div className="li-left"><img src={alertTriangle} alt="drug" /></div>
                  <div className="li-body">
                    <div className="li-title">Drug Test Due</div>
                    <div className="li-sub">3 Drivers</div>
                  </div>
                  <div className="li-right"><img src={darkMode ? darkArrowRight : arrowRight} alt="go" /></div>
                </li>

                <li>
                  <div className="li-left"><img src={safetyScore} alt="safety" /></div>
                  <div className="li-body">
                    <div className="li-title">Safety Score</div>
                    <div className="li-sub">B+ Rating</div>
                  </div>
                  <div className="li-right"><img src={darkMode ? darkArrowRight : arrowRight} alt="go" /></div>
                </li>

                <li>
                  <div className="li-left"><img src={violations} alt="violations" /></div>
                  <div className="li-body">
                    <div className="li-title">Violations</div>
                    <div className="li-sub">2 Pending</div>
                  </div>
                  <div className="li-right"><img src={darkMode ? darkArrowRight : arrowRight} alt="go" /></div>
                </li>
              </ul>
            </div>

            <div className="left-col">
              <div className="card small status">
                <div className="card-header">
                  <h3>Document Status</h3>
                  <div className="small-select-wrap">
                    <select className="small-select">
                      <option>Monthly</option>
                      <option>Yearly</option>
                      <option>Daily</option>
                    </select>
                    <span className="select-caret">▾</span>
                  </div>
                </div>
                <div className="doc-status">
                  <div className="status-row"><span className="label">Valid</span><span className="value">42</span></div>
                  <div className="status-row"><span className="label">Expiring</span><span className="value">42</span></div>
                  <div className="status-row"><span className="label">Pending</span><span className="value">42</span></div>
                </div>
              </div>

              <div className="card small schedules">
                <div className="card-header">
                  <h3>Today's Schedules</h3>
                  <div className="small-select-wrap">
                    <select className="small-select">
                      <option>Monthly</option>
                      <option>Yearly</option>
                      <option>Daily</option>
                    </select>
                    <span className="select-caret">▾</span>
                  </div>
                </div>
                <div className="today-schedules">
                  <div className="sched-row"><span>DOT Inspection</span><span>Unit 1247</span></div>
                  <div className="sched-row"><span>License Renewal</span><span>Driver J. Smit</span></div>
                </div>
              </div>
            </div>

            <div className="card marketplace">
              <div className="card-header">
                <h3>Marketplace Highlights</h3>
                <button className="view-all">View All</button>
              </div>
              <div className="mp-list">
                <div className="mp-item">
                  <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="john" />
                  <div className="mp-info">
                    <div className="mp-name">John Doe</div>
                    <div className="mp-sub">Pakistan</div>
                  </div>
                  <div className="mp-badge">On Route</div>
                </div>

                <div className="mp-item">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="john2" />
                  <div className="mp-info">
                    <div className="mp-name">John Doe</div>
                    <div className="mp-sub">Pakistan</div>
                  </div>
                  <div className="mp-badge">Break</div>
                </div>
              </div>
            </div>
          </div>

          <div className="recent-messages card">
            <div className="card-header">
              <h3>Recent Messages & Notifications</h3>
              <button className="view-all">View All</button>
            </div>
            <ul className="messages">
              <li>
                <div className="msg-left"><img src={alertTriangle} alt="note" /></div>
                <div className="msg-body">
                  <div className="msg-title">New load opportunity available</div>
                  <div className="msg-sub">Chicago to Dallas - $2,800 · 2 hours ago</div>
                </div>
                <div className="msg-right"><img src={darkMode ? darkArrowRight : arrowRight} alt="open" /></div>
              </li>

              <li>
                <div className="msg-left"><img src={alertTriangle} alt="note" /></div>
                <div className="msg-body">
                  <div className="msg-title">New load opportunity available</div>
                  <div className="msg-sub">Chicago to Dallas - $2,800 · 2 hours ago</div>
                </div>
                <div className="msg-right"><img src={darkMode ? darkArrowRight : arrowRight} alt="open" /></div>
              </li>
            </ul>
          </div>

        </section>
      </main>
    </div>
  );
}
