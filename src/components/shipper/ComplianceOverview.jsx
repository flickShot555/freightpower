import React from 'react'
import '../../styles/shipper/ShipperDashboard.css'
import '../../styles/shipper/ComplianceOverview.css'

export default function ComplianceOverview(){
  return (
    <div className="co-root">
      <header className="co-header">
        <div className="co-titles">
          <h2>Compliance Overview</h2>
          <div className="co-status-row">
            <div className="int-status-badge active">Fully Compliant</div>
            <div className="muted small">Audit Readiness Score: <strong>94%</strong></div>
            <div className="muted small">Last Verified: Oct 8, 2025 | Next Review: Jan 2026</div>
          </div>
        </div>

        <div className="co-actions">
          <button className="btn small ghost-cd">Sync with FMCSA</button>
          <button className="btn small-cd">Generate Compliance Packet</button>
        </div>
      </header>

      <main className="co-main">
        <div className="co-left">
          <div className="card ffco-ai-actions">
            <h4>AI Next Actions</h4>
            <div className="ai-action-list">
              <div className="ai-action-row">
                <div className="ai-action-left">Renew Cargo Insurance (due in 10 days)</div>
                <div className="ai-action-right"><button className="btn small ghost-cd">Mark Done</button> <button className="btn small ghost-cd">Remind Later</button> <button className="btn small ghost-cd">View Details</button></div>
              </div>
              <div className="ai-action-row">
                <div className="ai-action-left">Confirm BMC-84 Bond renewal with Roanoke</div>
                <div className="ai-action-right"><button className="btn small ghost-cd">Mark Done</button> <button className="btn small ghost-cd">Remind Later</button> <button className="btn small ghost-cd">View Details</button></div>
              </div>
            </div>
          </div>

          <div className="card co-stats-grid">
            <div className="ffco-stat-row" style={{marginBottom: '12px'}}>
              <div className="ffco-stat-card">
                <div className="ffco-stat-title">FMCSA Authority</div>
                <div className="ffco-stat-meta muted">DOT: 3547951 · MC: 1198476</div>
              </div>
              <div className="ffco-stat-card">
                <div className="ffco-stat-title">Insurance</div>
                <div className="ffco-stat-meta muted">Expires: Oct 18, 2025</div>
              </div>
              <div className="ffco-stat-card">
                <div className="ffco-stat-title">Financial</div>
                <div className="ffco-stat-meta muted">Provider: Roanoke Agency</div>
              </div>
            </div>

            <div className="ffco-stat-row">
              <div className="ffco-stat-card">
                <div className="ffco-stat-title">Legal Contracts</div>
                <div className="ffco-stat-meta muted">2 Pending Renewal</div>
              </div>
              <div className="ffco-stat-card">
                <div className="ffco-stat-title">Safety & Audit</div>
                <div className="ffco-stat-meta muted">Status: Passed</div>
              </div>
              <div className="ffco-stat-card">
                <div className="ffco-stat-title">Audit Score</div>
                <div className="ffco-stat-meta muted">94% · Audit-ready (Low Risk)</div>
              </div>
            </div>
          </div>

          <div className="card ffco-identity" style={{marginTop: '12px'}}>
            <h4>Business Identity & Authority</h4>
            <div className="identity-grid">
              <div><strong>Legal Name</strong><div className="muted">FreightPower Logistics LLC</div></div>
              <div><strong>MC Number</strong><div className="muted">1198476</div></div>
              <div><strong>Authority Type</strong><div className="muted">Broker of Property</div></div>
              <div><strong>DBA</strong><div className="muted">FreightPower AI</div></div>
              <div><strong>EIN</strong><div className="muted">82-9376542</div></div>
              <div><strong>FMCSA Status</strong><div className="muted">Active</div></div>
            </div>
            <div className="co-note"><strong>Verification Note:</strong> Authority confirmed with FMCSA API at 10:42 AM. No pending filings.</div>
          </div>

          <div className="card ffco-filings" style={{marginTop: '12px'}}>
            <h4>FMCSA & Government Filings</h4>
            <div className="co-table-wrap">
            <table className="co-table">
              <thead><tr><th>Filing</th><th>Status</th><th>Last Verified</th><th>Source</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td>Broker Authority</td><td><span className='int-status-badge active'>Active</span></td><td>Oct 8</td><td>FMCSA</td><td><i className='fas fa-ellipsis-h'></i></td></tr>
                <tr><td>Operating Status</td><td><span className='int-status-badge active'>Authorized for Property</span></td><td>Oct 8</td><td>FMCSA</td><td><i className='fas fa-ellipsis-h'></i></td></tr>
                <tr><td>BMC-91X Insurance Filing</td><td><span className='int-status-badge pending'>On File</span></td><td>Oct 8</td><td>FMCSA</td><td><i className='fas fa-ellipsis-h'></i></td></tr>
              </tbody>
            </table>
            </div>
            <div className="co-ai-note">
              <span><i className="fas fa-brain"></i></span>
              <div className="ai-text"><strong>AI Suggestion:</strong> Next FMCSA update check scheduled in 5 days.</div>
            </div>
          </div>

          <div className="card ffco-insurance" style={{marginTop: '12px'}}>
            <h4>Insurance & Financial Bond</h4>
            <div className="co-table-wrap">
            <table className="co-table">
              <thead><tr><th>Document</th><th>Provider</th><th>Expiry</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                <tr>
                  <td>Cargo Insurance</td>
                  <td>Travelers</td>
                  <td>Oct 18, 2025</td>
                  <td className="status yellow"><span className="int-status-badge pending">Expiring</span></td>
                  <td><i className='fas fa-ellipsis-h'></i></td>
                </tr>
                <tr>
                  <td>General Liability</td>
                  <td>Progressive</td>
                  <td>2026</td>
                  <td className="status green"><span className="int-status-badge active">Active</span></td>
                  <td><i className='fas fa-ellipsis-h'></i></td>
                </tr>
                <tr>
                  <td>Surety Bond (BMC-84)</td>
                  <td>Roanoke</td>
                  <td>2027</td>
                  <td><span className="int-status-badge Verified">Verified</span></td>
                  <td><i className='fas fa-ellipsis-h'></i></td>
                </tr>
              </tbody>
            </table>
            </div>
            <div className="co-ai-note">
              <span><i className="fas fa-brain"></i></span>
              <div className="ai-text">AI Note: Cargo policy expiring in 10 days. Renewal reminder sent to provider.</div>
            </div>
          </div>
        </div>

        <aside className="co-right">
          <div className="card ffco-right-card">
            <h4>AI Compliance Assistant</h4>

            <div className="assistant-stack">
              <div className="assistant-item"><span className="assistant-emoji"><i className="fas fa-exclamation-circle"></i></span><div className="assistant-body">"1 policy expiring soon (Cargo Insurance)"</div></div>
              <div className="assistant-item"><span className="assistant-emoji"><i className="fas fa-check-circle"></i></span><div className="assistant-body">"All authority filings verified with FMCSA."</div></div>
              <div className="assistant-item"><span className="assistant-emoji"><i className="fas fa-calendar-alt"></i></span><div className="assistant-body">"Next auto-sync scheduled for Oct 10."</div></div>
              <div className="assistant-item"><span className="assistant-emoji"><i className="fas fa-robot"></i></span><div className="assistant-body">"Generate full compliance packet for insurer?"</div></div>
              <div className="assistant-item"><span className="assistant-emoji"><i className="fas fa-circle"></i></span><div className="assistant-body">"Compliance health: 94% — audit-ready."</div></div>
            </div>

            <div className="assistant-actions">
              <button className="btn small-cd">Renew Policy</button>
              <button className="btn small ghost-cd">Generate Packet</button>
              <button className="btn small ghost-cd">Recalculate Score</button>
              <button className="btn small ghost-cd">Share Snapshot</button>
            </div>

            <h5 style={{marginTop:14, fontWeight:600}}>Recent Activity</h5>
            <ul className="ff-recent-activity">
              <li className="ff-activity-item">
                <div className="ff-activity-title">System Sync</div>
                <div className="ff-activity-meta">Oct 8 · AI Agent</div>
                <div className="ff-activity-desc muted">FMCSA snapshot updated</div>
              </li>
              <li className="ff-activity-item">
                <div className="ff-activity-title">Document Verified</div>
                <div className="ff-activity-meta">Oct 8 · Farhan Salad</div>
                <div className="ff-activity-desc muted">Cargo Insurance</div>
              </li>
              <li className="ff-activity-item">
                <div className="ff-activity-title">Renewal Reminder</div>
                <div className="ff-activity-meta">Oct 7 · AI</div>
                <div className="ff-activity-desc muted">Travelers Policy</div>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  )
}
