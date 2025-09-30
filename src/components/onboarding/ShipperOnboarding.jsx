import React, { useState, useEffect } from 'react'
import carrier_ob_1 from '../../assets/carrier_ob_1.png'
import carrier_ob_2 from '../../assets/carrier_ob_2.jpg'
import carrier_ob_3 from '../../assets/carrier_ob_3.jpg'
import '../../styles/carrier/CarrierSignup.css'
import './Onboarding.css'
import Chatbot from '../../components/landing_page/Chatbot'

export default function ShipperOnboarding(){
  const images = [carrier_ob_1, carrier_ob_2, carrier_ob_3]
  const [currentImg, setCurrentImg] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(()=>{
    const t = setInterval(()=> setCurrentImg(p => (p+1)%images.length), 2500)
    return ()=> clearInterval(t)
  },[])

  return (
  <div className="onboarding-container">
      <aside className="onboarding-steps">
        <div className="logo">LOGO</div>
        <ol>
          <li className="active">1<br/><small>Business Info</small></li>
          <li>2<br/><small>Owner</small></li>
          <li>3<br/><small>Fleet Information</small></li>
          <li>4<br/><small>Compliance</small></li>
          <li>5<br/><small>Final Review</small></li>
        </ol>
      </aside>

      <main className="onboarding-main">
        <div className="onboarding-card">
          <h2>Business Info</h2>
          <p className="muted">Please Provide your Business information</p>

          <form className="onboarding-form">
            <label>Company Name</label>
            <input placeholder="Company name" />

            <label>Contact Email</label>
            <input placeholder="Email" />

            <label>Phone</label>
            <input placeholder="Phone" />

            <div className="onboarding-actions">
              <button type="button" className="btn btn-secondary">Back</button>
              <button type="button" className="btn btn-primary">Next</button>
            </div>
          </form>
        </div>

        <div className="onboarding-side">
          <div className="onboarding-visual">
            <div className="signup-bg" />
            <div className="img-block">
              <img src={images[currentImg]} alt="onboard" />
            </div>
            <div className="img-indicators">
              {images.map((_, idx) => (
                <span key={idx} className={idx===currentImg? 'dot-active':'dot'} />
              ))}
            </div>

            <div className="visual-text">
              <h2>Onboard Faster,<br/>Manage Smarter with AI</h2>
              <ul>
                <li>🛒 Tap into the powerful Marketplace for services, tools & broker leads</li>
                <li>📄 Manage all compliance docs in a secure digital vault</li>
                <li>🧠 Use your smart dashboard to track trucks, loads, and documents</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <div className="hero-chat-bubble" onClick={() => setIsChatOpen(s => !s)} style={{position: 'fixed', right: 18, bottom: 18, zIndex: 999}}>
        <img src={'/src/assets/chatbot.svg'} alt="AI Assistant" style={{width:42,height:42}} />
      </div>
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}
