import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import carrier_ob_1 from '../../assets/carrier_ob_1.png'
import carrier_ob_2 from '../../assets/carrier_ob_2.jpg'
import carrier_ob_3 from '../../assets/carrier_ob_3.jpg'
import './Onboarding.css'
import Chatbot from '../../components/landing_page/Chatbot'

export default function DriverOnboarding(){
  const navigate = useNavigate()
  const images = [carrier_ob_1, carrier_ob_2, carrier_ob_3]
  const [currentImg, setCurrentImg] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1..5

  useEffect(()=>{
    const t = setInterval(()=> setCurrentImg(p => (p+1)%images.length), 3000)
    return ()=> clearInterval(t)
  },[])

  const steps = ['Personal Info','CDL Details','Availability','Compliance Documents','Final Review']

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
            <p className="muted">Please Provide your CDL Details</p>
          ) : currentStep === 3 ? (
            <p className="muted">Please Provide your Availability</p>
          ) : currentStep === 4 ? (
            <p className="muted">Please Provide your Compliance Documents</p>
          ) : currentStep === 5 ? (
            <p className="muted">Please review the information you provided before submitting.</p>
          ) : (
            <p className="muted">Follow the steps to complete your driver profile</p>
          )}

          <form className="onboarding-form" onSubmit={(e)=>e.preventDefault()}>
            {currentStep === 1 && (
              <>
                <label>Full Name</label>
                <input placeholder="Full name" />

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

                <label>Password</label>
                <input placeholder="Password" />
              </>
            )}

            {currentStep === 2 && (
              <>
                <label>CDL License Number</label>
                <input placeholder="CDL Details" />

                <label>Issuing State</label>
                <input placeholder="Issuing State" />

                <label>CDL Class</label>
                <select defaultValue="" required>
                  <option value="">CDL Class</option>
                  <option value="A">Class A</option>
                  <option value="B">Class B</option>
                  <option value="C">Class C</option>
                </select>

                <label>Endorsements</label>
                <select defaultValue="" required>
                  <option value="">Endorsements</option>
                  <option value="tanker">Tanker</option>
                  <option value="haz">Hazardous</option>
                  <option value="pass">Passenger</option>
                  <option value="school">School Bus</option>
                </select>

                <label>Upload CDL License</label>
                <div className="upload-box" style={{minHeight:120, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8}}>
                  <i className="fa-solid fa-cloud-arrow-up" style={{fontSize:22, color:'grey'}} aria-hidden="true" />
                  <div style={{color:'grey', fontWeight:700}}>Click to upload or drag and drop</div>
                  <small>SVG, PNG, JPG or GIF (max. 800x400px)</small>
                </div>

                <div className="divider-line" />
              </>
            )}

            {currentStep === 3 && (
              <>
                <label>Preferred Driving Regions</label>
                <input placeholder="Preferred Driving Regions" />

                <label>Available Start Date</label>
                <input placeholder="Available Start Date" />

                <label>Equipment Type Experience</label>
                <select defaultValue="" required>
                  <option value="">Equipment Type Experience</option>
                  <option value="dry">Dry Van</option>
                  <option value="reefer">Reefer</option>
                  <option value="flat">Flatbed</option>
                </select>

                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:6}}>
                  <div style={{fontWeight:700, color:'#111827'}}>Willing to be matched with carriers</div>
                  <div className="switch">
                    <input id="matchSwitch" type="checkbox" />
                    <label className="switch-slider" htmlFor="matchSwitch" />
                  </div>
                </div>

                <div className="divider-line" />
              </>
            )}

            {currentStep === 4 && (
              <>
                <label>Upload MVR (Motor Vehicle Report)</label>
                <div className="upload-box" style={{minHeight:110, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8}}>
                  <div style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,background:'#fff'}}>
                    <i className="fa-solid fa-cloud-arrow-up" style={{fontSize:16,color:'grey'}} aria-hidden="true" />
                  </div>
                  <div style={{color:'grey', fontWeight:700}}>Click to upload or drag and drop</div>
                  <small>SVG, PNG, JPG or GIF (max. 800x400px)</small>
                </div>

                <label>Upload Medical Certificate</label>
                <div className="upload-box" style={{minHeight:110, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8}}>
                  <div style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,background:'#fff'}}>
                    <i className="fa-solid fa-cloud-arrow-up" style={{fontSize:16,color:'grey'}} aria-hidden="true" />
                  </div>
                  <div style={{color:'grey', fontWeight:700}}>Click to upload or drag and drop</div>
                  <small>SVG, PNG, JPG or GIF (max. 800x400px)</small>
                </div>

                <label>Drug Test Result (if available)</label>
                <div className="upload-box" style={{minHeight:110, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8}}>
                  <div style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,background:'#fff'}}>
                    <i className="fa-solid fa-cloud-arrow-up" style={{fontSize:16,color:'grey'}} aria-hidden="true" />
                  </div>
                  <div style={{color:'grey', fontWeight:700}}>Click to upload or drag and drop</div>
                  <small>SVG, PNG, JPG or GIF (max. 800x400px)</small>
                </div>

                <label>FMCSA Clearinghouse Consent</label>
                <div className="upload-box" style={{minHeight:110, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8}}>
                  <div style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,background:'#fff'}}>
                    <i className="fa-solid fa-cloud-arrow-up" style={{fontSize:16,color:'grey'}} aria-hidden="true" />
                  </div>
                  <div style={{color:'grey', fontWeight:700}}>Click to upload or drag and drop</div>
                  <small>SVG, PNG, JPG or GIF (max. 800x400px)</small>
                </div>

                <div className="divider-line" />
              </>
            )}

            {currentStep === 5 && (
              <>               
                <div style={{border:'1px solid #eef2f7',borderRadius:8,padding:12}}>
                  <p><strong>Name:</strong> First Last (example)</p>
                  <p><strong>CDL:</strong> CDL-XXXXX</p>
                  <p><strong>Docs:</strong> Medical cert, MVR, COI</p>
                </div>
              </>
            )}

            <div className="onboarding-actions">
              <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={currentStep===1}>Back</button>
              <button type="button" className={"btn btn-primary " + (currentStep===5 ? '' : 'enabled')} onClick={currentStep===5?()=>navigate('/driver-dashboard'):handleNext}>{currentStep===5 ? 'Finish' : 'Next'}</button>
            </div>
          </form>
        </div>
      </main>
      <div className="hero-chat-bubble" onClick={() => setIsChatOpen(s => !s)} style={{position: 'fixed', right: 18, bottom: 18, zIndex: 999}}>
        <img src={'/src/assets/chatbot.svg'} alt="AI Assistant" style={{width:42,height:42}} />
      </div>
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}
