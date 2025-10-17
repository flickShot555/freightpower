import React from 'react';
import AdminShared, { PulsePanel, CarriersTable } from './AdminShared';

export default function Carriers(){
  const cards = [
    { variant:'green', label:'Active Carriers', value:'18', actionLabel:'View', iconClass:'fa-truck' },
    { variant:'yellow', label:'Pending Approvals', value:'4', actionLabel:'Approve', iconClass:'fa-clock' },
    { variant:'red', label:'Flagged', value:'1', actionLabel:'Review', iconClass:'fa-triangle-exclamation' },
    { variant:'blue', label:'Marketplace', value:'7', actionLabel:'Open', iconClass:'fa-store' }
  ];

  return (
    <div>
      <header className="fp-header adm-analytics-header">
          <div className="fp-header-titles">
            <h2>Carriers</h2>
          </div>
        </header>
      <PulsePanel cards={cards} />
      <CarriersTable />
      <div className="ai-summary">
              <div className="ai-summary-left">
                <span className="aai-icon"><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                <div className="aai-text"><strong>AI Summary:</strong> 14 carriers verified by sub admins. 1 auto flagged for missing insurance</div>
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
