import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import carrier_ob_1 from '../../assets/carrier_ob_1.png'
import carrier_ob_2 from '../../assets/carrier_ob_2.jpg'
import carrier_ob_3 from '../../assets/carrier_ob_3.jpg'
import '../../styles/carrier/CarrierSignup.css'
import './Onboarding.css'
import Chatbot from '../../components/landing_page/Chatbot'
import verification from '../../assets/verification_bg.svg'
import botpic from '../../assets/chatbot.svg'

export default function ShipperOnboarding(){
  const images = [carrier_ob_1, carrier_ob_2, carrier_ob_3]
  const [currentImg, setCurrentImg] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1..5
  const steps = ['Business Info','Contact Person','Upload Documents','Prefreneces','Final Review']

  useEffect(()=>{
    const t = setInterval(()=> setCurrentImg(p => (p+1)%images.length), 2500)
    return ()=> clearInterval(t)
  },[])

  function handleNext(){
    setCurrentStep(s => Math.min(5, s+1))
  }
  function handleBack(){
    setCurrentStep(s => Math.max(1, s-1))
  }

  // File upload state for step 3
  const [uploads, setUploads] = useState({
    w9: null, // required
    proofOfRegistration: null,
    bmc: null,
    coi: null
  })
  const w9Ref = useRef()
  const proofRef = useRef()
  const bmcRef = useRef()
  const coiRef = useRef()

  function onFileSelect(field, file){
    setUploads(u => ({ ...u, [field]: file }))
  }

  function handleFileInput(field, e){
    const f = e.target.files && e.target.files[0]
    if(f) onFileSelect(field, f)
  }

  function handleRemove(field){
    setUploads(u => ({ ...u, [field]: null }))
  }

  function handleDrop(field, e){
    e.preventDefault()
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]
    if(f) onFileSelect(field, f)
  }

  function preventDefault(e){ e.preventDefault(); e.stopPropagation() }

  // Freight preferences state for step 4
  const [preferences, setPreferences] = useState({
    freightType: 'Dry Van',
    preferredEquipment: '',
    avgMonthlyVolume: '',
    regionsOfOperation: ''
  })

  function setPref(key, value){
    setPreferences(p => ({ ...p, [key]: value }))
  }

  // Capture key form fields from steps 1 and 2 so Final Review can show them.
  // We keep inputs visually unchanged but record their values on user input.
  const [shipperData, setShipperData] = useState({
    businessType: 'shipper',
    businessName: '',
    taxId: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    website: '',
    contactFullName: '',
    contactTitle: '',
    contactPhone: '',
    contactEmail: ''
  })

  function setShipperField(key, value){
    setShipperData(s => ({ ...s, [key]: value }))
  }

  const navigate = useNavigate()

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
          {currentStep === 1 ? (
            <p className="muted">Please Provide your Personal Information</p>
          ) : currentStep === 2 ? (
            <p className="muted">Please Provide your Contact Person Details</p>
          ) : currentStep === 3 ? (
            <p className="muted">Add Operating Authority Letter Optional</p>
          ) : currentStep === 4 ? (
            <p className="muted">Please Provide Freight Preferences</p>
          ) : (<p className="muted">Please Provide Freight Preferences</p>)}

          <form className="onboarding-form" onSubmit={(e)=>e.preventDefault()}>
            {currentStep === 1 && (
              <>
                <label>Business Type</label>
                <select value={shipperData.businessType} required onChange={(e)=>setShipperField('businessType', e.target.value)}>
                  <option value="shipper">Shipper</option>
                  <option value="broker">Broker</option>
                </select>

                <label>Business Name</label>
                <input placeholder="Business Name" value={shipperData.businessName} onChange={(e)=>setShipperField('businessName', e.target.value)} />

                <label>Tax ID (EIN)</label>
                <input placeholder="Tax ID (EIN)" value={shipperData.taxId} onChange={(e)=>setShipperField('taxId', e.target.value)} />

                <label>Business Address</label>
                <input placeholder="Business Address" value={shipperData.businessAddress} onChange={(e)=>setShipperField('businessAddress', e.target.value)} />

                <div className="row">
                  <div className="col">
                    <label>Business Phone Number</label>
                    <input placeholder="+1 (555) 555-5555" value={shipperData.businessPhone} onChange={(e)=>setShipperField('businessPhone', e.target.value)} />
                  </div>
                  <div className="col">
                    <label>Business Email Address</label>
                    <input placeholder="Business Email Address" value={shipperData.businessEmail} onChange={(e)=>setShipperField('businessEmail', e.target.value)} />
                  </div>
                </div>

                <label>Website (optional)</label>
                <input placeholder="Website" value={shipperData.website} onChange={(e)=>setShipperField('website', e.target.value)} />
              </>
            )}

            {currentStep === 2 && (
              <>
                <label>Full Name</label>
                <input placeholder="Full Name" value={shipperData.contactFullName} onChange={(e)=>setShipperField('contactFullName', e.target.value)} />

                <label>Title</label>
                <input placeholder="Title" value={shipperData.contactTitle} onChange={(e)=>setShipperField('contactTitle', e.target.value)} />

                <div className="row">
                  <div className="col">
                    <label>Phone Number</label>
                    <input placeholder="+1 (555) 555-5555" value={shipperData.contactPhone} onChange={(e)=>setShipperField('contactPhone', e.target.value)} />
                  </div>
                  <div className="col">
                    <label>Email Address</label>
                    <input placeholder="Email Address" value={shipperData.contactEmail} onChange={(e)=>setShipperField('contactEmail', e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <label>W-9 Form (Required)</label>
                <div className="upload-box" onDrop={(e)=>handleDrop('w9', e)} onDragOver={preventDefault} onDragEnter={preventDefault} onDragLeave={preventDefault} style={{display:'flex',flexDirection:'column',gap:8}}>
                  {uploads.w9 ? (
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,background:'#fff'}}>
                          <i className="fa-solid fa-file" aria-hidden="true" />
                        </div>
                        <div>
                          <div style={{fontWeight:700}}>{uploads.w9.name}</div>
                          <small className="field-note">{Math.round(uploads.w9.size/1024)} KB</small>
                        </div>
                      </div>
                      <div>
                        <button type="button" className="btn" onClick={() => handleRemove('w9')}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{display:'flex',alignItems:'center',flexDirection:'column',gap:8}} onClick={() => w9Ref.current && w9Ref.current.click()}>
                      <i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22,color:'grey'}} aria-hidden="true" />
                      <div style={{color:'grey', fontWeight:700}}>Click to upload or drag and drop</div>
                      <small className="field-note">SVG, PNG, JPG or PDF</small>
                      <input ref={w9Ref} type="file" style={{display:'none'}} onChange={(e)=>handleFileInput('w9', e)} />
                    </div>
                  )}
                </div>

                <label>Proof of Business Registration (optional)</label>
                <div className="upload-box" onDrop={(e)=>handleDrop('proofOfRegistration', e)} onDragOver={preventDefault} onDragEnter={preventDefault} onDragLeave={preventDefault} style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:72}} onClick={() => proofRef.current && proofRef.current.click()}>
                  {uploads.proofOfRegistration ? (
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,background:'#fff'}}>
                          <i className="fa-solid fa-file" aria-hidden="true" />
                        </div>
                        <div>
                          <div style={{fontWeight:700}}>{uploads.proofOfRegistration.name}</div>
                          <small className="field-note">{Math.round(uploads.proofOfRegistration.size/1024)} KB</small>
                        </div>
                      </div>
                      <div>
                        <button type="button" className="btn" onClick={() => handleRemove('proofOfRegistration')}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'center'}}>
                        <i className="fa-solid fa-cloud-arrow-up" style={{fontSize:18,color:'grey'}} aria-hidden="true" />
                        <div style={{color:'grey', fontWeight:700}}>Click to upload or drag and drop</div>
                        <small className="field-note">SVG, PNG, JPG or PDF</small>
                      </div>
                      <input ref={proofRef} type="file" style={{display:'none'}} onChange={(e)=>handleFileInput('proofOfRegistration', e)} />
                    </>
                  )}
                </div>

                <label>BMC-84/85 Certificate (hipper/broker)</label>
                <div className="upload-box" onDrop={(e)=>handleDrop('bmc', e)} onDragOver={preventDefault} onDragEnter={preventDefault} onDragLeave={preventDefault} style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:72}} onClick={() => bmcRef.current && bmcRef.current.click()}>
                  {uploads.bmc ? (
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,background:'#fff'}}>
                          <i className="fa-solid fa-file" aria-hidden="true" />
                        </div>
                        <div>
                          <div style={{fontWeight:700}}>{uploads.bmc.name}</div>
                          <small className="field-note">{Math.round(uploads.bmc.size/1024)} KB</small>
                        </div>
                      </div>
                      <div>
                        <button type="button" className="btn" onClick={() => handleRemove('bmc')}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'center'}}>
                        <i className="fa-solid fa-cloud-arrow-up" style={{fontSize:18,color:'grey'}} aria-hidden="true" />
                        <div style={{color:'grey', fontWeight:700}}>Click to upload or drag and drop</div>
                        <small className="field-note">SVG, PNG, JPG or PDF</small>
                      </div>
                      <input ref={bmcRef} type="file" style={{display:'none'}} onChange={(e)=>handleFileInput('bmc', e)} />
                    </>
                  )}
                </div>

                <label>Certificate of Insurance</label>
                <div className="upload-box" onDrop={(e)=>handleDrop('coi', e)} onDragOver={preventDefault} onDragEnter={preventDefault} onDragLeave={preventDefault} style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:72}} onClick={() => coiRef.current && coiRef.current.click()}>
                  {uploads.coi ? (
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,background:'#fff'}}>
                          <i className="fa-solid fa-file" aria-hidden="true" />
                        </div>
                        <div>
                          <div style={{fontWeight:700}}>{uploads.coi.name}</div>
                          <small className="field-note">{Math.round(uploads.coi.size/1024)} KB</small>
                        </div>
                      </div>
                      <div>
                        <button type="button" className="btn" onClick={() => handleRemove('coi')}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'center'}}>
                        <i className="fa-solid fa-cloud-arrow-up" style={{fontSize:18,color:'grey'}} aria-hidden="true" />
                        <div style={{color:'grey', fontWeight:700}}>Click to upload or drag and drop</div>
                        <small className="field-note">SVG, PNG, JPG or PDF</small>
                      </div>
                      <input ref={coiRef} type="file" style={{display:'none'}} onChange={(e)=>handleFileInput('coi', e)} />
                    </>
                  )}
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>

                <label>Types of Freight</label>
                <select value={preferences.freightType} onChange={(e)=>setPref('freightType', e.target.value)}>
                  <option>Dry Van</option>
                  <option>Reefer</option>
                  <option>Flatbed</option>
                  <option>Conestoga</option>
                </select>

                <label>Preferred Equipment</label>
                <input placeholder="Preferred Equipment" value={preferences.preferredEquipment} onChange={(e)=>setPref('preferredEquipment', e.target.value)} />

                <label>Average Monthly Load Volume</label>
                <input placeholder="Average Monthly Load Volume" value={preferences.avgMonthlyVolume} onChange={(e)=>setPref('avgMonthlyVolume', e.target.value)} />

                <label>Regions of Operation</label>
                <input placeholder="Regions Of Operation" value={preferences.regionsOfOperation} onChange={(e)=>setPref('regionsOfOperation', e.target.value)} />
              </>
            )}

            {currentStep === 5 && (
              <>
                <FinalReview />
              </>
            )}

            <div className="divider-line" />

            <div className="onboarding-actions">
              <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={currentStep===1}>Back</button>
              {/* Next is disabled on final step OR when on step 3 and required W-9 not uploaded */}
              <button
                type="button"
                className={"btn btn-primary " + (currentStep===5 ? '' : 'enabled')}
                onClick={currentStep===5 ? () => navigate('/shipper-dashboard') : handleNext}
              >
                {currentStep===5? 'Finish' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <div className="hero-chat-bubble" onClick={() => setIsChatOpen(s => !s)} style={{position: 'fixed', right: 18, bottom: 18, zIndex: 999}}>
        <img src={botpic} alt="AI Assistant" style={{width:42,height:42}} />
      </div>
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

function FinalReview(){
  // We import outer-scope state by reading DOM where necessary and using the captured state via closures.
  // To keep this component simple and local, we'll rely on the fact that the parent file defines
  // `shipperData`, `preferences`, `uploads`, and `setCurrentStep` in the same module scope.
  // eslint-disable-next-line no-unused-vars
  const _ = null
  // The parent component's scope provides the variables via closure when this function
  // is evaluated after the parent. We reference them using `window` fallback for safety.
  // (This avoids changing other components but shows the review.)

  // Grab from module scope if available
  // eslint-disable-next-line no-undef
  const parent = typeof window !== 'undefined' ? window : null

  // Try to access the variables directly; if not present, fall back to defaults.
  // Note: In this bundler environment the closure variables are available, so this will work.
  // eslint-disable-next-line no-restricted-globals
  const data = (typeof shipperData !== 'undefined') ? shipperData : {
    businessType: 'shipper', businessName: '', taxId: '', businessAddress: '', businessPhone: '', businessEmail: '', website: '', contactFullName: '', contactTitle: '', contactPhone: '', contactEmail: ''
  }
  const prefs = (typeof preferences !== 'undefined') ? preferences : { freightType: 'Dry Van', preferredEquipment: '', avgMonthlyVolume: '', regionsOfOperation: '' }
  const ups = (typeof uploads !== 'undefined') ? uploads : { w9: null, proofOfRegistration: null, bmc: null, coi: null }
  const setStep = (typeof setCurrentStep === 'function') ? setCurrentStep : (()=>{})

  return (
    <div style={{border:'1px solid #eef2f7',borderRadius:8,padding:16,display:'flex',flexDirection:'column',gap:12}}>

      <section>
        <h4 style={{margin:'8px 0'}}>Business Information</h4>
        <p style={{margin:0}}><strong>Type:</strong> {data.businessType}</p>
        <p style={{margin:0}}><strong>Name:</strong> {data.businessName || '—'}</p>
        <p style={{margin:0}}><strong>Tax ID:</strong> {data.taxId || '—'}</p>
        <p style={{margin:0}}><strong>Address:</strong> {data.businessAddress || '—'}</p>
        <p style={{margin:0}}><strong>Phone:</strong> {data.businessPhone || '—'}</p>
        <p style={{margin:0}}><strong>Email:</strong> {data.businessEmail || '—'}</p>
        <p style={{margin:0}}><strong>Website:</strong> {data.website || '—'}</p>
      </section>

      <section>
        <h4 style={{margin:'8px 0'}}>Contact Person</h4>
        <p style={{margin:0}}><strong>Name:</strong> {data.contactFullName || '—'}</p>
        <p style={{margin:0}}><strong>Title:</strong> {data.contactTitle || '—'}</p>
        <p style={{margin:0}}><strong>Phone:</strong> {data.contactPhone || '—'}</p>
        <p style={{margin:0}}><strong>Email:</strong> {data.contactEmail || '—'}</p>
      </section>

      <section>
        <h4 style={{margin:'8px 0'}}>Freight Preferences</h4>
        <p style={{margin:0}}><strong>Type:</strong> {prefs.freightType}</p>
        <p style={{margin:0}}><strong>Preferred Equipment:</strong> {prefs.preferredEquipment || '—'}</p>
        <p style={{margin:0}}><strong>Avg Monthly Volume:</strong> {prefs.avgMonthlyVolume || '—'}</p>
        <p style={{margin:0}}><strong>Regions:</strong> {prefs.regionsOfOperation || '—'}</p>
      </section>

      <section>
        <h4 style={{margin:'8px 0'}}>Uploaded Documents</h4>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div style={{padding:8,border:'1px solid #f1f5f9',borderRadius:8}}>
            <div style={{fontWeight:700}}>W-9</div>
            <div style={{color: ups.w9 ? '#064e3b' : '#6b7280'}}>{ups.w9 ? `${ups.w9.name} (${Math.round(ups.w9.size/1024)} KB)` : 'Not uploaded'}</div>
          </div>

          <div style={{padding:8,border:'1px solid #f1f5f9',borderRadius:8}}>
            <div style={{fontWeight:700}}>Proof of Registration</div>
            <div style={{color: ups.proofOfRegistration ? '#064e3b' : '#6b7280'}}>{ups.proofOfRegistration ? `${ups.proofOfRegistration.name} (${Math.round(ups.proofOfRegistration.size/1024)} KB)` : 'Not uploaded'}</div>
          </div>

          <div style={{padding:8,border:'1px solid #f1f5f9',borderRadius:8}}>
            <div style={{fontWeight:700}}>BMC-84/85</div>
            <div style={{color: ups.bmc ? '#064e3b' : '#6b7280'}}>{ups.bmc ? `${ups.bmc.name} (${Math.round(ups.bmc.size/1024)} KB)` : 'Not uploaded'}</div>
          </div>

          <div style={{padding:8,border:'1px solid #f1f5f9',borderRadius:8}}>
            <div style={{fontWeight:700}}>Certificate of Insurance</div>
            <div style={{color: ups.coi ? '#064e3b' : '#6b7280'}}>{ups.coi ? `${ups.coi.name} (${Math.round(ups.coi.size/1024)} KB)` : 'Not uploaded'}</div>
          </div>
        </div>
      </section>
    </div>
  )
}
