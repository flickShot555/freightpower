import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { getIdToken } from 'firebase/auth';
import { auth } from '../../firebase';
import { API_URL } from '../../config';
import '../../styles/admin/AdminDashboard.css';
import TrackingVisibility from '../super_admin/TrackingVisibility';
import AdminAnalytics from '../super_admin/AdminAnalytics';
import AiHub from '../super_admin/AiHub';
import IntegrationsManager from '../super_admin/IntegrationsManager';
import '../../styles/super_admin/SuperAdminDashboard.css';
import UsersRoles from '../super_admin/UsersRoles';
import Carriers from '../super_admin/Carriers';
import Drivers from '../super_admin/Drivers';
import Shippers from '../super_admin/Shippers';
import ServiceProviders from '../super_admin/ServiceProviders';
import AdminMarketplace from '../super_admin/AdminMarketplace';
import AdminDocumentVault from '../super_admin/DocumentVault';
import ComplianceAudit from '../super_admin/ComplianceAudit';
import FinanceBilling from '../super_admin/FinanceBilling';
import AdminMessaging from '../super_admin/Messaging';
import Tasks from '../super_admin/Tasks';
import HiringOnboarding from '../super_admin/HiringOnboarding';
import MarketingPromotion from '../super_admin/MarketingPromotion';
import SupportHub from '../super_admin/SupportHub';
import SystemSettings from '../super_admin/SystemSettings';
import AdminApprovals from '../super_admin/AdminApprovals';
import RemovalApprovals from '../super_admin/RemovalApprovals';
import logo from '/src/assets/logo.png';
import resp_logo from '/src/assets/logo_1.png';

export default function SuperAdminDashboard(){
  const navigate = useNavigate();
  const { section } = useParams();

  const [activeNav, setActiveNav] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarDark, setIsSidebarDark] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

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
        { key: 'admin-approvals', label: 'Admin Approvals', icon: 'fa-solid fa-user-check' },
        { key: 'removal-approvals', label: 'Removal Approvals', icon: 'fa-solid fa-user-slash' },
        { key: 'carriers', label: 'Carriers', icon: 'fa-solid fa-truck' },
        { key: 'shippers', label: 'Shippers / Brokers', icon: 'fa-solid fa-people-group' },
        { key: 'drivers', label: 'Drivers', icon: 'fa-solid fa-person' },
        { key: 'service-providers', label: 'Service Providers', icon: 'fa-solid fa-briefcase' },
        { key: 'marketplace', label: 'Marketplace', icon: 'fa-solid fa-store' }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { key: 'document-vault', label: 'Document Vault', icon: 'fa-regular fa-folder' },
        { key: 'compliance-audit', label: 'Compliance & Audit', icon: 'fa-solid fa-shield-halved' },
        { key: 'finance-billing', label: 'Finance & Billing', icon: 'fa-solid fa-dollar-sign' },
        { key: 'marketing', label: 'Marketing & Promotion', icon: 'fa-solid fa-bullhorn' },
        { key: 'messages', label: 'Messages', icon: 'fa-solid fa-comments' },
        { key: 'tasks', label: 'Tasks / To-Do', icon: 'fa-solid fa-list-check' },
        { key: 'hiring', label: 'Hiring & Onboarding', icon: 'fa-solid fa-user-plus' }
      ]
    },
    {
      title: 'SYSTEM & TOOLS',
      items: [
        { key: 'ai-hub', label: 'AI Hub', icon: 'fa-solid fa-robot' },
        { key: 'integrations', label: 'Integrations Manager', icon: 'fa-solid fa-plug' },
        { key: 'support', label: 'Support Hub', icon: 'fa-regular fa-circle-question' },
        { key: 'system-settings', label: 'System Settings', icon: 'fa-solid fa-gear' }
      ]
    }
  ];

  const validNavKeys = useMemo(() => {
    const keys = new Set();
    navGroups.forEach((g) => g.items.forEach((it) => keys.add(it.key)));
    return keys;
  }, []);

  useEffect(() => {
    const next = (section || 'dashboard').toLowerCase();
    setActiveNav(validNavKeys.has(next) ? next : 'dashboard');
  }, [section, validNavKeys]);

  // Controlled access: verify session + role with backend.
  useEffect(() => {
    const run = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/super-admin/login', { replace: true });
          return;
        }

        const idToken = await getIdToken(user);
        const resp = await fetch(`${API_URL}/auth/super-admin/profile`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          await signOut(auth);
          navigate('/super-admin/login', { replace: true, state: { reason: data?.detail || 'Unauthorized' } });
          return;
        }

        if (data?.photo_url) setAvatarUrl(data.photo_url);
      } catch (e) {
        console.warn('SuperAdminDashboard auto-provision failed:', e);
        try {
          await signOut(auth);
        } catch (_) {
          // ignore
        }
        navigate('/super-admin/login', { replace: true });
      }
    };
    run();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/super-admin/login', { replace: true });
  };

  return (
    <div className={`fp-dashboard-root ${isDarkMode ? 'dark-root' : ''}`}>
      <div className="fp-topbar">
        <div className="topbar-row topbar-row-1">
          <div className="topbar-left" style={{display:'flex',alignItems:'center',gap:12}}>
            <button className="hamburger" aria-label="Open sidebar" onClick={() => setIsSidebarOpen(true)}>
              <i className="fa-solid fa-bars" />
            </button>
            <div className="brand-block" style={{display:'flex',alignItems:'center',gap:12}}>
              <div className="logo">
                {/* Desktop / large-screen logo */}
                <img src={logo} alt="FreightPower" className="landing-logo-image desktop-logo" />
                {/* Responsive compact logo shown at <=768px */}
                <img src={resp_logo} alt="FreightPower" className="landing-logo-image mobile-logo" />
              </div>
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

            <div
              className="profile"
              style={{display:'flex',alignItems:'center',gap:8, cursor:'pointer'}}
              onClick={() => navigate('/super-admin/profile')}
              role="button"
              tabIndex={0}
              aria-label="Open profile"
            >
              <img src={avatarUrl || "https://www.gravatar.com/avatar/?d=mp"} alt="avatar" className="avatar-img"/>
              <div className="profile-labels" style={{textAlign:'right'}}>
                <div style={{fontWeight:700}}>Platform Admin</div>
                <div className="muted" style={{fontSize:12}}>Super Admin</div>
                <i className="fa-solid fa-caret-down" />
              </div>
            </div>

            <button
              className="btn small ghost-cd"
              onClick={() => navigate('/super-admin/admin-approvals')}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <i className="fa-solid fa-user-check" aria-hidden="true" />
              Admin Approvals
            </button>

            <button
              className="btn small ghost-cd"
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className={`fp-content-row ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <aside className={`fp-sidebar ${isSidebarOpen ? 'open' : ''} ${isSidebarDark ? 'dark' : ''}`}>
          <div className="sidebar-header">
            <div className="brand-row">
              <div className="logo"><img src={logo} alt="FreightPower" className="landing-logo-image" /></div>
            </div>
            <div className="chips sidebar-chips">
              <span className="chip-cd success">Super Admin</span>
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
                      onClick={() => {
                        setActiveNav(it.key);
                        navigate(`/super-admin/${it.key}`);
                        if (isSidebarOpen) setIsSidebarOpen(false);
                      }}
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
          {activeNav === 'dashboard' && (
            <div>
            <div className="ai-summary" style={{marginBottom: '20px'}}>
              <div className="ai-summary-left">
                <span className="aai-icon"><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                <div className="aai-text">Platform stable — <strong>6 compliance alerts</strong> • <strong>3 pending provider verifications</strong> • <strong>1 flagged marketplace listing</strong>.</div>
              </div>
              <div className="aai-actions">
                <div className="sa-banner-updated">Last updated: 5 min ago</div>
              </div>
            </div>

          <section className="sa-grid">
            <div className="sa-card">
              <div className="sa-card-title"><span><i className='fas fa-brain' style={{marginRight: '10px'}}></i></span>AI System Health</div>
              <div className="sa-card-body">All systems operational<br/><span className=" sa muted">3 compliance alerts &nbsp; 2 flagged providers</span></div>
            </div>

            <div className="sa-card">
              <div className="sa-card-title"><span><i className='fas fa-truck' style={{marginRight: '10px'}}></i></span>Carriers Snapshot</div>
              <div className="sa-card-body big-number">192<br/><span className="sa muted">active carriers • 6 pending verification</span></div>
            </div>

            <div className="sa-card">
              <div className="sa-card-title"><span><i className='fas fa-box' style={{marginRight: '10px'}}></i></span>Shippers & Brokers</div>
              <div className="sa-card-body big-number">74<br/><span className="sa muted">154 loads this week • 5 delayed</span></div>
            </div>

            <div className="sa-card">
              <div className="sa-card-title"><span><i className='fas fa-briefcase' style={{marginRight: '10px'}}></i></span>Service Providers</div>
              <div className="sa-card-body big-number">42<br/><span className="sa muted">active partners • 3 pending onboarding</span></div>
            </div>

            <div className="sa-card">
              <div className="sa-card-title"><span><i className='fas fa-shield-halved' style={{marginRight: '10px'}}></i></span>Compliance Alerts</div>
              <div className="sa-card-body">6 expiring docs<br/>2 violations<br/>1 audit pending</div>
            </div>

            <div className="sa-card">
              <div className="sa-card-title"><span><i className='fas fa-credit-card' style={{marginRight: '10px'}}></i></span>Finance Overview</div>
              <div className="sa-card-body big-number">$184K<br/><span className="sa muted">MTD revenue • 12 unpaid invoices</span></div>
            </div>

            <div className="sa-card">
              <div className="sa-card-title"><span><i className='fas fa-file' style={{marginRight: '10px'}}></i></span>Document Vault</div>
              <div className="sa-card-body">23 new uploads<br/><span className="sa muted">4 unsigned forms</span></div>
            </div>

            <div className="sa-card">
              <div className="sa-card-title"><span><i className='fas fa-store' style={{marginRight: '10px'}}></i></span>Marketplace Activity</div>
              <div className="sa-card-body">11 pending listings<br/><span className="sa muted">3 flagged for review</span></div>
            </div>

            <div className="sa-card sa-card">
              <div className="sa-card-title"><span><i className='fas fa-list-check' style={{marginRight: '10px'}}></i></span>Tasks / Recent Activity</div>
              <div className="sa-card-body">
                <ul className="sa-activity-list">
                  <li>User added</li>
                  <li>Policy uploaded</li>
                  <li>Message sent</li>
                </ul>
              </div>
            </div>
          </section>
          <div className='sa-buttons-btm'>
            <button className='btn small-cd'><i className='fas fa-user-plus'></i>Add User</button>
            <button className='btn small ghost-cd' onClick={() => navigate('/super-admin/admin-approvals')}>
              <i className='fas fa-user-check'></i>Admin Approvals
            </button>
            <button className='btn small ghost-cd'><i className='fas fa-file-export'></i>Export Report</button>
            <button className='btn small ghost-cd'><i className='fas fa-bullhorn'></i>Send Announcement</button>
            <button className='btn small ghost-cd'><i className='fas fa-shield-halved'></i>Open Compliance</button>
          </div>
          </div>
          )}  

          {activeNav === 'tracking' && <TrackingVisibility /> }
          {activeNav === 'analytics' && <AdminAnalytics /> }
          {activeNav === 'users' && <UsersRoles /> }
          {activeNav === 'admin-approvals' && <AdminApprovals /> }
          {activeNav === 'removal-approvals' && <RemovalApprovals /> }
            {activeNav === 'carriers' && <Carriers /> }
            {activeNav === 'drivers' && <Drivers /> }
            {activeNav === 'shippers' && <Shippers /> }
            {activeNav === 'service-providers' && <ServiceProviders /> }
            {activeNav === 'marketplace' && <AdminMarketplace /> }
            {activeNav === 'document-vault' && <AdminDocumentVault /> }
            {activeNav === 'compliance-audit' && <ComplianceAudit /> }
            {activeNav === 'finance-billing' && <FinanceBilling /> }
            {activeNav === 'messages' && (<AdminMessaging /> )}
            {activeNav === 'marketing' && <MarketingPromotion /> }
            {activeNav === 'ai-hub' && <AiHub /> }
            {activeNav === 'integrations' && <IntegrationsManager /> }
            {activeNav === 'tasks' && <Tasks /> }
            {activeNav === 'hiring' && <HiringOnboarding /> }
            {activeNav === 'support' && <SupportHub /> }
            {activeNav === 'system-settings' && <SystemSettings /> }
        </main>
      </div>
    </div>
  );
}
