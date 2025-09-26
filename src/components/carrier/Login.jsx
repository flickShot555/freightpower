import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/carrier/CarrierSignup.css';
import '../../styles/carrier/CarrierLogin.css';
import carrier_ob_1 from '../../assets/carrier_ob_1.png';
import carrier_ob_2 from '../../assets/carrier_ob_2.jpg';
import carrier_ob_3 from '../../assets/carrier_ob_3.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const images = [carrier_ob_1, carrier_ob_2, carrier_ob_3];
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((p) => (p + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
  // navigate to verification screen with role
  navigate('/verify', { state: { role: 'carrier' } });
  };

  const navigate = useNavigate();

  return (
  <div className="carrier-signup-container carrier-login-page">
      <div className="carrier-signup-left">
        <img src={'/src/assets/pattern_bg_signup.svg'} alt="Pattern" className="carrier-signup-pattern-bg" />
        <div className="carrier-signup-form-bg">
          <h1 className="carrier-signup-title">Carrier Login</h1>
          <p className="carrier-signup-subtitle">Access your carrier dashboard</p>
          <form className="carrier-signup-form" onSubmit={handleSubmit}>
            <div className="carrier-signup-field">
              <label>Email Address *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
            </div>
            <div className="carrier-signup-field">
              <label>Password *</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            </div>
            <div className="carrier-signup-bottom-actions">
              <div className="carrier-signup-login-actions">
                <button type="submit" className="carrier-signup-btn">Login</button>
              </div>
              <div className="carrier-signup-login-text">
                Don't have an account? <a href="/carrier-signup">Sign up</a>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Right panel kept same as signup for parity */}
      <div className="carrier-signup-right-bg-simple">
        <img src={'/src/assets/blue_bg_signup.svg'} alt="Blue Background" className="carrier-signup-bg-svg" />
        <div className="carrier-signup-img-block">
          <img src={images[currentImg]} alt="Carrier Onboarding" className="carrier-signup-img-top-simple" />
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
              <li>🛒 Tap into the powerful Marketplace for services, tools & broker leads</li>
                <li>📄 Manage all compliance docs in a secure digital vault</li>
                <li>📨 Share your full carrier profile & send onboarding links</li>
                <li>🧠 Use your smart dashboard to track trucks, loads, and documents</li>
                <li>⚙️ Integrate seamlessly with your existing TMS systems</li>
                <li>🚛 Instantly hire ready CDL drivers with smart onboarding</li>
                <li>Everything you need to scale and move smarter.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
