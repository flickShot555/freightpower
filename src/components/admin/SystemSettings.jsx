import React, { useState } from 'react';
import '../../styles/admin/SystemSettings.css';

export default function SystemSettings(){
  const [autoSave, setAutoSave] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  return (
    <div className="system-settings-root">
      <header className="fp-header">
        <div className="fp-header-titles">
          <h2>System Settings</h2>
          <p className="fp-subtitle">All settings apply to your account only.</p>
        </div>
      </header>

      <section className="card settings-card">
        <div className="card-header"><h3>General</h3></div>
        <div className="settings-body">
          <div className="settings-grid">
            <div>
              <label className="muted">Language</label>
              <select className="sbd-carrier-filter-select" style={{width:'100%'}}>
                <option>English</option>
              </select>
            </div>
            <div>
              <label className="muted">Time Zone</label>
              <select className="sbd-carrier-filter-select" style={{width:'100%'}}>
                <option>System Auto</option>
              </select>
            </div>
            <div>
              <label className="muted">Date & Time Format</label>
              <div className="dtfmt-list">
                <label><input type="radio" name="dtfmt" defaultChecked /> MM/DD/YYYY</label>
                <label><input type="radio" name="dtfmt" /> DD/MM/YYYY</label>
              </div>
            </div>
            <div>
              <label className="muted">Start Dashboard View</label>
              <select className="sbd-carrier-filter-select" style={{width:'100%'}}>
                <option>Dashboard</option>
              </select>
            </div>
          </div>

          <div className="settings-row">
            <label className="muted">Auto Save Edits</label>
            <label className="fp-toggle">
              <input type="checkbox" checked={autoSave} onChange={(e)=>setAutoSave(e.target.checked)} />
              <span className="switch"><span className="knob"/></span>
            </label>
          </div>

          <div className="settings-row">
            <label className="muted">Enable Email Digest Summary</label>
            <label className="fp-toggle">
              <input type="checkbox" checked={emailDigest} onChange={(e)=>setEmailDigest(e.target.checked)} />
              <span className="switch"><span className="knob"/></span>
            </label>
          </div>
        </div>
      </section>
      <div className="settings-actions">
        <button className="btn ghost-cd small">Cancel</button>
        <button className="btn small-cd">Save All Changes</button>
      </div>
    </div>
  );
}
