import React, { useEffect, useRef, useState } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import '../../styles/carrier/DocumentVault.css';

const folders = [
  { name: 'Company', count: 12 },
  { name: 'Insurance', count: 8 },
  { name: 'Authority', count: 5 },
  { name: 'Banking', count: 3 },
  { name: 'Safety', count: 15 },
  { name: 'Equipment', count: 22 },
  { name: 'Drivers', count: 18 },
  { name: 'Load Documents', count: 45 },
  { name: 'IFTA / 2290', count: 7 }
];

const docs = [
  { name: 'General Liability COI.pdf', type: 'Insurance', expiry: 'Dec 15, 2024', status: 'Valid', updated: 'Nov 12, 2024' },
  { name: 'MC Authority.pdf', type: 'Authority', expiry: 'Mar 20, 2025', status: 'Expiring Soon', updated: 'Oct 5, 2024' },
  { name: 'Driver CDL - John Smith.pdf', type: 'Driver', expiry: 'Sep 15, 2024', status: 'Expired', updated: 'Aug 20, 2024' }
];

function StatusBadge({ status }) {
  const cls = status === 'Valid' ? 'badge green' : status === 'Expired' ? 'badge red' : 'badge yellow';
  return <span className={cls}>{status}</span>;
}

function RowActions() {
  const isCompact = useMediaQuery('(max-width: 1024px)');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (open && ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  // Desktop: show inline icons. Compact: show ellipsis menu that reveals the same actions.
  const actionsInline = (
    <>
      <button className="action" title="View"><i className="fa-regular fa-eye" aria-hidden="true" /></button>
      <button className="action" title="Download"><i className="fa-solid fa-download" aria-hidden="true" /></button>
      <button className="action" title="Share"><i className="fa-solid fa-share-from-square" aria-hidden="true" /></button>
      <button className="action" title="Refresh"><i className="fa-solid fa-rotate-right" aria-hidden="true" /></button>
    </>
  );

  const actionsPopover = (
    <div className="row-actions-popover" role="menu">
      <button className="action" title="View"><i className="fa-regular fa-eye" aria-hidden="true" /> <span>View</span></button>
      <button className="action" title="Download"><i className="fa-solid fa-download" aria-hidden="true" /> <span>Download</span></button>
      <button className="action" title="Share"><i className="fa-solid fa-share-from-square" aria-hidden="true" /> <span>Share</span></button>
      <button className="action" title="Refresh"><i className="fa-solid fa-rotate-right" aria-hidden="true" /> <span>Refresh</span></button>
    </div>
  );

  if (!isCompact) return actionsInline;

  return (
    <div className="row-actions" ref={ref}>
      <button
        className="row-actions-menu"
        aria-expanded={open}
        aria-label="Show actions"
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((s) => !s); }}
      >
        <i className="fa-solid fa-ellipsis" aria-hidden="true" />
      </button>
      {open && actionsPopover}
    </div>
  );
}

export default function DocumentVault() {
  return (
    <div className="dv-root">
      <header className="fp-header">
        <div className="fp-header-titles">
          <h2>Document Vault</h2>
          <p className="fp-subtitle">Organize and manage your company's documents and compliance files</p>
        </div>
      </header>

          <main className="dv-main">
            {/* Folder cards rendered above the main content (replace left sidebar) */}
            <div className="dv-folders-grid">
              {folders.map((f) => (
                <button key={f.name} className="folder-card" type="button">
                  <div className="folder-card-left">
                    <i className="fa-regular fa-folder" aria-hidden="true"></i>
                    <span className="folder-card-title">{f.name}</span>
                  </div>
                  <div className="folder-card-count">{f.count} docs</div>
                </button>
              ))}
            </div>
        <div className="dv-toprow">
          <div className="dv-breadcrumb">Document Vault <span className="muted">/ All Documents</span></div>
          <div className="dv-actions">
            <button className="btn blue small">Upload Documents</button>
            <button className="btn ghost small">Bulk Download</button>
          </div>
        </div>        

        <div className="dv-dropzone">
          <div className="dv-drop-inner">
            <div className="dv-cloud"><i className="fa-solid fa-cloud-upload" aria-hidden="true" /></div>
            <div className="dv-drop-text">Drag and drop files here</div>
            <div className="dv-drop-sub muted">or click to browse files</div>
          </div>
        </div>

        <div className="dv-table-wrap">
          <table className="dv-table">
            <thead>
              <tr>
                <th className="c-check"><input type="checkbox" /></th>
                <th>File name</th>
                <th>Type</th>
                <th>Expiry date</th>
                <th>Status</th>
                <th>Last updated</th>
                <th className="c-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.name}>
                  <td className="c-check"><input type="checkbox" /></td>
                  <td className="file-name">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="#E74C3C"/></svg>
                    <span>{d.name}</span>
                  </td>
                  <td>{d.type}</td>
                  <td>{d.expiry}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td>{d.updated}</td>
                  <td className="c-actions">
                    <RowActions />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
