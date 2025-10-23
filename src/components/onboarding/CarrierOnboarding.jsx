import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import carrier_ob_1 from '../../assets/carrier_ob_1.png'
import carrier_ob_2 from '../../assets/carrier_ob_2.jpg'
import carrier_ob_3 from '../../assets/carrier_ob_3.jpg'
import './Onboarding.css'
import Chatbot from '../../components/landing_page/Chatbot'
import verification from '../../assets/verification_bg.svg'
import botpic from '../../assets/chatbot.svg'

export default function CarrierOnboarding(){
  const navigate = useNavigate()
  const images = [carrier_ob_1, carrier_ob_2, carrier_ob_3]
  const [currentImg, setCurrentImg] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1..5

  useEffect(()=>{
    const t = setInterval(()=> setCurrentImg(p => (p+1)%images.length), 2500)
    return ()=> clearInterval(t)
  },[])

  const steps = ['Business Info','Owner Information (Optional)','Fleet Information','Compliance','Final Review']

  function handleNext(){
    setCurrentStep(s => Math.min(5, s+1))
  }
  function handleBack(){
    setCurrentStep(s => Math.max(1, s-1))
  }

  return (
  <div className="onboarding-container">
      <aside className="onboarding-steps">
        <div className="logo">LOGO</div>
        <ol>
          {steps.map((s, i) => {
            const step = i+1
            const cls = step === currentStep ? 'active' : step < currentStep ? 'completed' : ''
            return (
              <li key={s} className={cls}>
                <div className="step-num">{step}</div>
                <div className="step-info">
                  <div className="step-title">{s}</div>
                </div>
                <div className="step-arrow">›</div>
              </li>
            )
          })}
        </ol>
      </aside>

      <main className="onboarding-main">
        <img src={verification} alt="Pattern" className="onboarding-pattern-bg"/>
        <div className="onboarding-card">
          <h2>{steps[currentStep-1]}</h2>
          {currentStep === 2 ? (
            <p className="muted">Upload your ID document for faster verification</p>
          ) : currentStep === 3 ? (
            <p className="muted">Please update your fleet information</p>
          ) : currentStep === 4 ? (
            <p className="muted">Please Provide your Compliance Documents</p>
          ) : currentStep === 5 ? (
            <p className="muted">Please review the information you provided before submitting.</p>
          ) : (
            <p className="muted">Please Provide your Business information</p>
          )}

          <form className="onboarding-form" onSubmit={(e)=>e.preventDefault()}>
            {currentStep === 1 && (
              <>
                <label>Company Name</label>
                <input placeholder="Next Role" />

                <label>DOT Number <small className="field-note">(with real-time FMCSA check if possible) <span className='fetch-btn'>Fetch from FMCSA</span></small></label>
                <input placeholder="DOT Number" />

                <label style={{display:'flex', alignItems:'center', gap:8}}>MC Number
                  <button type="button" aria-label="MC info" title="MC info" className="mc-info-btn">?
                  </button>
                </label>
                <input placeholder="MC Number" />
                <div className="mc-subtext">We’ll verify your FMCSA data automatically to speed up approval.</div>

                <label>Tx ID (EIN)</label>
                <input placeholder="Tx ID (EIN)" />

                <label>Company Address</label>
                <input placeholder="Company Address" />

                <div className="row">
                  <div className="col">
                    <label>Contact Email</label>
                    <input placeholder="email@company.com" />
                  </div>
                  <div className="col">
                    <label>Phone <small className="field-note">(optional)</small></label>
                    <input placeholder="+1 (555) 555-5555" />
                  </div>
                </div>

                <div className="divider-line" />
              </>
            )}

            {currentStep === 2 && (
              <>
                <label>Full Name</label>
                <input placeholder="Full name" />

                <label>Title</label>
                <input placeholder="Title" />

                <div style={{display:'flex',gap:12}}>
                  <div style={{flex:1}}>
                    <label>Phone Number<small className='field-note'> (optional)</small></label>
                    <input placeholder="+1 (555) 555-5555" />
                  </div>
                  <div style={{flex:1}}>
                    <label>Email Address<small className='field-note'> (optional)</small></label>
                    <input placeholder="email@company.com" />
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>

              {currentStep === 3 && (
              <>

              <label>Fleet Size</label>
                <input type="number" min="0" placeholder="Number of power units" />

                <label>Equipment Type</label>
                    <select>
                      <option value="dry_van">Dry Van</option>
                      <option value="reefer">Reefer</option>
                      <option value="flatbed">Flatbed</option>
                      <option value="step_deck">Step Deck</option>
                      <option value="other">Other</option>
                    </select>

                <div className="row">
                  <div className="col">
                    <label>Average Truck Model Year</label>
                    <input type="date" />
                  </div>
                  <div className="col">
                    <label>Home Terminal (City, State)</label>
                    <input placeholder="City, State" />
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <label>ELD Provider</label>
                    <input placeholder="ELD provider name" />
                  </div>
                  <div className="col">
                    <label>Factoring Company</label>
                    <input placeholder="Factoring company name" />
                  </div>
                </div>

                <label>Fleet Size</label>
                <input placeholder="Insurance provider name" />

                <div>
                  <label>Preferred Lanes / Routes</label>
                  <textarea placeholder="e.g., I-95 corridor, Midwest regional, TX -> CA lanes" rows={4} />
                </div>

                <div className="divider-line" />
              </>
            )}
              </>
            )}

            {currentStep === 4 && (
              <>
                <label>Broker Carrier Agreement</label>
                <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22, color:'grey'}} aria-hidden="true" /><><br /></>Click to upload or drag and drop</div>

                <label>MC Authority Letter (FMCSA)</label>
                <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22, color:'grey'}} aria-hidden="true" /><><br /></>Click to upload or drag and drop</div>

                <label>Certificate of Insurance (COI)</label>
                <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22, color:'grey'}} aria-hidden="true" /><><br /></>Click to upload or drag and drop</div>

                <label>W9 Form</label>
                <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22, color:'grey'}} aria-hidden="true" /><><br /></>Click to upload or drag and drop</div>

                <label>Voided Check / Bank Letter</label>
                <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22, color:'grey'}} aria-hidden="true" /><><br /></>Click to upload or drag and drop</div>

                <label> Factoring Agreement or Notice of Assignment (if applicable) </label>
                <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22, color:'grey'}} aria-hidden="true" /><><br /></>Click to upload or drag and drop</div>
              </>
            )}

            {currentStep === 5 && (
              <FinalReview onEdit={(s) => setCurrentStep(s)} navigate={navigate} />
            )}

            <div className="onboarding-actions">
              <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={currentStep===1}>Back</button>
              <button type="button" className={"btn btn-primary " + (currentStep===5 ? '' : (true ? 'enabled' : ''))} onClick={currentStep===5?()=>navigate('/carrier-dashboard') : handleNext} disabled={false}>{currentStep===5 ? 'Finish' : 'Next'}</button>
            </div>
          </form>
        </div>

      </main>
      {/* Chat bubble trigger (matches landing page behavior) */}
      <div className="hero-chat-bubble" onClick={() => setIsChatOpen(s => !s)} style={{position: 'fixed', right: 18, bottom: 18, zIndex: 999}}>
        <img src={botpic} alt="AI Assistant" style={{width:42,height:42}} />
      </div>
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

function FinalReview({ onEdit, navigate }){
  // Snapshot basic fields using placeholders/selectors used in the form (non-invasive)
  const get = (sel) => {
    const el = document.querySelector(sel);
    if(!el) return '—';
    if(el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') return el.value || '—';
    return el.textContent || '—';
  }

  const data = {
    company: get('input[placeholder="Next Role"]'),
    dot: get('input[placeholder="DOT Number"]'),
    mc: get('input[placeholder="MC Number"]'),
    ein: get('input[placeholder="Tx ID (EIN)"]'),
    email: get('input[placeholder="email@company.com"]'),
    phone: get('input[placeholder="+1 (555) 555-5555"]'),
    owner: get('input[placeholder="Full name"]'),
    fleetSize: get('input[placeholder="Number of power units"]'),
    equipment: (document.querySelector('select') && document.querySelector('select').value) || '—',
    lanes: get('textarea')
  }

  // Documents list to display
  const docs = [
    {key:'COI', label: 'Certificate of Insurance (COI)'},
    {key:'W9', label: 'W9 Form'},
    {key:'AuthorityLetter', label: 'Authority Letter'},
    {key:'VoidedCheck', label: 'Voided Check / Bank Letter'},
    {key:'FactoringAgreement', label: 'Factoring Agreement'},
    {key:'BrokerAgreement', label: 'Broker Carrier Agreement'},
    {key:'MCAuthority', label: 'MC Authority Letter'},
    {key:'DrugTest', label: 'Drug Test Result'}
  ];

  // Try to infer uploaded filenames from file inputs or nearby text
  function findFilenameForLabel(labelText){
    // search for input[type=file] whose label contains labelText
    const fileInputs = Array.from(document.querySelectorAll('input[type="file"]'));
    for(const fi of fileInputs){
      const id = fi.id;
      if(id){
        const lab = document.querySelector(`label[for="${id}"]`);
        if(lab && lab.textContent && lab.textContent.toLowerCase().includes(labelText.toLowerCase())){
          return fi.files && fi.files[0] ? fi.files[0].name : null;
        }
      }
    }

    // find label nodes that match and look for a following text node with filename
    const labels = Array.from(document.querySelectorAll('label'));
    for(const lab of labels){
      if(lab.textContent && lab.textContent.toLowerCase().includes(labelText.toLowerCase())){
        let sib = lab.nextElementSibling;
        while(sib){
          if(sib.tagName === 'INPUT' && sib.type === 'file') return sib.files && sib.files[0] ? sib.files[0].name : null;
          if(sib.textContent && /\.(png|jpg|jpeg|pdf|doc|docx|gif)/i.test(sib.textContent)) return sib.textContent.trim();
          sib = sib.nextElementSibling;
        }
      }
    }

    // fallback: search upload-box for filename-like text
    const boxes = Array.from(document.querySelectorAll('.upload-box'));
    for(const box of boxes){
      const txt = box.textContent || '';
      const m = txt.match(/([\w-]+\.(png|jpg|jpeg|pdf|docx?|gif))/i);
      if(m) return m[1];
    }

    return null;
  }

  return (
    <div style={{border:'1px solid #eef2f7',borderRadius:8,padding:16,display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>

      </div>

      <section>
        <h4 style={{margin:'8px 0'}}>Business Information</h4>
        <p style={{margin:0}}><strong>Company:</strong> {data.company || '—'}</p>
        <p style={{margin:0}}><strong>DOT:</strong> {data.dot || '—'}</p>
        <p style={{margin:0}}><strong>MC:</strong> {data.mc || '—'}</p>
        <p style={{margin:0}}><strong>EIN:</strong> {data.ein || '—'}</p>
        <p style={{margin:0}}><strong>Email:</strong> {data.email || '—'}</p>
        <p style={{margin:0}}><strong>Phone:</strong> {data.phone || '—'}</p>
      </section>

      <section>
        <h4 style={{margin:'8px 0'}}>Owner / Contact</h4>
        <p style={{margin:0}}><strong>Name:</strong> {data.owner || '—'}</p>
      </section>

      <section>
        <h4 style={{margin:'8px 0'}}>Fleet Information</h4>
        <p style={{margin:0}}><strong>Fleet Size:</strong> {data.fleetSize || '—'}</p>
        <p style={{margin:0}}><strong>Equipment:</strong> {data.equipment || '—'}</p>
        <p style={{margin:0}}><strong>Preferred Lanes:</strong> {data.lanes || '—'}</p>
      </section>

      <section>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h4 style={{margin:'8px 0'}}>Uploaded Documents</h4>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {docs.map(d => {
            const fn = findFilenameForLabel(d.label) || null;
            return (
              <div key={d.key} style={{padding:8,border:'1px solid #f1f5f9',borderRadius:8}}>
                <div style={{fontWeight:700}}>{d.label}</div>
                <div style={{color: fn ? '#064e3b' : '#6b7280'}}>{fn ? `${fn}` : 'Not uploaded'}</div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
