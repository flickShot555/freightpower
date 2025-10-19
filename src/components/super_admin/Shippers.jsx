import React from 'react';
import AdminShared, { PulsePanel, CarriersTable } from '../admin/AdminShared';

export default function Shippers(){
  const cards = [
    { variant:'green', label:'Verified Brokers/Shippers', value:'31', actionLabel:'View List', iconClass:'fa-check' },
    { variant:'yellow', label:'Pending Super Admin Review', value:'5', actionLabel:'Review', iconClass:'fa-clock' },
    { variant:'red', label:'Flagged / Escalated Issues', value:'2', actionLabel:'List', iconClass:'fa-triangle-exclamation' },
    { variant:'blue', label:'Marketplace', value:'7', actionLabel:'Open', iconClass:'fa-store' }
  ];

  const sampleRows = [
    {name:'Metro Freight Solutions', mc:'1180456', subAdmin:{img:'https://randomuser.me/api/portraits/men/12.jpg', name:'Yusuf Mohamed'}, status:{text:'Pending Doc Recheck', variant:'warning'}, resolution:'Waiting Approval'},
    {name:'Prime Haul Brokerage', mc:'1132209', subAdmin:{img:'https://randomuser.me/api/portraits/men/10.jpg', name:'Ayaan Abdinur'}, status:{text:'Compliance Violation', variant:'disconnected'}, resolution:'Not Resolved'},
    {name:'CityLink Logistics', mc:'1028341', subAdmin:{img:'https://randomuser.me/api/portraits/women/13.jpg', name:'Sara Hassan'}, status:{text:'Fixed', variant:'active'}, resolution:'Awaiting Confirm'}
  ];

  return (
    <div>
      <header className="fp-header adm-analytics-header">
        <div className="fp-header-titles"><h2>Shippers/Brokers</h2></div>
      </header>
      <PulsePanel cards={cards} />
      <CarriersTable rows={sampleRows} title="Issues Requiring Super Admin Action" firstColLabel="Company Name" />

      <div className="ai-summary">
              <div className="ai-summary-left">
                <span className="aai-icon"><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                <div className="aai-text"><strong>AI Summary:</strong> 5 broker issues fixed by sub admins today. 3 waiting approval. 1 flagged for repeated compliance errors.</div>
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
