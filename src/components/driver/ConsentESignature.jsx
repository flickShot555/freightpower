import React, { useState } from 'react';
import '../../styles/driver/ConsentESignature.css';
import SignDocumentModal from './SignDocumentModal';


export default function ConsentESignature() {
  const [activeTab, setActiveTab] = useState('all');
  const [modalDoc, setModalDoc] = useState(null);

  const documents = [
    {
      id: 1,
      title: 'Rate Confirmation - Load #1247',
      category: 'Operational',
      status: 'Pending',
      note: "This is the carrier's rate confirmation for your current load from Chicago to Dallas. Review pickup/delivery details and compensation.",
      carrier: 'Swift Transport',
      due: 'Today'
    },
    {
      id: 2,
      title: 'Background Check Consent',
      category: 'Consent',
      status: 'Unsigned',
      note: 'Authorization for FreightPower to conduct background verification as required by DOT regulations for commercial drivers.',
      carrier: '',
      due: ''
    },
    {
      id: 3,
      title: 'FreightPower Driver Safety Policy',
      category: 'Policy',
      status: 'Signed',
      note: 'Comprehensive safety guidelines and procedures for FreightPower drivers.',
      carrier: '',
      due: '10/05/2025'
    },
    {
      id: 4,
      title: 'Drug & Alcohol Testing Consent',
      category: 'Consent',
      status: 'Pending',
      note: 'Consent for mandatory drug and alcohol testing as required by DOT regulations.',
      carrier: '',
      due: '10/15/2025'
    }
  ];

  const recentActivity = [
    { id: 1, doc: 'FreightPower Driver Safety Policy', category: 'Policy', status: 'Signed', date: '10/05/2025' },
    { id: 2, doc: 'Rate Confirmation - Load #1247', category: 'Operational', status: 'Pending', date: '' },
    { id: 3, doc: 'Background Check Consent', category: 'Consent', status: 'Unsigned', date: '' }
  ];

  const filtered = documents.filter((d) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'operational') return d.category === 'Operational';
    if (activeTab === 'consent') return d.category === 'Consent';
    if (activeTab === 'policy') return d.category === 'Policy';
    return true;
  });

  return (
    <div className="fpdd-consent-root">
        <header className="header-consent-driver">
          <div className="fp-header-titles">
            <h2>Consent & E-Signature</h2>
            <p className="fp-subtitle">Review, sign, and manage your required documents</p>
          </div>
          <div className="fpdd-consent-cta">
          <button className="btn small-cd">Sign All Pending (3)</button>
        </div>
        </header>

      <div className="fpdd-consent-tabs">
        <button className={`fpdd-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Documents</button>
        <button className={`fpdd-tab ${activeTab === 'operational' ? 'active' : ''}`} onClick={() => setActiveTab('operational')}>Operational</button>
        <button className={`fpdd-tab ${activeTab === 'consent' ? 'active' : ''}`} onClick={() => setActiveTab('consent')}>Consent Forms</button>
        <button className={`fpdd-tab ${activeTab === 'policy' ? 'active' : ''}`} onClick={() => setActiveTab('policy')}>Policy & Compliance</button>
        <button className={`fpdd-tab ${activeTab === 'cdl' ? 'active' : ''}`} onClick={() => setActiveTab('cdl')}>CDL Forms</button>
      </div>

      <section className="fpdd-consent-list-area">
        <div className="fpdd-consent-list">
          {filtered.map((d) => (
            <div className="fpdd-consent-card" key={d.id}>
              <div className="fpdd-consent-card-left">
                <div className="fpdd-consent-title-row">
                  <h3>{d.title}</h3>
                  <div className={`int-status-badge ${d.category === 'Operational' ? 'active' : 'Policy' ? 'pending' : 'revoked'}`}>{d.category}</div>
                  <div className={`int-status-badge ${d.status === 'Signed' ? 'active' : d.status === 'Pending' ? 'pending' : 'revoked'}`}>{d.status}</div>
                </div>
                <p className="fpdd-consent-note">{d.note}</p>
                <div className="fpdd-consent-meta">
                  {d.carrier && <span className="fpdd-meta-item">{d.carrier}</span>}
                  {d.due && <span className="fpdd-meta-item">Due: {d.due}</span>}
                </div>
              </div>
              <div className="fpdd-consent-card-right">
                <button className="btn small ghost-cd">View</button>
                <button className="btn small-cd" onClick={() => setModalDoc(d)}>Sign</button>
                <button className="fpdd-more-btn" aria-label="more">⋯</button>
              </div>
            </div>
          ))}
        </div>

        <div className="fpdd-consent-sidebar">
          <div className="fpdd-sidebar-card" style={{ marginTop: '20px' }}>
            <h4>Recent Activity</h4>
            <table className="fpdd-recent-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Signed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((r) => (
                  <tr key={r.id}>
                    <td>{r.doc}</td>
                    <td><span className={`fpdd-recent-cat ${r.category.toLowerCase()}`}>{r.category}</span></td>
                    <td>
                      {r.status === 'Signed' ? (
                        <span className="int-status-badge active">Signed</span>
                      ) : r.status === 'Pending' ? (
                        <span className="int-status-badge pending"> Pending</span>
                      ) : (
                        <span className="int-status-badge revoked">Unsigned</span>
                      )}
                    </td>
                    <td>{r.date || '—'}</td>
                    <td className="fpdd-recent-actions">
                      {r.status === 'Signed' ? (
                        <button className="fpdd-action-btn" aria-label={`open ${r.doc}`}>
                          <i className="fa-solid fa-share-nodes fpdd-action-icon" aria-hidden="true" />
                        </button>
                      ) : (
                        <span className="fpdd-action-empty">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {modalDoc && (
        <SignDocumentModal documentItem={modalDoc} onClose={() => setModalDoc(null)} />
      )}
    </div>
  );
}
