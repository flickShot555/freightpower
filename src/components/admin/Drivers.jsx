import React from 'react'
import '../../styles/admin/UsersRoles.css'
import { PulsePanel } from './AdminShared'

export default function Drivers(){
      const cards = [
    { variant:'green', label:'Verified / Hired Drivers', value:'84', actionLabel:'View List', iconClass:'fa-check' },
    { variant:'yellow', label:'Pre-Hire / Pending Verification', value:'5', actionLabel:'Review', iconClass:'fa-clock' },
    { variant:'red', label:'Compliance Issue / Expiring Docs', value:'2', actionLabel:'Return', iconClass:'fa-triangle-exclamation' },
    { variant:'blue', label:'Marketplace', value:'7', actionLabel:'Open', iconClass:'fa-store' }
  ];

  const drivers = [
    {name:'John Doe', type:'Hired', region:'MN', manager:'Ayaan', status:'Verified', Status: 'active'},
    {name:'Ahmed K.', type:'Pre-Hire', region:'WI', manager:'Yusuf', status:'MVR Expiring', Status: 'warning'   },
    {name:'Sara L.', type:'Hired', region:'MN', manager:'Sara', status:'Background Pending', Status: 'pending'},
    {name:'Brian T.', type:'Pre-Hire', region:'IA', manager:'Ayaan', status:'Ready for Review', Status: 'active'}
  ]

  return (
    <div>
        <header className="fp-header adm-analytics-header">
        <div className="fp-header-titles"><h2>Drivers</h2></div>
      </header>
      <PulsePanel cards={cards} />
        <div className="uo-panel">
      <section className="adm-user-overview">
        <div className="uo-header"><h3 style={{fontWeight:700,fontSize:18}}>Drivers Oversight</h3></div>

        <div className="uo-table-wrap">
          <table className="uo-table carriers-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Type</th>
                <th>Region</th>
                <th>Managed By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d, i) => (
                <tr key={i}>
                  <td className="user-cell"><img src={`https://randomuser.me/api/portraits/men/${30 + i}.jpg`} alt="avatar"/> {d.name}</td>
                  <td>{d.type}</td>
                  <td>{d.region}</td>
                  <td>{d.manager}</td>
                  <td><span className={`int-status-badge ${d.Status}`}>{d.status}</span></td>
                  <td className="carrier-actions"><a className="card-action">View</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="uo-footer"><a className="card-action">Show More Drivers</a></div>
      </section>
    </div>
    <div className="ai-summary">
              <div className="ai-summary-left">
                <span className="aai-icon"><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                <div className="aai-text"><strong>AI Summary:</strong> 24 drivers verified this week. 5 pending Marketplace approval. 2 flagged for expiring MVR checks.</div>
              </div>
              <div className="aai-actions">
                <button className="btn small ghost-cd"><i className="fa fa-check" aria-hidden="true"></i> Confirm All</button>
                <button className="btn small ghost-cd"><i className="fa fa-times" aria-hidden="true"></i> Send Back</button>
                <button className="btn small ghost-cd"><i className="fa fa-file-export" aria-hidden="true"></i> Export Summary</button>
              </div>
            </div>
    </div>
  )
}
