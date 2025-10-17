import React from 'react';
import '../../styles/admin/UsersRoles.css';

function PulseCard({variant, label, value, actionLabel, iconClass}){
  return (
    <div className="pulse-card dark-card">
      <div className="card-top">
        <div className={`pulse-icon ${variant}`}><i className={`fa ${iconClass}`} aria-hidden="true" /></div>
        <a className="card-action">{actionLabel || 'View'}</a>
      </div>
      <div className="card-body">
        <div className="pulse-title">{label}</div>
        <div className="pulse-value">{value}</div>
      </div>
    </div>
  )
}

export default function UsersRoles(){
  return (
    <div className="adm-users-root">
      <section className="adm-system-pulse">
        <header className="fp-header adm-analytics-header">
          <div className="fp-header-titles">
            <h2>Users</h2>
          </div>
        </header>

        <div className="pulse-panel">
          <div className="pulse-cards">
            <PulseCard variant="green" label="Active Users" value="147" actionLabel="View" iconClass="fa-user-check" />
            <PulseCard variant="yellow" label="Pending Approvals" value="6" actionLabel="Approve All" iconClass="fa-clock" />
            <PulseCard variant="red" label="Flagged / Suspended" value="2" actionLabel="Review" iconClass="fa-triangle-exclamation" />
            <PulseCard variant="blue" label="AI Role Suggestions" value="3" actionLabel="Apply" iconClass="fa-brain" />
          </div>
        </div>

        <div className="uo-panel">
          <section className="adm-user-overview">
            <div className="uo-header"><h3 style={{fontWeight: '700', fontSize: '18px'}}>User Overview</h3></div>

            <div className="uo-table-wrap">
              <table className="uo-table">
              <thead>
                <tr><th>User</th><th>Role</th><th>Managed By</th><th>Status</th><th>Last Activity</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td className="user-cell"><img src="https://randomuser.me/api/portraits/men/10.jpg" alt="a"/> Ayaan Abdinur</td>
                  <td>Sub-Admin</td>
                  <td>Farhan Salad</td>
                  <td><span className="int-status-badge active">Active</span></td>
                  <td>2h ago</td>
                  <td ><i className="fa-solid fa-ellipsis-h"></i></td>
                </tr>
                <tr>
                  <td className="user-cell"><img src="https://randomuser.me/api/portraits/men/11.jpg" alt="j"/> John D.</td>
                  <td>Driver</td>
                  <td>Ayaan</td>
                  <td><span className="int-status-badge pending">Pending</span></td>
                  <td>1h ago</td>
                  <td><i className="fa-solid fa-ellipsis-h"></i></td>
                </tr>
                <tr>
                  <td className="user-cell"><img src="https://randomuser.me/api/portraits/men/12.jpg" alt="m"/> Mike L.</td>
                  <td>Carrier Admin</td>
                  <td>Ayaan</td>
                  <td><span className="int-status-badge revoked">Flagged</span></td>
                  <td>4h ago</td>
                  <td><i className="fa-solid fa-ellipsis-h"></i></td>
                </tr>
                <tr>
                  <td className="user-cell"><img src="https://randomuser.me/api/portraits/women/13.jpg" alt="s"/> Sara B.</td>
                  <td>Provider</td>
                  <td>Yusuf</td>
                  <td><span className="int-status-badge active">Active</span></td>
                  <td>3h ago</td>
                  <td><i className="fa-solid fa-ellipsis-h"></i></td>
                </tr>
              </tbody>
              </table>
            </div>

            <div className="uo-footer"><a className="card-action">Load More Users</a></div>
          </section>
        </div>
      </section>
      {/* AI summary banner */}
            <div className="ai-summary">
              <div className="ai-summary-left">
                <span className="aai-icon"><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                <div className="aai-text"><strong>AI Summary:</strong> Sub-Admins resolved 14 requests today. 3 users pending &gt; 24h. 1 suspended account requires compliance review.</div>
              </div>
              <div className="aai-actions">
                <button className="btn small ghost-cd"><i className="fa fa-bolt" aria-hidden="true"></i> View Issues</button>
                <button className="btn small ghost-cd"><i className="fa fa-file-export" aria-hidden="true"></i> Export Summary</button>
              </div>
            </div>
    </div>
  )
}
