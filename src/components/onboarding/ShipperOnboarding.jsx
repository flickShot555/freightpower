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
                <select defaultValue="shipper" required>
                  <option value="shipper">Shipper</option>
                  <option value="broker">Broker</option>
                </select>

                <label>Business Name</label>
                <input placeholder="Business Name" />

                <label>Tax ID (EIN)</label>
                <input placeholder="Tax ID (EIN)" />

                <label>Business Address</label>
                <input placeholder="Business Address" />

                <div className="row">
                  <div className="col">
                    <label>Business Phone Number</label>
                    <input placeholder="+1 (555) 555-5555" />
                  </div>
                  <div className="col">
                    <label>Business Email Address</label>
                    <input placeholder="Business Email Address" />
                  </div>
                </div>

                <label>Website (optional)</label>
                <input placeholder="Website" />
              </>
            )}

            {currentStep === 2 && (
              <>
                <label>Full Name</label>
                <input placeholder="Full Name" />

                <label>Title</label>
                <input placeholder="Title" />

                <div className="row">
                  <div className="col">
                    <label>Phone Number</label>
                    <input placeholder="+1 (555) 555-5555" />
                  </div>
                  <div className="col">
                    <label>Email Address</label>
                    <input placeholder="Email Address" />
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
                <div style={{border:'1px solid #eef2f7',borderRadius:8,padding:16,display:'flex',flexDirection:'column',gap:8}}>
                  <p style={{margin:0}}><strong>Business:</strong> {/** placeholder preview */} Example Company</p>
                  <p style={{margin:0}}><strong>Contact:</strong> John Doe — john@example.com</p>
                  <p style={{margin:0}}><strong>Freight Preferences:</strong> {preferences.freightType} / {preferences.preferredEquipment || '—'}</p>
                  <p style={{margin:0}}><strong>Documents:</strong> {uploads.w9 ? 'W-9 uploaded' : 'W-9 missing'}</p>
                </div>
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
