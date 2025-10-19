import React from 'react';
import '../../styles/shipper/DocumentVault.css';

export default function DocumentVault() {
  return (
    <div className="dv-root">
        <header className="fp-header">
          <div className='sd-carrier-row'>
            <div className="fp-header-titles">
            <h2>Document Vault</h2>
          </div>
          </div>
        </header>
      <div className="dv-top-row">
        <div className="dv-controls">
          <div className="dv-search">
            <input placeholder="Search documents (OCR-enabled)" />
          </div>
          <button className="btn small filter">Filters</button>
          <button className="btn small-cd">Auto-Organize</button>
          <button className="btn small-cd">+ Upload</button>
        </div>
      </div>

      <div className="dv-stats">
        <div className="dv-stat dv-total">
          <i className="dv-stat-icon fa-regular fa-file" aria-hidden="true" />
          <div className="dv-stat-num">2,145</div>
          <div className="dv-stat-label">Total Docs</div>
        </div>
        <div className="dv-stat dv-verified">
            <i className="dv-stat-icon fa-solid fa-circle-check" aria-hidden="true" />
          <div className="dv-stat-num">1,980</div>
          <div className="dv-stat-label">Verified</div>
        </div>
        <div className="dv-stat dv-expiring">
            <i className="dv-stat-icon fa-solid fa-hourglass-half" aria-hidden="true" />
          <div className="dv-stat-num">72</div>
          <div className="dv-stat-label">Expiring Soon</div>
        </div>
        <div className="dv-stat dv-missing">
            <i className="dv-stat-icon fa-solid fa-triangle-exclamation" aria-hidden="true" />
          <div className="dv-stat-num ">15</div>
          <div className="dv-stat-label">Missing/Rejected</div>
        </div>
        <div className="dv-stat dv-week dv-stat-right">
            <i className="dv-stat-icon fa-solid fa-calendar-week" aria-hidden="true" />
          <div className="dv-stat-num">148</div>
          <div className="dv-stat-label">This Week</div>
        </div>
      </div>
      {/* Main content: cards grid + recent activity */}
      <div className="dv-main-grid">
        <div className="dv-cards-grid">
          <div className="dv-card-large">
            <div className="dv-card-icon"><i className="fa-solid fa-building" aria-hidden="true" /></div>
            <div className="dv-card-body">
              <h4>FedEx Logistics</h4>
              <p className="muted">128 files · 5 shared links</p>
              <p className="small-muted">Updated Oct 8</p>
            </div>
          </div>

          <div className="dv-card-large">
            <div className="dv-card-icon"><i className="fa-solid fa-truck" aria-hidden="true" /></div>
            <div className="dv-card-body">
              <h4>Carrier Documents</h4>
              <p className="muted">342 files · 12 expiring</p>
              <p className="small-muted">Fleet insurance, W9s, permits</p>
            </div>
          </div>

          <div className="dv-card-large">
            <div className="dv-card-icon"><i className="fa-solid fa-box" aria-hidden="true" /></div>
            <div className="dv-card-body">
              <h4>Load #2091</h4>
              <p className="muted">24 files · Auto-created</p>
              <p className="small-muted">BOLs, PODs, Rate confirmations</p>
            </div>
          </div>

          <div className="dv-card-large">
            <div className="dv-card-icon"><i className="fa-solid fa-user" aria-hidden="true" /></div>
            <div className="dv-card-body">
              <h4>Driver Documents</h4>
              <p className="muted">156 files · 8 expiring</p>
              <p className="small-muted">Licenses, med cards, training</p>
            </div>
          </div>

          <div className="dv-card-large">
            <div className="dv-card-icon"><i className="fa-solid fa-shield-halved" aria-hidden="true" /></div>
            <div className="dv-card-body">
              <h4>Compliance</h4>
              <p className="muted">89 files · All current</p>
              <p className="small-muted">Audit forms, legal docs</p>
            </div>
          </div>

          <div className="dv-card-large">
            <div className="dv-card-icon"><i className="fa-solid fa-star" aria-hidden="true" /></div>
            <div className="dv-card-body">
              <h4>Favorites</h4>
              <p className="muted">45 files · Bookmarked</p>
              <p className="small-muted">Quick access documents</p>
            </div>
          </div>
        </div>

        <aside className="dv-activity">
          <h4 className='heading-recent-tr' style={{marginBottom: '20px'}}>Recent Activity</h4>
          <ul className="activity-list">
            <li><span className="act-icon"><i className="fa-solid fa-arrow-up" aria-hidden="true" /></span><div><strong>Driver uploaded POD #8389</strong><div className="muted small-muted">10 min ago</div></div></li>
            <li><span className="act-icon"><i className="fa-solid fa-exclamation-triangle" aria-hidden="true" /></span><div><strong>Insurance expiring in 7 days</strong><div className="muted small-muted">Atlas Freight</div></div></li>
            <li><span className="act-icon"><i className="fa-solid fa-envelope" aria-hidden="true" /></span><div><strong>Rate Confirmation sent</strong><div className="muted small-muted">Atlas Freight · 1h ago</div></div></li>
            <li><span className="act-icon"><i className="fa-solid fa-check" aria-hidden="true" /></span><div><strong>Document verified</strong><div className="muted small-muted">BOL #7321 · 2h ago</div></div></li>
          </ul>
        </aside>
      </div>

      {/* Recently added small file cards */}
      <section className="dv-recently-added">
        <h4 className='heading-recent-tr'>Recently Added</h4>
        <div className="dv-file-row">
          <div className="file-card"><div className="file-icon">PDF</div><div className="file-body"><strong>POD_Load_8389.pdf</strong><div className="muted small-muted">Load #8389 · 10 min ago</div></div></div>
          <div className="file-card"><div className="file-icon">INS</div><div className="file-body"><strong>Insurance_Atlas.pdf</strong><div className="muted small-muted">Expires in 7 days</div></div></div>
          <div className="file-card"><div className="file-icon">DOC</div><div className="file-body"><strong>Rate_Conf_902.pdf</strong><div className="muted small-muted">Load #902 · 1h ago</div></div></div>
          <div className="file-card"><div className="file-icon">IMG</div><div className="file-body"><strong>Driver_License.jpg</strong><div className="muted small-muted">John Smith · 2h ago</div></div></div>
        </div>
      </section>
    </div>
  );
}
