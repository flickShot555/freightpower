import React from 'react';
import '../../styles/admin/HiringOnboarding.css';
import '../../styles/admin/Tasks.css';
import AdminShared, { PulsePanel } from './AdminShared';

export default function HiringOnboarding(){
  const stats = [
    { label: 'External Onboardings', value: 32 , icon: 'fa-solid fa-building'},
    { label: 'Internal Hires', value: 6 , icon: 'fa-solid fa-users'},
    { label: 'Missing Documents', value: 14 , icon: 'fa-solid fa-file'},
    { label: 'Pending Signatures', value: 9 , icon: 'fa-solid fa-signature'},
    { label: 'Avg Completion', value: '2.3' , icon: 'fa-solid fa-clock'},
    { label: 'Unread Messages', value: 7 , icon: 'fa-solid fa-envelope'}
  ];

  const rows = [
    { type: 'Carrier', name: 'First 1 Trucking LLC', role: 'Fleet', assigned: 'Amina', missing: '2 (COI, W9)', status: 'Pending', progress: 70 },
    { type: 'Driver', name: 'Jama Ali', role: 'CDL A', assigned: 'Koshin', missing: '1 (Consent)', status: 'Active', progress: 100 },
    { type: 'Internal', name: 'Abdirahman', role: 'Ops Manager', assigned: 'Farhan', missing: '0', status: 'Hired', progress: 100 }
  ];

  const [tab, setTab] = React.useState('all');

  return (
    <div className="admin-hiring-root fp-dashboard-root">
      <div className="ai-summary">
              <div className="ai-summary-left">
                <span className="aai-icon"><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                <div className="aai-text"><strong>AI Summary:</strong> 15 onboardings in progress — 3 missing signatures, 2 inactive, 10 near completion <br /> <span style={{marginTop: '10px', fontWeight: '600'}}>Document Vault • Messaging Center • Compliance Tracker</span> </div>
              </div>
            </div>

      <section className="sstat-row" style={{marginTop: '20px'}}>
        {stats.map((s, i) => (
          <div className="sstat-card card" key={i}>
            <div>
            <div className="sstat-label">{s.label}</div>
            <div className="sstat-value">{s.value}</div>
            </div>
            <div>
                <i className={s.icon}></i>
            </div>
          </div>
        ))}
      </section>

      <div className="tasks-main" style={{marginTop: '12px'}}>
        <div className="tasks-table-wrap">
          <div className="tabs">
            <button className={`tab ${tab==='all' ? 'active' : ''}`} onClick={() => setTab('all')}>All</button>
            <button className={`tab ${tab==='carriers' ? 'active' : ''}`} onClick={() => setTab('carriers')}>Carriers</button>
            <button className={`tab ${tab==='drivers' ? 'active' : ''}`} onClick={() => setTab('drivers')}>Drivers</button>
            <button className={`tab ${tab==='internal' ? 'active' : ''}`} onClick={() => setTab('internal')}>Internal</button>
          </div>

          <div className="uo-table-wrap">
            <table className="tasks-table onboarding-tasks-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name / Company</th>
                  <th>Role</th>
                  <th>Assigned To</th>
                  <th>Missing Docs</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.filter(r => {
                  if(tab === 'all') return true;
                  if(tab === 'carriers') return r.type === 'Carrier';
                  if(tab === 'drivers') return r.type === 'Driver';
                  if(tab === 'internal') return r.type === 'Internal';
                  return true;
                }).map((r, i) => (
                  <tr key={i} className="task-row">
                    <td><span className={`type-badge`}>{r.type}</span></td>
                    <td className="task-title">
                      <div style={{fontWeight:700}}>{r.name}</div>
                      <div style={{fontSize:12, color:'#9aa4b2'}}>DOT: 3847562</div>
                    </td>
                    <td>{r.role}</td>
                    <td>{r.assigned}</td>
                    <td><span className="hi">{r.missing}</span></td>
                    <td><span className={`int-status-badge ${r.status === 'Active' ? 'in-progress' : r.status === 'Pending' ? 'revoked' : 'resolved'}`}>{r.status}</span></td>
                    <td>
                      <div className="progress" style={{width:100, height:8, background:'rgba(163, 163, 163, 1)', borderRadius:8}}>
                        <div className="progress-fill" style={{width:`${r.progress}%`, height:8, borderRadius:8}} />
                      </div>
                    </td>
                    <td>Oct {10 + i}</td>
                    <td><div className="task-actions"><i className="fa-solid fa-ellipsis-h"/></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="tasks-right">
          <div className="team-performance">
            <h4 style={{fontWeight: '700'}}>Onboardings Summary</h4>
            <div className="tp-row"><div className="tp-label">Completed</div><div className="tp-value">32</div></div>
            <div className="tp-row"><div className="tp-label">Pending</div><div className="tp-value">9</div></div>
            <div className="tp-row"><div className="tp-label">Missing Docs</div><div className="tp-value">14</div></div>
          </div>
        </aside>
      </div>

    </div>
  );
}
