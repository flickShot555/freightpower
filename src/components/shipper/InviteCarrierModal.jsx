import React, { useState } from 'react';

export default function InviteCarrierModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="ic-modal-backdrop" role="dialog" aria-modal="true">
      <div className="ic-modal">
        <div className="ic-modal-header">
          <h3>Invite Carrier</h3>
          <button className="ic-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="ic-modal-body">
          <p className="ic-sub">Send an invite to onboard or assign to a load.</p>

          <label className="ic-label">Carrier Email <span className="required">*</span></label>
          <input className="ic-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="carrier@example.com" />

          <label className="ic-label">Carrier Name <span className="muted">(optional)</span></label>
          <input className="ic-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Carrier Company Name" />

          <label className="ic-label">Assign to Load <span className="muted">(optional)</span></label>
          <select className="ic-select"><option>Select a load to assign</option></select>

          <div className="ic-suggestions">
            <div className="ic-suggestions-title">AI Carrier Suggestions</div>
            <div className="ic-suggestion"> 
              <div className="s-left">Midwest Express <div className="s-sub">DOT: 456789</div></div>
              <button className="btn small-cd">Invite</button>
            </div>
            <div className="ic-suggestion"> 
              <div className="s-left">Lone Star Logistics <div className="s-sub">DOT: 789456</div></div>
              <button className="btn small-cd">Invite</button>
            </div>
            <div className="ic-suggestion"> 
              <div className="s-left">Rapid Transit Co <div className="s-sub">DOT: 321654</div></div>
              <button className="btn small-cd">Invite</button>
            </div>
          </div>
        </div>

        <div className="ic-modal-footer">
          <button className="btn small ghost-cd">Copy Invite Link</button>
          <div className="ic-actions">
            <button className="btn small ghost-cd" onClick={onClose}>Cancel</button>
            <button className="btn small-cd" onClick={() => { /* TODO: send invite */ onClose(); }}>Send Invite</button>
          </div>
        </div>
      </div>
    </div>
  );
}
