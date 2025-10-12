import React from 'react';
import '../../styles/shipper/InvoicePreview.css';

export default function InvoicePreview({ invoice = {}, onClose = () => {} }) {
  const {
    invoiceNumber = 'INV-2101',
    partner = 'FedEx Logistics',
    load = '8327',
    dueDate = 'Oct 30, 2025',
    dateCreated = 'Oct 8, 2025',
    method = 'ACH',
    total = '$3,980.00',
    lineItems = [
      { label: 'Line Haul', amount: '$3,600.00' },
      { label: 'Fuel Surcharge', amount: '$380.00' },
      { label: 'Tax', amount: '$0.00' },
    ],
    documents = [
      { label: 'POD', status: 'Verified' },
      { label: 'Rate Confirmation', status: 'Linked' },
      { label: 'BOL', status: 'Missing Signature' },
    ],
    paymentTimeline = [
      { label: 'Invoice Created', date: 'Oct 8', status: 'done' },
      { label: 'Sent to FedEx Logistics', date: 'Oct 8', status: 'done' },
      { label: 'Submitted to Apex Factoring', date: 'Oct 9', status: 'done' },
      { label: 'Funding in Progress', date: 'Oct 10', status: 'inprogress' },
      { label: 'Payment Received', date: '-', status: 'pending' },
    ],
  } = invoice;

  return (
    <div className="fpip-overlay" onClick={onClose}>
      <div className="fpip-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fpip-header">
          <div>
            <button className="fpip-close"  onClick={onClose} aria-label="Close">×</button>
            <div className="fpip-title">
            <div className="fpip-status fpip-pending">Pending</div>
            <h2>Invoice {invoiceNumber}</h2>
            <div className="fpip-meta">Linked to Load #{load} · {partner}</div>
          </div>
          
          </div>

          <div className="fpip-actions">
            <button className="fpip-btn fpip-ghost">Share</button>
            <button className="fpip-btn fpip-ghost">Download PDF</button>
            <button className="fpip-btn fpip-ghost">Resend</button>
            <button className="fpip-btn fpip-primary">Mark as Paid</button>
          </div>
        </div>

        <div className="fpip-body">
          <div className="fpip-left">
            <section className="fpip-summary fpip-card">
              <h3>Invoice Summary</h3>
              <div className="fpip-summary-grid">
                <div>
                  <div className="fpip-muted">Invoice #</div>
                  <div>{invoiceNumber}</div>

                  <div className="fpip-muted">Partner</div>
                  <div>{partner}</div>

                  <div className="fpip-muted">Due Date</div>
                  <div>{dueDate}</div>

                  <div className="fpip-muted">Method</div>
                  <div>{method}</div>
                </div>

                <div>
                  <div className="fpip-muted">Load #</div>
                  <div>{load}</div>

                  <div className="fpip-muted">Date Created</div>
                  <div>{dateCreated}</div>

                  <div className="fpip-muted">Payment Terms</div>
                  <div>Net 30</div>

                  <div className="fpip-muted">Current Status</div>
                  <div className="fpip-status fpip-pending">Pending Funding</div>
                </div>
              </div>
            </section>

            <section className="fpip-charges fpip-card">
              <h3>Charges & Totals</h3>
              <div className="fpip-charges-list">
                {lineItems.map((li, i) => (
                  <div className="fpip-charge-row" key={i}>
                    <div className="fpip-charge-label">{li.label}</div>
                    <div className="fpip-charge-amount">{li.amount}</div>
                  </div>
                ))}
              </div>
              <div className="fpip-total-row">
                <div>Total Due</div>
                <div className="fpip-total-amount">{total}</div>
              </div>
              <div className="fpip-callout">Payment expected by Oct 30 (3 days remaining).</div>
            </section>

            <section className="fpip-documents fpip-card">
              <div className="fpip-card-header">
                <h3>Documents</h3>
              </div>

              <div className="fpip-documents-list">
                {documents.map((d, i) => (
                  <div className="fpip-doc-row" key={i}>
                    <div className="fpip-doc-left">
                      <div>
                        <div className="fpip-doc-label">{d.label}</div>
                        <div className="fpip-doc-meta fpip-muted">{d.status}</div>
                      </div>
                    </div>
                    <div className="fpip-doc-actions">
                      <a>View</a>
                      <a>Download</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="fpip-notes fpip-card">
              <h3>Notes / Internal Comments</h3>
              <textarea className="fpip-notes-box" defaultValue={"Delivered on time, verified POD signature. Awaiting factoring deposit."} />
              <div className="fpip-notes-actions">
                <button className="fpip-btn">Save Note</button>
              </div>
            </section>
          </div>

          <aside className="fpip-right">
            <section className="fpip-timeline fpip-card">
              <h4>Payment & Factoring Timeline</h4>
              <ul className="fpip-timeline-list">
                {paymentTimeline.map((pt, i) => (
                  <li key={i} className={`fpip-timeline-item ${pt.status}`}>
                    <div className="fpip-dot" />
                    <div className="fpip-tl-content">
                      <div className="fpip-tl-label">{pt.label}</div>
                      <div className="fpip-tl-date fpip-muted">{pt.date}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="fpip-live fpip-card">
              <h4>Live Payment Info</h4>
              <div className="fpip-live-row"><div className="fpip-muted">Payment Method</div><div>ACH (Wells Fargo)</div></div>
              <div className="fpip-live-row"><div className="fpip-muted">Bank Reference ID</div><div>#WFX-98347</div></div>
              <div className="fpip-live-row"><div className="fpip-muted">Amount Received</div><div>—</div></div>
              <div className="fpip-live-row"><div className="fpip-muted">Expected Funding</div><div>Oct 11 2025</div></div>
            </section>

            <section className="fpip-quick fpip-card">
              <h4>Quick Actions</h4>
              <div className="fpip-qa-grid">
                <button className="fpip-btn">Download PDF</button>
                <button className="fpip-btn">Share Link</button>
                <button className="fpip-btn">Resend</button>
                <button className="fpip-btn">Mark Paid</button>
                <button className="fpip-btn">Send to Factoring</button>
                <button className="fpip-btn">Save to Vault</button>
              </div>
            </section>

            <section className="fpip-audit fpip-card">
              <h4>Audit & Activity Log</h4>
              <ul className="fpip-audit-list">
                <li className="fpip-audit-item">
                  <span className="fpip-dot-teal" />
                  <div className="fpip-audit-left">
                    <div className="fpip-audit-title">Created Invoice</div>
                    <div className="fpip-audit-sub">Farhan S.</div>
                  </div>
                  <div className="fpip-audit-date">Oct 8 10:42 AM</div>
                </li>

                <li className="fpip-audit-item">
                  <span className="fpip-dot-teal" />
                  <div className="fpip-audit-left">
                    <div className="fpip-audit-title">Sent Email to FedEx</div>
                    <div className="fpip-audit-sub">System</div>
                  </div>
                  <div className="fpip-audit-date">Oct 8 10:43 AM</div>
                </li>

                <li className="fpip-audit-item">
                  <span className="fpip-dot-teal" />
                  <div className="fpip-audit-left">
                    <div className="fpip-audit-title">Matched Bank Deposit</div>
                    <div className="fpip-audit-sub">AI Agent</div>
                  </div>
                  <div className="fpip-audit-date">Oct 9 09:05 AM</div>
                </li>

                <li className="fpip-audit-item">
                  <span className="fpip-dot-teal" />
                  <div className="fpip-audit-left">
                    <div className="fpip-audit-title">Confirmed Funding</div>
                    <div className="fpip-audit-sub">Apex Factoring</div>
                  </div>
                  <div className="fpip-audit-date">Oct 9 10:00 AM</div>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
