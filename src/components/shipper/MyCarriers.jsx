import React, { useState } from 'react';
import '../../styles/shipper/MyCarriers.css';
import InviteCarrierModal from './InviteCarrierModal';
import '../../styles/shipper/InviteCarrierModal.css';

export default function MyCarriers() {
  const tabs = [
    { id: 'all', label: 'All (1,247)' },
    { id: 'active', label: 'Active (1,089)' },
    { id: 'pending', label: 'Pending (43)' },
    { id: 'compliance', label: 'Compliance (27)' },
    { id: 'blocked', label: 'Blocked (15)' }
  ];
  const [activeTab, setActiveTab] = useState('all');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="fp-dashboard-root shipper-mycarriers">
        <header className="fp-header">
          <div className='sd-carrier-row'>
            <div className="fp-header-titles">
            <h2>Carrier</h2>
            <p className="fp-subtitle">Welcome back! Here's what's happening with your fleet today.</p>
          </div>
          <div className="sd-carrier-row-options">
            <button className="btn small-cd" onClick={() => setIsInviteOpen(true)}><i className="fa-solid fa-plus" aria-hidden="true" />Invite Carrier</button>
            <button className="btn small ghost-cd"><i className="fa-solid fa-upload" aria-hidden="true" />Upload Document</button>
            <button className="btn small ghost-cd"><i className="fa-solid fa-download" aria-hidden="true" />Export List</button>
          </div>
          </div>
        </header>

      <section className="cards-row">
        <div className="sd-stat-card">
          <div className="sd-stat-label">Total Carriers</div>
          <div className="sd-stat-value">1,247</div>
          <div className="sd-stat-icon"><i className="fa-solid fa-truck" aria-hidden="true"></i></div>
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-label">Active Carriers</div>
          <div className="sd-stat-value">1,089</div>
          <div className="sd-stat-icon"><i className="fa-solid fa-check" aria-hidden="true"></i></div>
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-label">Pending Invites</div>
          <div className="sd-stat-value">43</div>
          <div className="sd-stat-icon"><i className="fa-solid fa-hourglass" aria-hidden="true"></i></div>
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-label">Compliance Risk</div>
          <div className="sd-stat-value">27</div>
          <div className="sd-stat-icon"><i className="fa-solid fa-exclamation" aria-hidden="true"></i></div>
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-label">Avg Rating</div>
          <div className="sd-stat-value">4.6★</div>
          <div className="sd-stat-icon"><i className="fa-solid fa-star" aria-hidden="true"></i></div>
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-label">Avg On-Time %</div>
          <div className="sd-stat-value">92.4%</div>
          <div className="sd-stat-icon"><i className="fa-solid fa-clock" aria-hidden="true"></i></div>
        </div>
      </section>

      <section className="sb-filters-row">
        <div className="tabs" role="tablist" aria-label="Carrier tabs" style={{marginBottom: '20px'}}>
          {tabs.map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              className={`tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="sb-carrier-controls-row">
          <div className="sb-carrier-filters">
            <select className="sb-carrier-filter-select"><option>All Status</option></select>
            <select className="sb-carrier-filter-select"><option>All Regions</option></select>
            <select className="sb-carrier-filter-select"><option>All Ratings</option></select>
            <select className="sb-carrier-filter-select"><option>Equipment Type</option></select>
            <select className="sb-carrier-filter-select"><option>Compliance</option></select>
          </div>
          <div className="sb-search">
            <input className="sb-search-input" placeholder="Search carriers..." />
          </div>
        </div>
      </section>

      <section className="sb-table-card">
        <div className="sb-table-inner">
        <div className="sb-table-header">
          <div className="th check"><input type="checkbox" /></div>
          <div className="th name">Carrier Name</div>
          <div className="th mc">MC#/DOT</div>
          <div className="th rating">Rating</div>
          <div className="th ontime">On-Time %</div>
          <div className="th loads">Loads</div>
          <div className="th last">Last Load</div>
          <div className="th docs">Docs Valid</div>
          <div className="th equip">Equipment</div>
          <div className="">Actions</div>
        </div>

  <div className="sb-table-row">
          <div className="sb-td check"><input type="checkbox" /></div>
          <div className="sb-td name">
            <div className="avatar">ST</div>
            <div>
              <div className="carrier-title">Swift Transportation</div>
              <div className="carrier-sub muted">Phoenix, AZ</div>
            </div>
          </div>
          <div className="td mc">MC-138549 / 695802</div>
          <div className="td rating">4.8</div>
          <div className="td ontime">94.2%</div>
          <div className="td loads">1,247</div>
          <div className="td last">2 days ago</div>
          <div className="td docs"><span className="int-status-badge active">Valid</span></div>
          <div className="td equip"><span className="int-status-badge blue">Dry Van</span> <span className="int-status-badge blue">Reefer</span></div>
          <div className="td actions"><i className="fa-solid fa-ellipsis-h"></i></div>
        </div>

  <div className="sb-table-row">
          <div className="sb-td check"><input type="checkbox" /></div>
          <div className="sb-td name">
            <div className="avatar">JH</div>
            <div>
              <div className="carrier-title">J.B. Hunt Transport</div>
              <div className="carrier-sub muted">Lowell, AR</div>
            </div>
          </div>
          <div className="td mc">MC-87113 / 395463</div>
          <div className="td rating">4.6</div>
          <div className="td ontime">91.8%</div>
          <div className="td loads">892</div>
          <div className="td last">1 week ago</div>
          <div className="td docs"><span className="int-status-badge warning">Expiring</span></div>
          <div className="td equip"><span className="int-status-badge blue">Dry Van</span> <span className="int-status-badge blue">Flatbed</span></div>
          <div className=""><i className="fa-solid fa-ellipsis-h"></i></div>
        </div>

        </div>
      </section>

      {/* Invite Carrier Modal */}
      <InviteCarrierModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
}
