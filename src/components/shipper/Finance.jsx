import React, { useState, useEffect } from 'react';
import '../../styles/shipper/Finance.css';
import CreateInvoice from './CreateInvoice';
import RateConfirmationPanel from './RateConfirmationPanel';
import { getFinanceSummary, listInvoices } from '../../api/finance';

export default function Finance() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedRange, setSelectedRange] = useState('30 Days');
  const [selectedPartner, setSelectedPartner] = useState('All Partners');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const ranges = ['7 Days', '30 Days', '90 Days', 'Year to Date'];
  const partners = ['All Partners', 'Atlas Freight', 'Prime Logistics', 'Apex'];
  const statuses = ['All Status', 'Paid', 'Pending', 'Overdue'];
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Invoices', 'Payments', 'Factoring', 'Banking'];
  const [showCreateInvoicePage, setShowCreateInvoicePage] = useState(false);
  const [showRatePanel, setShowRatePanel] = useState(false);

  const [financeLoading, setFinanceLoading] = useState(true);
  const [financeError, setFinanceError] = useState('');
  const [invoiceList, setInvoiceList] = useState([]);
  const [summary, setSummary] = useState(null);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount || 0));

  const formatDate = (tsSeconds) => {
    if (!tsSeconds) return '—';
    try {
      return new Date(Number(tsSeconds) * 1000).toLocaleDateString();
    } catch {
      return '—';
    }
  };

  const refresh = async () => {
    setFinanceLoading(true);
    setFinanceError('');
    try {
      const [invRes, sumRes] = await Promise.all([
        listInvoices({ limit: 250 }),
        getFinanceSummary(),
      ]);
      setInvoiceList(invRes?.invoices || []);
      setSummary(sumRes || null);
    } catch (e) {
      setFinanceError(e?.message || 'Failed to load finance data');
    } finally {
      setFinanceLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    function onDocClick() { setOpenDropdown(null); }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  function toggleDropdown(key, e) {
    e.stopPropagation();
    setOpenDropdown(prev => prev === key ? null : key);
  }

  function selectOption(type, value) {
    if (type === 'range') setSelectedRange(value);
    if (type === 'partner') setSelectedPartner(value);
    if (type === 'status') setSelectedStatus(value);
    setOpenDropdown(null);
  }

  return (
    <div className="finance-root">
      {showCreateInvoicePage ? (
        <CreateInvoice onClose={() => setShowCreateInvoicePage(false)} />
      ) : null}
      <header className="fp-header">
        <div className="fp-header-titles">
          <h2>Finance</h2>
        </div>
      </header>

      {/* Controls row: range, partners, status, search, actions */}
      <div className="dv-top-row">
        <div className="dv-controls">
          <div className="dv-search">
            <input placeholder="Search documents (OCR-enabled)" />
          </div>
          <select
            className="sb-carrier-filter-select"
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
          >
            {partners.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            className="sb-carrier-filter-select"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            {ranges.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            className="sb-carrier-filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="finance-top-cards">
        <div className="card finance-card">
          <div className="card-icon"><i className="fa-solid fa-dollar-sign"></i></div>
          <div>
            <div className="muted">Total Invoiced</div>
            <div className="finance-num">{formatCurrency(invoiceList.reduce((s, it) => s + Number(it?.amount_total || 0), 0))}</div>
          </div>
        </div>
        <div className="card finance-card">
          <div className="card-icon"><i className="fa-solid fa-clock"></i></div>
          <div>
            <div className="muted">Pending Invoices</div>
            <div className="finance-num">{formatCurrency(summary?.outstanding_amount || 0)}</div>
          </div>
        </div>
        <div className="card finance-card">
          <div className="card-icon"><i className="fa-solid fa-coins"></i></div>
          <div>
            <div className="muted">Factored Funds</div>
            <div className="finance-num">{formatCurrency(summary?.factoring_outstanding_amount || 0)}</div>
          </div>
        </div>
        <div className="card finance-card">
          <div className="card-icon"><i className="fa-solid fa-bank"></i></div>
          <div>
            <div className="muted">Connected Accounts</div>
            <div className="finance-num">3</div>
          </div>
        </div>
        <div className="card finance-card">
          <div className="card-icon"><i className="fa-solid fa-chart-line"></i></div>
          <div>
            <div className="muted">Cash Flow Trend</div>
            <div className="finance-num green">+7.2%</div>
          </div>
        </div>
      </section>

      {financeError && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 10, marginBottom: 16 }}>
          {financeError}
        </div>
      )}

      <nav className="tabs" role="tablist" aria-label="Finance navigation" style={{marginBottom: '20px'}}>
        {tabs.map(t => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={activeTab === t}
            tabIndex={0}
            className={`tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTab(t); } }}
          >
            {t}
          </button>
        ))}
      </nav>

      {activeTab === 'Overview' ? (
        <div className="finance-main">
          <div className="finance-left">
            <div className="card recent-activity-card">
              <h3>Recent Financial Activity</h3>
              <ul className="financial-list">
                <li className="fin-item positive">
                  <div className="fin-left">
                    <div className="fin-icon success">✔</div>
                    <div>
                      <strong>Payment Received - Atlas Freight</strong>
                      <div className="muted">Load #8231 · ACH Transfer · 2 hours ago</div>
                    </div>
                  </div>
                  <div className="fin-right"><span className="fin-amount">+$1,220</span><div className="muted small">2 hours ago</div></div>
                </li>

                <li className="fin-item positive">
                  <div className="fin-left">
                    <div className="fin-icon purple">▤</div>
                    <div>
                      <strong>Factoring Funded - Apex</strong>
                      <div className="muted">INV-1048 · 90% advance · 4 hours ago</div>
                    </div>
                  </div>
                  <div className="fin-right"><span className="fin-amount">+$3,582</span><div className="muted small">4 hours ago</div></div>
                </li>

                <li className="fin-item negative">
                  <div className="fin-left">
                    <div className="fin-icon warn">!</div>
                    <div>
                      <strong>Invoice Overdue - Prime Logistics</strong>
                      <div className="muted">INV-1042 · Due Oct 5 · 3 days overdue</div>
                    </div>
                  </div>
                  <div className="fin-right"><span className="fin-amount">$2,450</span><div className="muted small">3 days overdue</div></div>
                </li>
              </ul>
            </div>

            <div className="card connected-accounts">
              <h3>Connected Accounts</h3>
              <div className="accounts-row">
                <div className="account-card">
                  <div className="acct-icon"><i className="fa-solid fa-bank"></i></div>
                  <div className="acct-body">
                    <strong>Wells Fargo</strong>
                    <div className="muted small">$12,340 · Last sync: 15m ago</div>
                  </div>
                </div>
                <div className="account-card">
                  <div className="acct-icon"><i className="fa-brands fa-stripe"></i></div>
                  <div className="acct-body">
                    <strong>Stripe</strong>
                    <div className="muted small">$2,480 · Last sync: 5m ago</div>
                  </div>
                </div>
                <div className="account-card">
                  <div className="acct-icon"><i className="fa-solid fa-calculator"></i></div>
                  <div className="acct-body">
                    <strong>QuickBooks</strong>
                    <div className="muted small">Syncing... · In progress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="finance-right">
            <div className="card quick-actions">
              <h4>Quick Actions</h4>
              <button className="btn small-cd" style={{width:'100%',marginBottom:12}} onClick={() => setShowCreateInvoicePage(true)}>Create Invoice</button>
              <button className="btn ghost-cd small" style={{width:'100%',marginBottom:8}} onClick={() => setShowRatePanel(true)}>Generate Rate Confirmation</button>
              <button className="btn ghost-cd small" style={{width:'100%',marginBottom:8}}>Send Payment Reminder</button>
              <button className="btn ghost-cd small" style={{width:'100%'}}>Connect Bank Account</button>
            </div>

            <div className="card ai-box">
              <h4>AI Assistant</h4>
              <p className="muted">3 delivered loads are missing invoices. Would you like me to generate them?</p>
              <button className="btn small ghost-cd dd-btn" style={{marginTop: '10px'}}>Generate All</button>
            </div>
          </aside>
        </div>
      ) : activeTab === 'Invoices' ? (
          <div className="finance-left">
                <div className="invoices-alert">
                <div className="muted">3 delivered loads don't have invoices yet.</div>
                <button className="btn small-cd" onClick={() => setShowCreateInvoicePage(true)}>Create Now</button>
              </div>
            <div className="card invoices-card">
              <div className="table-wrap">
                <table className="invoices-table">
                  <thead>
                    <tr className="headings-table-finance">
                      <th><input type="checkbox"/></th>
                      <th>INVOICE #</th>
                      <th>LOAD #</th>
                      <th>PARTNER</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>DUE DATE</th>
                      <th>PAYMENT TYPE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoiceList || []).map(inv => {
                      const partner = inv?.issuer_role
                        ? `${inv.issuer_role} (${String(inv?.issuer_uid || '').slice(0, 8)}…)`
                        : (String(inv?.issuer_uid || '').slice(0, 8) || '—');
                      const statusLower = String(inv?.status || '').toLowerCase();
                      const status = statusLower === 'paid' ? 'Paid' : statusLower === 'overdue' ? 'Overdue' : 'Pending';
                      const payment = inv?.factoring_enabled ? 'Factoring' : 'Manual';
                      const row = {
                        id: inv?.invoice_number || inv?.invoice_id || '—',
                        load: inv?.load_id || '—',
                        partner,
                        amount: formatCurrency(inv?.amount_total || 0),
                        status,
                        due: formatDate(inv?.due_date),
                        payment,
                      };
                      return (
                      <tr key={row.id} className="invoices-row">
                        <td className="cell"><input type="checkbox"/></td>
                        <td className="cell strong">{row.id}</td>
                        <td className="cell">{row.load}</td>
                        <td className="cell">{row.partner}</td>
                        <td className="cell">{row.amount}</td>
                        <td className="cell">
                          {row.status === 'Paid' && <span className="int-status-badge active">Paid</span>}
                          {row.status === 'Pending' && <span className="int-status-badge pending">Pending</span>}
                          {row.status === 'Overdue' && <span className="int-status-badge revoked">Overdue</span>}
                        </td>
                        <td className="cell">{row.due}</td>
                        <td className="cell">{row.payment}</td>
                        <td className="cell"><i className='fa-solid fa-ellipsis-h'></i></td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="invoices-footer">
                <div className="muted">Showing 1 to 5 of 47 results</div>
                <div className="pagination-buttons">
                  <button className="btn-num">Pre</button>
                  <button className="btn-num-active">1</button>
                  <button className="btn-num">2</button>
                  <button className="btn-num">3</button>
                  <button className="btn-num">Next</button>
                </div>
              </div>
            </div>
        </div>
      ) : activeTab === 'Payments' ? (
        <div className="finance-left">
          <div className="card invoices-card">
            <div className="table-wrap">
              <table className="invoices-table">
                <thead>
                  <tr className="headings-table-finance">
                    <th>PAYMENT #</th>
                    <th>INVOICE #</th>
                    <th>PARTNER</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>METHOD</th>
                    <th>DATE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {id:'PAY-8001', inv:'INV-2091', partner:'Atlas Freight', amount:'$1,240', status:'Completed', method:'ACH', date:'Oct 8'},
                    {id:'PAY-8002', inv:'INV-2092', partner:'FedEx Logistics', amount:'$3,980', status:'Processing', method:'Factoring', date:'Oct 9'},
                    {id:'PAY-8003', inv:'INV-2093', partner:'Prime Carrier', amount:'$2,350', status:'Failed', method:'Manual', date:'Oct 5'},
                  ].map(row => (
                    <tr key={row.id} className="invoices-row">
                      <td className="cell strong">{row.id}</td>
                      <td className="cell">{row.inv}</td>
                      <td className="cell">{row.partner}</td>
                      <td className="cell">{row.amount}</td>
                      <td className="cell"><span className={`int-status-badge ${row.status === 'Completed' ? 'active' : row.status === 'Processing' ? 'pending' : 'revoked'}`}>{row.status}</span></td>
                      <td className="cell">{row.method}</td>
                      <td className="cell">{row.date}</td>
                      <td className="cell"><i className='fa-solid fa-ellipsis-h'></i></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="invoices-footer">
              <div className="muted">Showing 1 to 3 of 3 results</div>
              <div className="pagination-buttons">
                <button className="btn-num">Pre</button>
                <button className="btn-num-active">1</button>
                <button className="btn-num">Next</button>
              </div>
            </div>
          </div>
          <div className="invoices-alert" style={{marginTop: '12px'}}>
                <div >3 delivered loads don't have invoices yet.</div>
                <p>View all</p>
              </div>
              <div className="invoices-alert payment">
                <div className="">3 delivered loads don't have invoices yet.</div>
                <i className='fa-solid fa-close'></i>
              </div>
              <div className="invoices-alert deposit">
                <div className="">3 delivered loads don't have invoices yet.</div>
                <i className='fa-solid fa-close'></i>
              </div>  
        </div>
    ) : activeTab === 'Factoring' ? (
        <div className="factoring-main">
          <div className="finance-left">
            <div className="card">
              <h3>Partner Connections</h3>
              <div className="partner-connections">
                <div className="partner-card">
                  <div className="partner-initials">AP</div>
                  <div className="partner-body">
                    <strong>Apex Factoring</strong>
                    <div className="muted small">Connected since Aug 2024</div>
                  </div>
                  <div className="partner-status connected">Connected</div>
                </div>

                <div className="partner-card">
                  <div className="partner-initials">TR</div>
                  <div className="partner-body">
                    <strong>Triumph Capital</strong>
                    <div className="muted small">Available to connect</div>
                  </div>
                  <div className="partner-status ">Connect</div>
                </div>

                <div className="partner-card">
                  <div className="partner-initials">RT</div>
                  <div className="partner-body">
                    <strong>RTS Financial</strong>
                    <div className="muted small">Available to connect</div>
                  </div>
                  <div className="partner-status">Connect</div>
                </div>

                <div className="partner-card">
                  <div className="partner-initials">OT</div>
                  <div className="partner-body">
                    <strong>OTR Capital</strong>
                    <div className="muted small">Available to connect</div>
                  </div>
                  <div className="partner-status">Connect</div>
                </div>
              </div>
            </div>

            <div className="card" style={{marginTop: '16px'}}>
              <h3>Recent Submissions</h3>
              <div className="table-wrap">
                <table className="invoices-table">
                  <thead>
                    <tr className="headings-table-finance">
                      <th>DATE</th>
                      <th>INVOICE #</th>
                      <th>LOAD #</th>
                      <th>PARTNER</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>FUNDED DATE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {date:'Oct 8', id:'INV-2093', load:8325, partner:'Apex Factoring', amount:'$2,950', status:'Funded', funded:'Oct 9'},
                      {date:'Oct 7', id:'INV-2094', load:8330, partner:'Apex Factoring', amount:'$3,400', status:'Submitted', funded:'—'},
                      {date:'Oct 6', id:'INV-2091', load:8312, partner:'RTS Financial', amount:'$1,820', status:'Pending', funded:'—'},
                      {date:'Oct 5', id:'INV-2089', load:8298, partner:'Apex Factoring', amount:'$4,200', status:'Funded', funded:'Oct 6'},
                      {date:'Oct 4', id:'INV-2087', load:8285, partner:'Apex Factoring', amount:'$2,750', status:'Rejected', funded:'—'},
                    ].map(row => (
                      <tr key={row.id} className="invoices-row">
                        <td className="cell">{row.date}</td>
                        <td className="cell strong">{row.id}</td>
                        <td className="cell">{row.load}</td>
                        <td className="cell">{row.partner}</td>
                        <td className="cell">{row.amount}</td>
                        <td className="cell"><span className={`int-status-badge ${row.status === 'Funded' ? 'active' : row.status === 'Submitted' ? 'pending' : row.status === 'Pending' ? 'pending' : 'revoked'}`}>{row.status}</span></td>
                        <td className="cell">{row.funded}</td>
                        <td className="cell"><i className='fa-solid fa-ellipsis-h'></i></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{marginTop: '16px'}}>
              <h3>AI Insights</h3>
              <div className='ai-insights'>
                <div className="insight warning">
                <div className="insight-text">2 invoices pending &gt;3 days — possible delay with RTS Financial.</div>
                <a href="#" className="action-link">Resolve</a>
              </div>
              <div className="insight success">
                <div className="insight-text">Apex Factoring funded 3 new invoices today ($9,850).</div>
              </div>
              <div className="insight error">
                <div className="insight-text">Detected missing POD for INV-2102 — please attach before submission.</div>
                <a href="#" className="action-link">Fix Now</a>
              </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'Banking' ? (
        <div className="banking-main">
          <div className="finance-left">
            <div className="card" style={{marginBottom: '20px'}}>
              <h3>Connected Accounts</h3>
              <div className="table-wrap">
                <table className="accounts-table">
                  <thead>
                    <tr>
                      <th>BANK / PLATFORM</th>
                      <th>ACCOUNT NAME</th>
                      <th>TYPE</th>
                      <th>BALANCE</th>
                      <th>LAST SYNC</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {bank:'Wells Fargo', acct:'FreightPower Operating', type:'Checking', balance:'$45,230', sync:'5m ago', status:'Connected', action:'View'},
                      {bank:'Stripe Payments', acct:'Payout Account', type:'Digital Wallet', balance:'$12,980', sync:'10m ago', status:'Connected', action:'View'},
                      {bank:'QuickBooks Sync', acct:'Freight Ledger', type:'Integration', balance:'—', sync:'15m ago', status:'Syncing', action:'Manage'},
                    ].map(row => (
                      <tr key={row.acct}>
                        <td>{row.bank}</td>
                        <td>{row.acct}</td>
                        <td><span className="int-status-badge blue" data-type={row.type}>{row.type}</span></td>
                        <td className={`amount ${row.balance && row.balance.startsWith('+') ? 'positive' : ''}`}>{row.balance}</td>
                        <td className="muted small">{row.sync}</td>
                        <td><span className={`int-status-badge ${row.status === 'Connected' ? 'active' : row.status === 'Syncing' ? 'warning' : 'revoked'}`}>{row.status}</span></td>
                        <td><i className='fa-solid fa-ellipsis-h'></i></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h3>Recent Transactions</h3>
              <div className="table-wrap">
                <table className="invoices-table transactions-table">
                  <thead>
                    <tr className="headings-table-finance">
                      <th>DATE</th>
                      <th>PARTNER</th>
                      <th>DESCRIPTION</th>
                      <th>AMOUNT</th>
                      <th>LINKED INVOICE</th>
                      <th>TYPE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {date:'Oct 8', partner:'FedEx Logistics', desc:'Payment Received', amount:'+$3,980', inv:'INV-2092', type:'Credit', status:'Cleared'},
                      {date:'Oct 7', partner:'Apex Factoring', desc:'Advance Payment', amount:'+$2,950', inv:'INV-2093', type:'Credit', status:'Pending'},
                      {date:'Oct 6', partner:'Atlas Freight', desc:'Carrier Payment', amount:'-$1,200', inv:'INV-2091', type:'Debit', status:'Cleared'},
                    ].map(row => (
                      <tr key={row.inv} className="invoices-row">
                        <td className="cell">{row.date}</td>
                        <td className="cell">{row.partner}</td>
                        <td className="cell">{row.desc}</td>
                        <td className={`cell ${row.amount.startsWith('-') ? 'negative' : 'positive'}`}>{row.amount}</td>
                        <td className="cell"><a href="#" className="int-status-badge blue">{row.inv}</a></td>
                        <td className="cell">{row.type}</td>
                        <td className="cell"><span className={`int-status-badge ${row.status === 'Cleared' ? 'active' : 'pending'}`}>{row.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
{/* 
          <div className="banking-ai">
            <div className="ai-card">
              <h5>AI Banking Assistant</h5>
              <p className="muted small">Detected 2 unmatched credits ($4,120). Try auto-linking?</p>
              <button className="btn primary" style={{width:'100%'}}>Auto-link Now</button>
            </div>
          </div> */}
        </div>
      ) : (
        <div className="finance-main empty">
          {/* other tabs intentionally empty for now */}
        </div>
      )}
      {showRatePanel && <RateConfirmationPanel onClose={() => setShowRatePanel(false)} />}
    </div>
  );
}
