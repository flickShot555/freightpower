import React from 'react';
import '../../styles/admin/Notifications.css';

export default function Notifications(){
  const sample = [
    {type:'Document Verification Needed', desc:'Driver John M. has 1 pending signature on Form D-104.', time:'09:14 AM', status:'Unread', priority:'Medium'},
    {type:'Task Assignment', desc:'New compliance review assigned for Carrier Swift LLC.', time:'08:42 AM', status:'Unread', priority:'High'},
    {type:'Onboarding Update', desc:'Driver Sarah K. completed safety training module.', time:'08:15 AM', status:'Read', priority:'Low'},
    {type:'Support Ticket', desc:'New support request from ABC Transport regarding system access.', time:'07:58 AM', status:'Unread', priority:'High'},
    {type:'Message Mention', desc:'You were mentioned in a compliance discussion thread.', time:'07:30 AM', status:'Unread', priority:'Medium'}
  ];

  return (
    <div className="notifications-root">
      <header className="notif-header">
        <div className="notif-stats">
            <div className="sh-stat-card"style={{width: "100%"}}> 
          <div>
            <div className="stat-label">Total Notifications</div>
          <div className="stat-value">128</div>
          </div>
           <div><i className="fas fa-bell"></i></div>  
        </div>
        <div className="sh-stat-card"style={{width: "100%"}}> 
          <div>
            <div className="stat-label">Unread</div>
          <div className="stat-value">14</div>
          </div>
           <div><i className="fas fa-dot-circle"></i></div>  
        </div>
        <div className="sh-stat-card"style={{width: "100%"}}> 
          <div>
            <div className="stat-label">High Priority</div>
          <div className="stat-value">6</div>
          </div>
           <div><i className="fas fa-exclamation"></i></div>  
        </div>
        <div className="sh-stat-card"style={{width: "100%"}}> 
          <div>
            <div className="stat-label">Avg Response Time</div>
          <div className="stat-value">12 min</div>
          </div>
           <div><i className="fas fa-clock"></i></div>  
        </div>
        </div>
      </header>

      <div className="card notifications-list-card">
        <div className="card-header"><h3>Notifications</h3></div>
        <div className="notifications-table-wrap">
          <table className="notifications-table">
            <thead>
              <tr>
                <th></th>
                <th>Type</th>
                <th>Description</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sample.map((n, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td className="nt-type">{n.type}</td>
                  <td className="nt-desc"><div className="nt-main">{n.desc}</div><div className="nt-sub muted">Triggered by system · Priority: {n.priority}</div></td>
                  <td className="nt-time">{n.time}</td>
                  <td className="nt-status"><span className={`int-status-badge ${n.status === 'Unread' ? 'warning' : 'active'}`}>{n.status}</span></td>
                  <td className="nt-actions"><i className='fa fa-ellipsis-h'></i></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="notif-footer">
          <div className="pager">1-25 of 128 <div className='btn small ghost-cd'>Previous</div><div className='btn small ghost-cd'>Next</div></div>
          <div className="auto-archive muted">Auto-archive after 30 days</div>
        </div>
      </div>
    </div>
  )
}
