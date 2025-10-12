import React, { useState } from 'react';
import TrackingVisibility from './TrackingVisibility';
import DocumentVault from './DocumentVault';
import Finance from './Finance';
import '../../styles/carrier/CarrierDashboard.css';
import '../../styles/shipper/ShipperDashboard.css';
import MyCarriers from './MyCarriers';
import ShipperMarketplace from './ShipperMarketplace';
import ComplianceOverview from './ComplianceOverview';
import AiHub from './AiHub';
import ShipperAnalytics from './Analytics';
import AccountSettings from '../driver/AccountSettings';

export default function ShipperDashboard() {
  const [activeNav, setActiveNav] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarDark, setIsSidebarDark] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navGroups = [
    {
      title: 'OPERATE',
      items: [
        { key: 'home', label: 'Dashboard', icon: 'fa-solid fa-house' },
        { key: 'my-carriers', label: 'My Carriers', icon: 'fa-solid fa-people-group' },
        { key: 'marketplace', label: 'Marketplace', icon: 'fa-solid fa-store' },
        { key: 'tracking', label: 'Tracking & Visibility', icon: 'fa-solid fa-location-crosshairs' },
        { key: 'doc-vault', label: 'Document Vault', icon: 'fa-solid fa-folder' },
      ]
    },
    {
      title: 'MANAGE',
      items: [
        { key: 'finance', label: 'Finance', icon: 'fa-solid fa-wallet' },
        { key: 'compliance', label: 'Compliance', icon: 'fa-solid fa-shield-halved' },
        { key: 'analytics', label: 'Analytics', icon: 'fa-solid fa-chart-column' }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { key: 'settings', label: 'Settings', icon: 'fa-solid fa-gear' },
        { key: 'help', label: 'AI Hub', icon: 'fa-regular fa-circle-question' }
      ]
    }
  ];

  // --- FILTER DROPDOWNS STATE ---
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedCarrier, setSelectedCarrier] = useState('All Carriers');
  const [selectedLane, setSelectedLane] = useState('All Lanes');

  const ranges = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Year to Date'];
  const regions = ['All Regions', 'North', 'South', 'East', 'West', 'Midwest'];
  const carriers = ['All Carriers', 'Swift Transport', 'Reliable Freight', 'Express Logistics'];
  const lanes = ['All Lanes', 'MN → IL', 'TX → AZ', 'FL → GA'];

  // close dropdowns on outside click
  React.useEffect(() => {
    function onDocClick() { setOpenDropdown(null); }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  function HomeView() {
    return (
      <>
        <header className="fp-header">
          <div className="fp-header-controls">
            <button className="btn small">+ Create Load</button>
            <button className="btn ghost">Invite Carrier</button>
            <button className="btn ghost">Upload Document</button>
            <button className="btn ghost">Track Shipments</button>
          </div>
        </header>

        <section className="top-stats">
          <div className="card sd-small-card">
            <div className="sd-small-card-row">
              <h4>Active Loads</h4>
              <i className="fa-solid fa-truck sd-card-icon" aria-hidden="true" />
            </div>
            <div className="big">24</div>
            <div className="small-sub-active">+3 today</div>
          </div>
          <div className="card sd-small-card">
            <div className="sd-small-card-row">
              <h4>On-Time %</h4>
              <i className="fa-solid fa-clock sd-card-icon" aria-hidden="true" />
            </div>
            <div className="big green">96.2%</div>
            <div className="small-sub-time">+1.2%</div>
          </div>
          <div className="card sd-small-card">
            <div className="sd-small-card-row">
              <h4>Carrier Rating</h4>
              <i className="fa-solid fa-star sd-card-icon" aria-hidden="true" />
            </div>
            <div className="big">4.8</div>
            <div className="small-sub-rating">Excellent</div>
          </div>

          <div className="card sd-small-card">
            <div className="sd-small-card-row">
              <h4>Total Revenue</h4>
              <i className="fa-solid fa-dollar-sign sd-card-icon" aria-hidden="true" />
            </div>
            <div className="big">$342K</div>
            <div className="small-sub-revenue">+12% MTD</div>
          </div>
          <div className="card sd-small-card">
            <div className="sd-small-card-row">
              <h4>Compliance</h4>
              <i className="fa-solid fa-shield-halved sd-card-icon" aria-hidden="true" />
            </div>
            <div className="big">94%</div>
            <div className="small-sub-compliance">2 expiring</div>
          </div>
          <div className="card sd-small-card">
            <div className="sd-small-card-row">
              <h4>Pending Tasks</h4>
              <i className="fa-solid fa-list-check sd-card-icon" aria-hidden="true" />
            </div>
            <div className="big">8</div>
            <div className="small-sub-task">3 urgent</div>
          </div>

          <div className="card sd-small-card ai-summary">
            <h4>AI Summary</h4>
            <div className="big">132 loads</div>
          </div>
        </section>

        <section className="fp-filters" style={{display:'flex',gap:12,alignItems:'center',marginBottom:18,flexWrap:'wrap'}}>
          <div className="filter" onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'range' ? null : 'range'); }}>
            <i className="fa-regular fa-calendar" aria-hidden="true"/> <span>{selectedRange}</span> <i className="fa-solid fa-chevron-down chevron"/>
            {openDropdown === 'range' && (
              <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                {ranges.map(r => (
                  <div key={r} className="dropdown-item" onClick={() => { setSelectedRange(r); setOpenDropdown(null); }}>{r}</div>
                ))}
              </div>
            )}
          </div>

          <div className="filter" onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'region' ? null : 'region'); }}>
            <i className="fa-solid fa-earth-americas" aria-hidden="true"/> <span>{selectedRegion}</span> <i className="fa-solid fa-chevron-down chevron"/>
            {openDropdown === 'region' && (
              <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                {regions.map(r => (
                  <div key={r} className="dropdown-item" onClick={() => { setSelectedRegion(r); setOpenDropdown(null); }}>{r}</div>
                ))}
              </div>
            )}
          </div>

          <div className="filter" onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'carrier' ? null : 'carrier'); }}>
            <i className="fa-solid fa-truck" aria-hidden="true"/> <span>{selectedCarrier}</span> <i className="fa-solid fa-chevron-down chevron"/>
            {openDropdown === 'carrier' && (
              <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                {carriers.map(c => (
                  <div key={c} className="dropdown-item" onClick={() => { setSelectedCarrier(c); setOpenDropdown(null); }}>{c}</div>
                ))}
              </div>
            )}
          </div>

          <div className="filter" onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'lane' ? null : 'lane'); }}>
            <i className="fa-solid fa-route" aria-hidden="true"/> <span>{selectedLane}</span> <i className="fa-solid fa-chevron-down chevron"/>
            {openDropdown === 'lane' && (
              <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                {lanes.map(l => (
                  <div key={l} className="dropdown-item" onClick={() => { setSelectedLane(l); setOpenDropdown(null); }}>{l}</div>
                ))}
              </div>
            )}
          </div>

          <div style={{marginLeft:'auto'}} className="search-wrapper">
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              <input placeholder="Search..." />
            </div>
          </div>
        </section>

        <section className="fp-grid" style={{gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
          <div className="card ai-insights">
            <h3>AI Insights</h3>
            <div className="insight">Top Lane Alert<br/>MN → IL averaging $2.95/mi (+8%)</div>
            <ul className="muted">
              <li>Demand spike in Midwest corridors</li>
              <li>Fuel costs stabilizing</li>
            </ul>
          </div>

          <div className="card active-loads">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3>Active Loads</h3>
              <div className="muted">5 of 24</div>
            </div>
            <ul className="active-load-list">
              <li>
                <div className="load-left"><strong>#L2401</strong><div className="muted">Chicago → Atlanta</div></div>
                <div className="load-right"><div className="status ontime">On Time</div><div className="muted small">ETA: 2h 15m</div></div>
              </li>
              <li>
                <div className="load-left"><strong>#L2402</strong><div className="muted">Dallas → Phoenix</div></div>
                <div className="load-right"><div className="status delayed">Delayed</div><div className="muted small">ETA: +45m</div></div>
              </li>
              <li>
                <div className="load-left"><strong>#L2403</strong><div className="muted">Miami → Jacksonville</div></div>
                <div className="load-right"><div className="status delivered">Delivered</div><div className="muted small">30m ago</div></div>
              </li>
            </ul>
          </div>

          <div className="card top-carriers">
            <h3>Top Carriers</h3>
            <ol className="top-carriers">
              <li>
                <div className="carrier-left">
                  <div className="name">Swift Transport</div>
                  <div className="sub muted small">98.5% On-Time</div>
                </div>
                <div className="carrier-right">
                  <span className="rating">4.9★</span>
                  <div className="muted small">42 loads</div>
                </div>
              </li>
              <li>
                <div className="carrier-left">
                  <div className="name">Reliable Freight</div>
                  <div className="sub muted small">96.8% On-Time</div>
                </div>
                <div className="carrier-right">
                  <span className="rating blue">4.8★</span>
                  <div className="muted small">38 loads</div>
                </div>
              </li>
              <li>
                <div className="carrier-left">
                  <div className="name">Express Logistics</div>
                  <div className="sub muted small">95.2% On-Time</div>
                </div>
                <div className="carrier-right">
                  <span className="rating orange">4.7★</span>
                  <div className="muted small">29 loads</div>
                </div>
              </li>
            </ol>
          </div>

          <div className="card performance-card">
            <h3>Performance Health</h3>
            <div className="performance-metrics">
              <div className="metric">
                <strong className="green">Financial</strong>
                <div className="muted">92%</div>
              </div>
              <div className="metric">
                <strong className="blue">Operational</strong>
                <div className="muted">96%</div>
              </div>
            </div>
          </div>

          <div className="card compliance-card">
            <h3>Compliance Status</h3>
            <div className="sd-exp-item pill red">
              <div className="exp-title">Insurance Expiring</div>
              <div className="exp-sub muted">Swift Transport - 3 days</div>
            </div>
            <div className="sd-exp-item pill yellow">
              <div className="exp-title">DOT Audit Due</div>
              <div className="exp-sub muted">Reliable Freight - 7 days</div>
            </div>
          </div>
        </section>
      </>
    );
  }

  function ContentView({ activeNav }) {
    if (activeNav === 'home') return <HomeView />;
    if (activeNav === 'my-carriers') return <MyCarriers />;
    if (activeNav === 'marketplace') return <ShipperMarketplace />;
    if (activeNav === 'tracking') return <TrackingVisibility />;
    if (activeNav === 'doc-vault') return <DocumentVault />;
    if (activeNav === 'finance') return <Finance />;
    if (activeNav === 'compliance') return <ComplianceOverview />;
    if (activeNav === 'settings') return <AccountSettings />;
  if (activeNav === 'help') return <AiHub />;
  if (activeNav === 'analytics') return <ShipperAnalytics />;
    return (
      <div>
        <header className="fp-header">
          <div className="fp-header-titles">
            <h2>{navGroups.flatMap(g => g.items).find(i => i.key === activeNav)?.label || 'View'}</h2>
            <p className="fp-subtitle">This is the {activeNav} view.</p>
          </div>
        </header>
        <section className="fp-grid">
          <div className="card">
            <div className="card-header"><h3>Placeholder</h3></div>
            <div style={{ padding: 20 }}>Content for <strong>{activeNav}</strong> goes here.</div>
          </div>
        </section>
      </div>
    );
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
                  <div className="logo">FreightPower AI</div>
                  {/* Company name placed to the right of the logo (shipper-only) */}
                  <div className="brand-info">
                    <div className="company-name">Atlas Logistics LLC</div>
                    {/* Shipper-only status chips placed below the company name (column) */}
                    <div className="shipper-status">
                      <span className="chip success"><i className="fa-solid fa-check"/> Active & Operating</span>
                      <span className="chip blue"><i className="fa-solid fa-network-wired"/> TMS Connected</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div className="topbar-right actions-right">
            <div className="icons">
              <div className="notif">
                <i className="fa-regular fa-bell notif-icon" aria-hidden="true" />
                <span className="notif-badge">3</span>
              </div>
              <i className="fa-solid fa-robot bot-icon" aria-hidden="true" />
              <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="avatar" className="avatar-img"/>
            </div>
            <div className="icons-mobile">
              <div className="notif">
                <i className="fa-regular fa-bell notif-icon" aria-hidden="true" />
                <span className="notif-badge">3</span>
              </div>
              <i className="fa-solid fa-robot bot-icon" aria-hidden="true" />
              <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="avatar" className="avatar-img"/>
            </div>
          </div>
        </div>
      </div>

      <div className={`fp-content-row ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <aside className={`fp-sidebar ${isSidebarOpen ? 'open' : ''} ${isSidebarDark ? 'dark' : ''}`}>
          <div className="sidebar-header">
            <div className="brand-row">
              <div className="logo">FreightPower AI</div>
            </div>
            <div className="chips sidebar-chips">
              <div className="company-name">Atlas Logistics LLC</div>
              <span className="chip success">Active & Operating</span>
              <span className="chip info">TMS Connected</span>
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

          <div className="sidebar-dark-control">
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
