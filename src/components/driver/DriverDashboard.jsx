import React, { useState } from 'react';


import DocumentVault from './DocumentVault';
import Marketplace from './Marketplace';
import MyCarrier from './MyCarrier';
import HiringOnboarding from './HiringOnboarding';
import AccountSettings from './AccountSettings';
import AiHub from './AiHub';
import ConsentESignature from './ConsentESignature';
import '../../styles/driver/DriverDashboard.css';
import logo from '/src/assets/logo.png';
import resp_logo from '/src/assets/logo_1.png';

export default function DriverDashboard() {
  const [activeNav, setActiveNav] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPostHire, setIsPostHire] = useState(false);

  const navGroups = [
    {
      title: 'OPERATIONS',
      items: [
        { key: 'home', label: 'My Loads', icon: 'fa-solid fa-house' },
        { key: 'docs', label: 'Document Vault', icon: 'fa-solid fa-folder' },
        { key: 'marketplace', label: 'Marketplace', icon: 'fa-solid fa-store' },
      ]
    },
    {
      title: 'MANAGEMENT', 
      items: [
        { key: 'carrier', label: 'My Carrier', icon: 'fa-solid fa-building' },
        { key: 'hiring', label: 'Hiring & Onboarding', icon: 'fa-solid fa-user-plus' },
        { key: 'esign', label: 'Consent & E-Signature', icon: 'fa-solid fa-pen-fancy' }
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { key: 'settings', label: 'Account & Settings', icon: 'fa-solid fa-gear' },
        { key: 'help', label: 'AI Hub', icon: 'fa-solid fa-robot' }
      ]
    }
  ];

  function HomeView() {
    return (
      <>
        <header className="fp-header">
          <div className="fp-header-titles">
            <h2>
              <span role="img" aria-label="wave">👋</span>
              Welcome to FreightPower, Marcus!
            </h2>
            <p className="fp-subtitle">Complete your onboarding to start connecting with carriers and finding loads.</p>
            <button onClick={() => setIsPostHire(true)} className="btn small green-btn">Post Hire</button>
          </div>
        </header>

        <section className="fp-grid">
          {/* Onboarding Progress Card */}
          <div className="card dd-onboarding-card span-3">
            <div className="dd-onboarding-progress">
              <span className="dd-progress-title">Onboarding Progress</span>
              <span className="dd-progress-percent">70% Complete</span>
            </div>
            <div className="dd-progress-bar">
              <div className="dd-progress-bar-inner" />
            </div>
            <div className="dd-onboarding-steps">
              <div className="dd-step dd-step-complete">
                  <i className="fa-solid fa-check-circle dd-step-complete-icon-fa"></i>
                <div className="dd-step-title">Docs Uploaded</div>
                <div className="dd-step-status">Complete</div>
              </div>
              <div className="dd-step dd-step-inprogress">
                  <i className="fa-solid fa-hourglass-half dd-step-inprogress-icon-fa"></i>
                <div className="dd-step-title">Consent Given</div>
                <div className="dd-step-status">In Progress</div>
              </div>
              <div className="dd-step dd-step-pending">
                  <i className="fa-regular fa-circle dd-step-pending-icon-fa"></i>
                <div className="dd-step-title">Availability On</div>
                <div className="dd-step-status">Pending</div>
              </div>
            </div>
            <button className="btn small-cd">Continue Onboarding</button>
          </div>

          {/* Marketplace Activity */}
          <div className="card dd-marketplace-card">
            <div className="card-header">
              <h3>Marketplace Activity</h3>
              <span className="dd-marketplace-new dd-marketplace-green">3 New</span>
            </div>
            <div className="dd-marketplace-content dd-center dd-marketplace-padding">
              <div className="dd-marketplace-eye">
                <i className="fa-solid fa-eye dd-marketplace-eye-icon"></i>
              </div>
              <div className="dd-marketplace-viewed">3 Carriers Viewed You</div>
              <div className="dd-marketplace-desc">
                This week carriers have shown interest in your profile
              </div>
              <button className="btn small-cd">View Marketplace</button>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="card dd-ai-suggestions-card">
            <div className="card-header">
              <h3>AI Suggestions</h3>
            </div>
            <div className="dd-ai-suggestion">
              <div className="dd-suggestion-title">Medical Card Expiring</div>
              <div className="dd-suggestion-text">Expires in 15 days</div>
            </div>
            <div className="dd-ai-suggestion">
              <div className="dd-suggestion-title">Profile Tip</div>
              <div className="dd-suggestion-text">Add experience details to attract carriers</div>
            </div>
            <div className="dd-ai-suggestion">
              <div className="dd-suggestion-title">Marketplace Ready</div>
              <div className="dd-suggestion-text">Turn on availability to be discovered</div>
            </div>
          </div>

          {/* Service Providers */}
          <div className="card dd-service-providers-card">
            <div className="card-header">
              <h3>Service Providers</h3>
              <span className="view-all">View All</span>
            </div>
            <div className="dd-service-grid">
              <div className="dd-service-item dd-center">
                <i className="fa-solid fa-gavel" />
                <div>Legal Help</div>
              </div>
              <div className="dd-service-item dd-center">
                <i className="fa-solid fa-wrench" />
                <div>Roadside</div>
              </div>
              <div className="dd-service-item dd-center">
                <i className="fa-solid fa-parking" />
                <div>Parking</div>
              </div>
              <div className="dd-service-item dd-center">
                <i className="fa-solid fa-gas-pump" />
                <div>Fuel</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card dd-quick-actions-card span-3">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="dd-quick-actions">
              <button className="btn small-cd">
                <i className="fa-solid fa-upload"></i>
                Upload Document
              </button>
              <button className="btn small-cd">
                <i className="fa-solid fa-store"></i>
                Browse Marketplace
              </button>
              <button className="btn small-cd">
                <i className="fa-solid fa-pen"></i>
                Complete Consent
              </button>
              <button className="btn small ghost-cd">
                <i className="fa-solid fa-headset"></i>
                Get Support
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  function PostHireView() {
    return (
      <>
        <header className="fp-header">
          <div className="fp-header-titles">
            <button onClick={() => setIsPostHire(false)} className="btn small">Back to Pre-Hire</button>
          </div>
        </header>

        {/* Active Load Card - Full Width */}
        <div className="card dd-active-load-card">
          <div className="dd-active-load-header">
            <h3>Active Load - Chicago to Denver</h3>
            <span className="dd-load-status">In Transit</span>
          </div>
          <div className="dd-active-load-content">
            <div className="dd-load-info-grid">
              <div className="dd-load-info-item">
                <span className="dd-info-label">Pickup</span>
                <span className="dd-info-value">Chicago, IL</span>
                <span className="dd-info-status">Completed ✓</span>
              </div>
              <div className="dd-load-info-item">
                <span className="dd-info-label">Delivery</span>
                <span className="dd-info-value">Denver, CO</span>
                <span className="dd-info-status">ETA: 6:30 PM</span>
              </div>
              <div className="dd-load-info-item">
                <span className="dd-info-label">Distance</span>
                <span className="dd-info-value">287 miles left</span>
                <span className="dd-info-status">920 total miles</span>
              </div>
              <div className="dd-load-info-item">
                <span className="dd-info-label">Rate</span>
                <span className="dd-info-value">$2,300</span>
                <span className="dd-info-status">$2.50/mile</span>
              </div>
            </div>
            <div className="dd-load-actions">
              <button className="btn small ghost-cd dd-btn">
                <i className="fa-solid fa-location-arrow"></i>
                Navigate
              </button>
              <button className="btn small ghost-cd dd-btn">
                <i className="fa-solid fa-upload"></i>
                Upload POD
              </button>
              <button className="btn small ghost-cd dd-btn">
                <i className="fa-solid fa-comment"></i>
                Message Dispatch
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="dd-two-column-layout">
          {/* Left Column */}
          <div className="dd-left-column">
            {/* Load Summary */}
            <div className="dd-load-summary-section">
              <h3 className="dd-section-title">Load Summary</h3>
              <div className="card dd-load-summary-card dd-no-header">
                <div className="dd-summary-stats-horizontal">
                  <div className="dd-stat-item-horizontal">
                    <div className="dd-stat-number-large">2</div>
                    <div className="dd-stat-label-horizontal">Assigned</div>
                  </div>
                  <div className="dd-stat-item-horizontal">
                    <div className="dd-stat-number-large">1</div>
                    <div className="dd-stat-label-horizontal">In Transit</div>
                  </div>
                  <div className="dd-stat-item-horizontal">
                    <div className="dd-stat-number-large">12</div>
                    <div className="dd-stat-label-horizontal">Completed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Cards */}
            <div className="card dd-route-card">
              <div className="dd-route-header">
                <h4>Denver to Phoenix</h4>
                <span className="int-status-badge active">Assigned</span>
              </div>
              <div className="dd-route-info">
                <div className="dd-route-details">
                  <div>Pickup: Nov 15, 8:00 AM</div>
                  <div>Delivery: Nov 16, 2:00 PM</div>
                  <div>Rate: $1,850</div>
                </div>
                <div className="dd-route-actions">
                  <button className="btn small-cd">Start Trip</button>
                  <button className="btn small ghost-cd">View Details</button>
                </div>
              </div>
            </div>

            <div className="card dd-route-card">
              <div className="dd-route-header">
                <h4>Phoenix to Los Angeles</h4>
                <span className="int-status-badge warning">Pending</span>
              </div>
              <div className="dd-route-info">
                <div className="dd-route-details">
                  <div>Pickup: Nov 17, 10:00 AM</div>
                  <div>Delivery: Nov 17, 6:00 PM</div>
                  <div>Rate: $950</div>
                </div>
                <div className="dd-route-actions">
                  <button className="btn small ghost-cd">View Details</button>
                </div>
              </div>
            </div>

            {/* Live Route Tracking */}
            <div className="card dd-live-route-card">
              <div className="dd-section-title">
                <h3>Live Route Tracking</h3>
              </div>
              <div className="dd-live-route-content">
                <div className="dd-map-placeholder">
                  <i className="fa-solid fa-map-location-dot dd-map-icon"></i>
                  <div className="dd-map-text">
                    <div className="dd-map-title">Interactive map with real-time GPS tracking</div>
                    <div className="dd-map-location">Current location: I-76 W, Mile 287</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="dd-right-column">
            {/* Compliance Status */}
            <div className="card dd-compliance-card">
              <div className="dd-section-title">
                <h3>Compliance Status</h3>
              </div>
              <div className="dd-compliance-items">
                <div className="dd-compliance-item ">
                  <i className="fa-solid fa-id-card"></i>
                  <span>CDL License</span>
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="dd-compliance-item ">
                  <i className="fa-solid fa-file-medical"></i>
                  <span>Medical Card</span>
                  <i className="fa-solid fa-exclamation-triangle"></i>
                </div>
                <div className="dd-compliance-item">
                  <i className="fa-solid fa-search"></i>
                  <span>Drug Test</span>
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="dd-compliance-item">
                  <i className="fa-solid fa-clipboard-check"></i>
                  <span>Background Check</span>
                  <i className="fa-solid fa-check"></i>
                </div>
              </div>
              <button className="btn small-cd" style={{width: '100%'}}>View All Documents</button>
            </div>

            {/* Messages & Alerts Section */}
            <div className="dd-messages-alerts-section">
              <h3 className="dd-section-title">Messages & Alerts</h3>
              
              {/* Route Update Card */}
              <div className="card dd-message-card dd-route-update-card">
                <div className="dd-message-icon ">
                  <i className="fa-solid fa-route"></i>
                </div>
                <div className="dd-message-content">
                  <div className="dd-message-title">Route Update</div>
                  <div className="dd-message-text">Traffic ahead on I-76. Alternative route suggested.</div>
                </div>
              </div>

              {/* Medical Card Expiring Card */}
              <div className="card dd-message-card dd-medical-warning-card">
                <div className="dd-message-icon ">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                </div>
                <div className="dd-message-content">
                  <div className="dd-message-title">Medical Card Expiring</div>
                  <div className="dd-message-text">Expires in 15 days. Schedule renewal now.</div>
                </div>
              </div>

              {/* Carrier Message Card */}
              <div className="card dd-message-card dd-carrier-message-card">
                <div className="dd-message-icon ">
                  <i className="fa-solid fa-comment"></i>
                </div>
                <div className="dd-message-content">
                  <div className="dd-message-title">Carrier Message</div>
                  <div className="dd-message-text">Great job on the Chicago delivery!</div>
                </div>
              </div>
            </div>

            {/* AI Suggestions Card */}
              <div className="card dd-ai-suggestions-separate-card">
                <div className="dd-section-title">
                  <span>AI Suggestions</span>
                </div>
                <div className="dd-suggestion-item">
                  <div className="dd-suggestion-title">Fuel Stop Recommended</div>
                  <div className="dd-suggestion-text">Pilot at Exit 142 - Best price in 50 miles ahead</div>
                  <button className="dd-suggestion-link">Navigate</button>
                </div>
                <div className="dd-suggestion-item">
                  <div className="dd-suggestion-title">Break Required Soon</div>
                  <div className="dd-suggestion-text">30-min break needed in 45 minutes</div>
                  <button className="dd-suggestion-link">Find Rest Areas</button>
                </div>
              </div>
          </div>
        </div>
      </>
    );
  }

  function ContentView({ activeNav }) {
    switch (activeNav) {
      case 'home':
        return isPostHire ? <PostHireView /> : <HomeView />;
      case 'docs':
        return <DocumentVault isPostHire={isPostHire} setIsPostHire={setIsPostHire} />;
      case 'marketplace':
        return <Marketplace isPostHire={isPostHire} setIsPostHire={setIsPostHire} />;
      case 'carrier':
        return <MyCarrier />;
      case 'hiring':
        return <HiringOnboarding />;
      case 'esign':
        return <ConsentESignature />;
      case 'settings':
        return <AccountSettings />;
      case 'help':
        return <AiHub />;
      default:
        return (
          <div>
            <header className="fp-header">
              <div className="fp-header-titles">
                <h2>{navGroups.flatMap(g => g.items).find(i => i.key === activeNav)?.label || 'View'}</h2>
                <p className="fp-subtitle">This is the {activeNav} view. Only the inner area changes.</p>
              </div>
            </header>
            <section className="fp-grid">
              <div className="card">
                <div className="card-header"><h3>Placeholder</h3></div>
              </div>
            </section>
          </div>
        );
    }
  }

  return (
    <div className={`fp-dashboard-root ${isDarkMode ? 'dark-root' : ''}`}>
      <div className="fp-topbar">
        <div className="topbar-row topbar-row-1">
          <div className="topbar-left">
            <button className="hamburger" aria-label="Open sidebar" onClick={() => setIsSidebarOpen(true)}>
              <i className="fa-solid fa-bars" />
            </button>
            <div className="brand-block">
              <div className="brand-row">
                <div className="logo">
                  <div className="logo">
                                    {/* Desktop / large-screen logo */}
                                    <img src={logo} alt="FreightPower" className="landing-logo-image desktop-logo" />
                                    {/* Responsive compact logo shown at <=768px */}
                                    <img src={resp_logo} alt="FreightPower" className="landing-logo-image mobile-logo" />
                                  </div>
                </div>
                      <div className="user-profile dd-user-profile">
                        <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Marcus Johnson" className="avatar-img user-avatar-desktop dd-avatar-img"/>
                        <div className="user-info user-info-desktop dd-user-info">
                          <div className="user-name">Marcus Johnson</div>
                          <div className="user-role dd-user-role">Pre-Hire Driver</div>
                        </div>
                      </div>

              </div>
            </div>
          </div>

          <div className="topbar-right actions-right dd-actions-right">
            {isPostHire ? (
              /* Post-hire topbar content */
              <>
                <span className="dd-posthire-status">
                  <span className="dd-status-dot dd-all-docs-active" />
                  <span className="dd-status-text">All Docs Active</span>
                </span>
                <span className="dd-posthire-status">
                  <span className="dd-status-text">Available</span>
                  <label className="dd-toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="dd-toggle-slider"></span>
                  </label>
                </span>
                <span className="dd-posthire-status">
                  <i className="fa-regular fa-clock dd-timer-icon" />
                  <span className="dd-status-text">8h 45m left</span>
                </span>
                <div className="dd-notif-bell">
                  <i className="fa-regular fa-bell notif-icon dd-notif-icon" aria-hidden="true" />
                  <span className="dd-notif-badge">3</span>
                </div>
              </>
            ) : (
              /* Pre-hire topbar content */
              <>
                <span className="dd-missing-doc-chip">
                  <span className="missing-doc-dot dd-missing-doc-dot" />
                  <span className="missing-doc-text dd-missing-doc-text">Missing Docs</span>
                </span>
                <div className="dd-notif-bell">
                  <i className="fa-regular fa-bell notif-icon dd-notif-icon" aria-hidden="true" />
                  <span className="dd-notif-badge">3</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`fp-content-row ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <aside className={`fp-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="brand-row">
              <div className="logo"><img src={logo} alt="FreightPower" className="landing-logo-image" /></div>
            </div>
            <div className="ids mobile-ids">
              <div className="mobile-id-line"><span className="id-pair"><span className="id-label">Marcus Johnson</span></span></div>
              <div className="mobile-id-line"><span className="id-pair"><span className="id-label">{isPostHire ? 'Active Driver' : 'Pre-Hire Driver'}</span></span></div>
            </div>
            <div className="chips sidebar-chips">
              {isPostHire ? (
                <>
                  <span className="chip green">All Docs Active</span>
                  <span className="chip blue">Available</span>
                  <span className="chip orange">8h 45m left</span>
                </>
              ) : (
                <span className="chip yellow">Missing Docs</span>
              )}
            </div>
          </div>
          <nav className="fp-nav">
            {navGroups.map((group) => (
              <div className="nav-group" key={group.title}>
                <div className="nav-group-title">{group.title}</div>
                <ul>
                  {group.items.map((item) => (
                    <li
                      className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
                      key={item.key}
                      onClick={() => { setActiveNav(item.key); if (isSidebarOpen) setIsSidebarOpen(false); }}
                      role="button"
                      tabIndex={0}
                    >
                      <i className={`${item.icon} icon`} aria-hidden="true"></i>
                      <span className="label">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="sidebar-dark-control" aria-hidden="false">
            <span className="dark-label">Dark Mode</span>
            <button
              className="dark-toggle"
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

        <main className="fp-main">
          <ContentView activeNav={activeNav} />
        </main>
      </div>
    </div>
  );
}
