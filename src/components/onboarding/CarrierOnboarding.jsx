import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import carrier_ob_1 from '../../assets/carrier_ob_1.png'
import carrier_ob_2 from '../../assets/carrier_ob_2.jpg'
import carrier_ob_3 from '../../assets/carrier_ob_3.jpg'
import './Onboarding.css'
import Chatbot from '../../components/landing_page/Chatbot'

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

  const steps = ['Business Info','Owner','Fleet Information','Compliance','Final Review']

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
        <img src={'/src/assets/verification_bg.svg'} alt="Pattern" className="onboarding-pattern-bg"/>
        <div className="onboarding-card">
          <h2>{steps[currentStep-1]}</h2>
          {currentStep === 2 ? (
            <p className="muted">Please Provide Owner Details</p>
          ) : currentStep === 3 ? (
            <p className="muted">Please Provide your Fleet Information</p>
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

                <label>DOT Number <small className="field-note">(with real-time FMCSA check if possible)</small></label>
                <input placeholder="DOT Number" />

                <label>MC Number</label>
                <input placeholder="MC Number" />

                <label>Company Address</label>
                <input placeholder="Company Address" />

                <div className="row">
                  <div className="col">
                    <label>Contact Email</label>
                    <input placeholder="email@company.com" />
                  </div>
                  <div className="col">
                    <label>Phone</label>
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
                    <label>Phone Number</label>
                    <input placeholder="+1 (555) 555-5555" />
                  </div>
                  <div style={{flex:1}}>
                    <label>Email Address</label>
                    <input placeholder="email@company.com" />
                  </div>
                </div>

                <label>Signature Upload <small style={{fontWeight:400,display:'block'}}>(Optional)</small></label>
                <div className="upload-box" style={{minHeight:120, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8}}>
                  <i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22, color:'grey'}} aria-hidden="true" />
                  <div style={{color:'grey', fontWeight:700}}>Click to upload or drag and drop</div>
                  <small>SVG, PNG, JPG or GIF (max. 800x400px)</small>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div style={{display:'flex',gap:12}}>
                  <div style={{flex:1}}>
                    <label style={{opacity:1}}>COI</label>
                    <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:20, color:'grey'}} aria-hidden="true" /><br/>Upload COI</div>
                  </div>
                  <div style={{flex:1}}>
                    <label>W9</label>
                    <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:20, color:'grey'}} aria-hidden="true" /><br/>Upload W9</div>
                  </div>
                </div>

                <div style={{display:'flex',gap:12}}>
                  <div style={{flex:1}}>
                    <label>Authority Letter</label>
                    <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:20, color:'grey'}} aria-hidden="true" /><br/>Upload Authority Letter</div>
                  </div>
                  <div style={{flex:1}}>
                    <label>Voided Check</label>
                    <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:20, color:'grey'}} aria-hidden="true" /><br/>Upload Voided Check</div>
                  </div>
                </div>

                <label>Additional Licenses or Permits</label>
                <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:20, color:'grey'}} aria-hidden="true" /><br/>Click to upload or drag and drop<br/><small>SVG, PNG, JPG or GIF (max. 800x400px)</small></div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <label>Upload MVR (Motor Vehicle Report)</label>
                <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22, color:'grey'}} aria-hidden="true" /><><br /></>Click to upload or drag and drop</div>

                <label>Upload Medical Certificate</label>
                <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22, color:'grey'}} aria-hidden="true" /><><br /></>Click to upload or drag and drop</div>

                <label>Drug Test Result (if available)</label>
                <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22, color:'grey'}} aria-hidden="true" /><><br /></>Click to upload or drag and drop</div>

                <label>FMCSA Clearinghouse Consent</label>
                <div className="upload-box"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22, color:'grey'}} aria-hidden="true" /><><br /></>Click to upload or drag and drop</div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <div style={{border:'1px solid #eef2f7',borderRadius:8,padding:12}}>
                  <p><strong>Company:</strong> Next Role (example)</p>
                  <p><strong>Owner:</strong> Full name (example)</p>
                  <p><strong>Fleet docs:</strong> COI, W9, etc.</p>
                </div>
              </>
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
        <img src={'/src/assets/chatbot.svg'} alt="AI Assistant" style={{width:42,height:42}} />
      </div>
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}
