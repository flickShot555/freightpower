import React from 'react';
import '../../styles/admin/DocumentVault.css';

export default function AdminDocumentVault() {
  return (
    <div className="dv-root admin-dv">
      <header className="fp-header">
        <div className="fp-header-titles">
          <h2>Documents</h2>
        </div>
      </header>

      <div className="dv-top-row">
        <div className="dv-controls">
          <div className="dv-search">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <input placeholder="Search documents (OCR-enabled)" />
          </div>
          <button className="btn small ghost-cd">Filters</button>
          <button className="btn small ghost-cd">Auto-Organize</button>
          <button className="btn small-cd">+ Upload</button>
        </div>
      </div>

      <div className="dv-table-wrap">
        <table className="dv-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Tenant</th>
              <th>Type</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><i className="fa-regular fa-file-pdf file-ic pdf" /> <strong>insurance_certificate.pdf</strong></td>
              <td>Alpha Freight</td>
              <td>Carrier Insurance</td>
              <td><span className="int-status-badge active">Verified</span></td>
              <td>2025-11-01</td>
              <td><i className='fa-solid fa-ellipsis-h'></i></td>
            </tr>

            <tr>
              <td><i className="fa-regular fa-file-pdf file-ic pdf" /> <strong>mvr_report.pdf</strong></td>
              <td>John Doe</td>
              <td>Driver MVR</td>
              <td><span className="int-status-badge warning">Expiring</span></td>
              <td>2025-10-20</td>
              <td><i className='fa-solid fa-ellipsis-h'></i></td>
            </tr>

            <tr>
              <td><i className="fa-regular fa-file-word file-ic doc" /> <strong>broker_contract.docx</strong></td>
              <td>Midwest Logistics</td>
              <td>Agreement</td>
              <td><span className="int-status-badge pending">Pending</span></td>
              <td>—</td>
              <td><i className='fa-solid fa-ellipsis-h'></i></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
