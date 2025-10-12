import React, { useEffect, useState } from 'react'
import '../../styles/driver/SignDocumentModal.css'

export default function SignDocumentModal({ documentItem, onClose }){
  const [name, setName] = useState(documentItem?.signee || 'John Mitchell')
  const [date, setDate] = useState(new Date().toLocaleDateString())
  const [gpsOn, setGpsOn] = useState(true)

  useEffect(()=>{
    // lock background scroll while modal open
    document.body.classList.add('fpdd-modal-open')
    const onKey = (e) => { if(e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return ()=>{ document.body.classList.remove('fpdd-modal-open'); window.removeEventListener('keydown', onKey) }
  }, [onClose])

  if(!documentItem) return null

  return (
    <div className="fpdd-sig-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="fpdd-sig-modal" onClick={e => e.stopPropagation()}>
        <div className="fpdd-sig-header">
          <div className="fpdd-sig-header-left">
            <div className="fpdd-sig-lock">🔒</div>
            <div className="fpdd-sig-titles">
              <h3>Sign Document</h3>
              <div className="fpdd-sig-doctitle">{documentItem.title || 'Rate Confirmation'}</div>
              <div className="fpdd-sig-subsmall">Legally binding digital signature — ESIGN/UETA compliant</div>
            </div>
          </div>
          <button className="fpdd-sig-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="fpdd-sig-body">
          <div className="fpdd-sig-left">
            <h4 className="fpdd-section-title">Document Preview</h4>
            <div className="fpdd-sig-preview">
              <div className="fpdd-preview-title">RATE CONFIRMATION</div>
              <div className="fpdd-preview-row">Load ID: #{documentItem.id}</div>
              <div className="fpdd-preview-row">Pickup: Chicago, IL → Delivery: Dallas, TX</div>
              <div className="fpdd-preview-row">Rate: $2,450.00</div>
              <div className="fpdd-preview-row">Miles: 925</div>
              <div className="fpdd-preview-row">Pickup Date: Oct 12, 2024</div>
            </div>

            <a className="fpdd-sig-view-full" href="#" onClick={e=>e.preventDefault()}>View Full Document</a>

            <h4 className="fpdd-section-title">Sign Below</h4>
            <div className="fpdd-sig-canvas">
              <div className="fpdd-sig-canvas-lines">
                <div className="line" />
                <div className="line" />
                <div className="line" />
                <div className="line" />
              </div>
              <div className="fpdd-sig-canvas-placeholder">Draw your signature here</div>
            </div>

            <div className="fpdd-sig-canvas-actions">
              <button className="btn small outlines">Clear</button>
              <button className="btn small outlines">Type Name</button>
              <button className="btn small outlines">Upload Image</button>
            </div>

            <div className="fpdd-info-card">
              <div className="fpdd-sig-fields">
                <div className="fpdd-sig-field">
                  <label>Name</label>
                  <input value={name} onChange={e=>setName(e.target.value)} />
                </div>
                <div className="fpdd-sig-field">
                  <label>Date</label>
                  <input value={date} onChange={e=>setDate(e.target.value)} />
                </div>
              </div>

              <div className="fpdd-sig-meta">
                <div className="fpdd-meta-item">Time: {new Date().toLocaleTimeString()}</div>
                <div className="fpdd-meta-item">GPS: 41.8781, -87.6298</div>
                <label style={{marginLeft:'auto'}} className="fpdd-gps-toggle">
                  <input type="checkbox" checked={gpsOn} onChange={e=>setGpsOn(e.target.checked)} />
                  <span className="fpdd-toggle-switch" aria-hidden="true"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="fpdd-sig-footer">
          <button className="btn large primary fpdd-confirm">Confirm &amp; Sign</button>
          <div className="fpdd-sig-secondary" style={{marginTop:12}}>
            <button className="btn outline-dm">Download PDF</button>
            <button className="btn outline-dm">Share / Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
