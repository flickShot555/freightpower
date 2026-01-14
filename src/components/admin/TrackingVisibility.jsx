import React, { useState } from 'react';
import '../../styles/admin/TrackingVisibility.css';
import HereMap from '../common/HereMap';

export default function TrackingVisibility() {
  const [activeTab, setActiveTab] = useState('all');

  const renderFeedItems = () => {
    // Simple switch to show different sample feeds per tab
    if (activeTab === 'carriers') return [
      { title: 'Alpha Freight', meta: '2m ago', tags: ['Carrier','Warning'] }
    ];
    if (activeTab === 'shippers') return [
      { title: 'Midwest Trans', meta: '5m ago', tags: ['Broker','Critical'] }
    ];
    if (activeTab === 'drivers') return [
      { title: 'Driver Ahmed', meta: '10m ago', tags: ['Driver','Needed'] }
    ];
    return [
      { title: 'Alpha Freight', meta: '2m ago', tags: ['Carrier','Warning'] },
      { title: 'Midwest Trans', meta: '5m ago', tags: ['Broker','Critical'] },
      { title: 'Driver Ahmed', meta: '10m ago', tags: ['Driver','Needed'] }
    ];
  };

  const feedItems = renderFeedItems();

  return (
    <div className="admin-tracking-root">
      <div className="tracking-controls">
        <div className="filter-row controls">
          <select className="select" aria-label="Tenant">
            <option>All Tenants</option>
            <option>Alpha Freight</option>
            <option>Midwest Trans</option>
          </select>
          <select className="select" aria-label="Status">
            <option>All Status</option>
            <option>Active</option>
            <option>At Risk / Delayed</option>
          </select>
          <select className="select" aria-label="Region">
            <option>All Regions</option>
            <option>North America</option>
            <option>Europe</option>
          </select>
          <button className="btn small-cd refresh-btn" aria-label="Refresh">⟳</button>
        </div>

        <div className="tabs" style={{marginTop: "15px", marginBottom: "15px"}}>
          <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Activity</button>
          <button className={`tab ${activeTab === 'carriers' ? 'active' : ''}`} onClick={() => setActiveTab('carriers')}>Carriers</button>
          <button className={`tab ${activeTab === 'shippers' ? 'active' : ''}`} onClick={() => setActiveTab('shippers')}>Shippers/Brokers</button>
          <button className={`tab ${activeTab === 'drivers' ? 'active' : ''}`} onClick={() => setActiveTab('drivers')}>Drivers</button>
          <button className={`tab ${activeTab === 'providers' ? 'active' : ''}`} onClick={() => setActiveTab('providers')}>Service Providers</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="card stat"><div className="stat-num">124</div><div className="stat-label">Active Loads</div></div>
        <div className="card stat"><div className="stat-num">8</div><div className="stat-label">At Risk / Delayed</div></div>
        <div className="card stat"><div className="stat-num">3</div><div className="stat-label">Missing Documents</div></div>
        <div className="card stat"><div className="stat-num">5</div><div className="stat-label">Drivers Offline</div></div>
        <div className="card stat"><div className="stat-num">2</div><div className="stat-label">Provider Errors</div></div>
        <div className="card stat"><div className="stat-num">94%</div><div className="stat-label">AI Health Score</div></div>
      </div>

      <div className="tracking-grid">
        <div className="map-card card">
          <div className="card-row"><h3>Live Map</h3></div>
          <HereMap
            containerId="admin-tracking-map"
            center={{ lat: 39.8283, lng: -98.5795 }}
            zoom={4}
            height="500px"
            width="100%"
          />
        </div>

        <aside className="feed-card card">
          <div className="card-row"><h3>Live Activity Feed <div><span className="muted">Last updated: 2 minutes ago</span></div></h3></div>
          <div className="feed-inner">
            <ul className="feed-list">
              {feedItems.map((it, idx) => (
                <li key={idx} className="feed-item">
                  <div>
                    <strong>{it.title}</strong>
                    <div className="muted">{it.meta}</div>
                  </div>
                  <div className="feed-tags">
                    {it.tags.map((t, i) => (
                      <span key={i} className={`int-status-badge ${t.toLowerCase() === 'warning' ? 'disconnected' : t.toLowerCase() === 'critical' ? 'disconnected' : t.toLowerCase() === 'needed' ? 'pending' : 'blue'}`}>{t}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="bottom-summary card">
        <div className="summary-text">Today's AI Summary — 8 delays (+3 from yesterday), 2 offline drivers, 1 integration issue. Average ETA accuracy 92%.</div>
        <button className="btn small-cd">View Analytics</button>
      </div>
    </div>
  );
}
