import React from 'react'
import '../../styles/admin/ComplianceAudit.css'

export default function ComplianceAudit(){
  const entities = [
    {name:'Metro Haul LLC', id:'DOT: 3456789', role:'Carrier', score:92, docs:'7/8', expiry:'2 Exp Soon', status:'Expiring', assigned:'Lisa A.'},
    {name:'Apex Freight', id:'MC: 987654', role:'Broker', score:84, docs:'6/9', expiry:'1 Expired', status:'Expired', assigned:'-'},
    {name:'Reliable Logistics', id:'DOT: 1234567', role:'Carrier', score:100, docs:'9/9', expiry:'—', status:'Verified', assigned:'-'}
  ]

  return (
    <div className="ca-root">
      <header className="fp-header adm-analytics-header">
        <div className="fp-header-titles"><h2>Compliance & Audit</h2></div>
      </header>

      <div className="ca-strip">Platform Compliance 95%. 4 carriers expiring soon, 2 quotes awaiting payment. AI suggests offering 'Insurance Renewal Assistance' to 3 carriers.</div>

      <div className="ca-panel uo-panel">
        <h3>Compliance Entities</h3>
        <div className="uo-table-wrap">
          <table className="uo-table">
            <thead>
              <tr><th>Entity</th><th>Role</th><th>Score</th><th>Docs Valid</th><th>Expiry</th><th>Status</th><th>Assigned To</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {entities.map((e,i)=> (
                <tr key={i}>
                  <td className="user-cell">{e.name}<div className="muted">{e.id}</div></td>
                  <td>{e.role}</td>
                  <td><div className="score-badge">{e.score}</div></td>
                  <td>{e.docs}</td>
                  <td>{e.expiry}</td>
                  <td><span className={`int-status-badge`}>{e.status}</span></td>
                  <td>{e.assigned}</td>
                  <td><div className="actions"><i className="fa-solid fa-eye"/></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ca-support uo-panel">
        <h3>Compliance Support Request Center</h3>
        <div className="ca-stats">
          <div className="ca-box">12<br/><span>Active Requests</span></div>
          <div className="ca-box">67%<br/><span>Quotes Accepted</span></div>
          <div className="ca-box">$2,340<br/><span>Monthly Revenue</span></div>
          <div className="ca-box">18h<br/><span>Avg Resolution</span></div>
        </div>

        <div className="uo-table-wrap" style={{marginTop:12}}>
          <table className="uo-table">
            <thead><tr><th>Request ID</th><th>From</th><th>Role</th><th>Type</th><th>Priority</th><th>Date</th><th>Status</th><th>Assigned To</th><th>Actions</th></tr></thead>
            <tbody>
              <tr><td>#1142</td><td>Metro Haul LLC</td><td>Carrier</td><td>2290 Renewal</td><td>High</td><td>Oct 13</td><td><span className="int-status-badge pending">Pending</span></td><td>—</td><td><i className="fa-solid fa-eye"/></td></tr>
              <tr><td>#1143</td><td>Apex Freight</td><td>Broker</td><td>Audit Prep</td><td>Medium</td><td>Oct 13</td><td><span className="int-status-badge resolved">Paid</span></td><td>Lisa A.</td><td><i className="fa-solid fa-eye"/></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
