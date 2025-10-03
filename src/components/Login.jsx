import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/carrier/CarrierSignup.css';
import '../styles/carrier/CarrierLogin.css';
import carrier_ob_1 from '../assets/carrier_ob_1.png';
import carrier_ob_2 from '../assets/carrier_ob_2.jpg';
import carrier_ob_3 from '../assets/carrier_ob_3.jpg';
import pattern_bg_signup from '../assets/pattern_bg_signup.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('carrier');
  const images = [carrier_ob_1, carrier_ob_2, carrier_ob_3];
  const [currentImg, setCurrentImg] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((p) => (p + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // After login, go to the verification screen
    navigate('/verify', { state: { role } });
  };

  const signupLinkFor = (r) => {
    navigate('/select-role');
  };

  return (
    <div className="carrier-signup-container carrier-login-page">
      <div className="carrier-signup-left">
        <img src={pattern_bg_signup} alt="Pattern" className="carrier-signup-pattern-bg" />
        <div className="carrier-signup-form-bg">
          <h1 className="carrier-signup-title">Log in to FreightPower AI</h1>
          <p className="carrier-signup-subtitle">Manage, move, and monitor freight smarter</p>

          <form className="carrier-signup-form" onSubmit={handleSubmit}>
            <div className="carrier-signup-field input-with-icon">
              <label>Email Address *</label>
              <div className="input-icon-wrap">
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
              </div>
            </div>

            <div className="carrier-signup-field input-with-icon">
              <label>Password *</label>
              <div className="input-icon-wrap">
                <i className="fa-solid fa-lock" aria-hidden="true" />
                <input id="password-field" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
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

            <div className="carrier-signup-bottom-actions">
              <div className="remember-row">
                <label className="remember-ctrl"><input type="checkbox" /> Remember me</label>
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>

              <div className="carrier-signup-login-actions">
                <button type="submit" className="carrier-signup-btn">Login</button>
              </div>

              <div className="divider"><span>Need help logging in? Ask our AI Assistant</span></div>

              <button type="button" className="google-signin">
                <i className="fa-brands fa-google google-icon" aria-hidden="true" />
                Sign In with Google
              </button>

              <div className="carrier-signup-login-text">
                Don't have an account? <button type="button" className="signup-link" onClick={() => signupLinkFor(role)}>Sign Up</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="carrier-signup-right-bg-simple">
        <img src={'/src/assets/blue_bg_signup.svg'} alt="Blue Background" className="carrier-signup-bg-svg" />
        <div className="carrier-signup-img-block">
          <img src={images[currentImg]} alt="Onboarding" className="carrier-signup-img-top-simple" />
        </div>
        <div className="carrier-signup-info-bottom">
          <div className="carrier-signup-img-indicators" style={{ background: 'transparent', minHeight: '24px', marginBottom: '0', marginTop: '0' }}>
            {images.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentImg(idx)}
                className={ idx === currentImg ? "carrier-signup-dot-active" : "carrier-signup-dot" }
                style={{ display: 'inline-block', verticalAlign: 'middle', cursor: 'pointer' }}
              />
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
  );
};

export default Login;
