import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/carrier/CarrierSignup.css'
import carrier_ob_1 from '../assets/carrier_ob_1.png'
import carrier_ob_2 from '../assets/carrier_ob_2.jpg'
import carrier_ob_3 from '../assets/carrier_ob_3.jpg'
import pattern_bg_signup from '../../assets/pattern_bg_signup.svg'

export default function Signup(){
  const images = [carrier_ob_1, carrier_ob_2, carrier_ob_3]
  const [currentImg, setCurrentImg] = useState(0)
  const [role, setRole] = useState('carrier')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const navigate = useNavigate()
  const loc = useLocation()

  useEffect(()=>{
    // if role passed via location.state, use it
    if(loc && loc.state && loc.state.role) setRole(loc.state.role)
  },[loc])

  useEffect(()=>{
    const t = setInterval(()=> setCurrentImg((p)=> (p+1)%images.length), 2500)
    return ()=> clearInterval(t)
  },[])

  const handleSubmit = (e)=>{
    e.preventDefault()
    // navigate to role-specific onboarding page instead of verification
    navigate(`/onboarding/${role}`, { state: { role } })
  }

  return (
    <div className="carrier-signup-container carrier-login-page">
      <div className="carrier-signup-left">
        <img src={pattern_bg_signup} alt="Pattern" className="carrier-signup-pattern-bg"/>
        <div className="carrier-signup-form-bg">
          <h1 className="carrier-signup-title">Sign up to FreightPower AI</h1>
          <p className="carrier-signup-subtitle">Manage, move, and monitor freight smarter</p>

          <form className="carrier-signup-form" onSubmit={handleSubmit}>
            <div className="carrier-signup-field input-with-icon">
              <label>Name</label>
              <div className="input-icon-wrap">
                <i className="fa-solid fa-user" aria-hidden="true" />
                <input type="text" placeholder="Johny English" />
              </div>
            </div>

            <div className="carrier-signup-field input-with-icon">
              <label>Email</label>
              <div className="input-icon-wrap">
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                <input type="email" placeholder="you@example.com" />
              </div>
            </div>

            <div className="carrier-signup-field input-with-icon">
              <label>Password</label>
              <div className="input-icon-wrap">
                <i className="fa-solid fa-lock" aria-hidden="true" />
                <input id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="carrier-signup-field">
              <label className="terms-ctrl">
                <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
                <span> By continuing, you agree to FreightPower AI <a className="policy-link" href="#">Term of Use</a> and confirm that you have read <a className="policy-link" href="#">Privacy Policy</a></span>
              </label>
            </div>

            <div className="carrier-signup-bottom-actions">
              <div className="carrier-signup-login-actions">
                <button type="submit" className="carrier-signup-btn">Create Account</button>
              </div>

              <div className="divider"><span>Need help logging in? Ask our AI Assistant</span></div>

              <button type="button" className="google-signin">
                <i className="fa-brands fa-google google-icon" aria-hidden="true" />
                Sign Up with Google
              </button>

              <div className="carrier-signup-login-text">
                Already have an account? <a href="/login">Sign In</a>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="carrier-signup-right-bg-simple">
        <img src={'/src/assets/blue_bg_signup.svg'} alt="Blue Background" className="carrier-signup-bg-svg" />
        <div className="carrier-signup-img-block">
          <img src={images[currentImg]} alt="Onboarding" className="carrier-signup-img-top-simple"/>
        </div>
        <div className="carrier-signup-info-bottom">
          <div className="carrier-signup-img-indicators" style={{ background: 'transparent', minHeight: '24px', marginBottom: '0', marginTop: '0' }}>
            {images.map((_, idx)=> (
              <span key={idx} onClick={()=> setCurrentImg(idx)} className={ idx === currentImg ? "carrier-signup-dot-active" : "carrier-signup-dot"} style={{ display: 'inline-block', verticalAlign: 'middle', cursor: 'pointer'}} />
            ))}
          </div>
          <div className="carrier-signup-info-simple">
            <h2>Onboard Faster,<br/>Manage Smarter with AI</h2>
            <ul>
              <li>Connect instantly, automate your documents, and move freight smarter in one intelligent digital marketplace.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
