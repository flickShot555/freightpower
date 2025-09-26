import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useMediaQuery from "../../hooks/useMediaQuery";
import "../../styles/carrier/CarrierSignup.css";
import "../../styles/carrier/CarrierLogin.css"; // reuse some login overrides if needed
import "../../styles/driver/DriverSignup.css";
import carrier_ob_1 from "../../assets/carrier_ob_1.png";
import carrier_ob_2 from "../../assets/carrier_ob_2.jpg";
import carrier_ob_3 from "../../assets/carrier_ob_3.jpg";

const DriverSignup = () => {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const images = [carrier_ob_1, carrier_ob_2, carrier_ob_3];
  const [currentImg, setCurrentImg] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="driver-signup-page">
      <div className="carrier-signup-container">
      <div className="carrier-signup-left">
        <img src={'/src/assets/pattern_bg_signup.svg'} alt="Pattern" className="carrier-signup-pattern-bg" />
        <div className="carrier-signup-form-bg">
          <h1 className="carrier-signup-title">Driver Sign-Up</h1>
          <p className="carrier-signup-subtitle">Join our network of professional drivers</p>
          <form className="carrier-signup-form" onSubmit={(e) => { e.preventDefault(); navigate('/verify', { state: { role: 'driver' } }); }}>
            <div className="carrier-signup-field">
              <label>Full Name *</label>
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="carrier-signup-field">
              <label>Email Address *</label>
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="carrier-signup-field">
              <label>Phone Number</label>
              <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="carrier-signup-field">
              <label>Password</label>
              <input type="password" placeholder="Password" />
            </div>

            <div className="carrier-signup-row">
              <div className="carrier-signup-field">
                <label>CDL number</label>
                <input type="text" placeholder="CDL number" />
              </div>
              <div className="carrier-signup-field">
                <label>Years of CDL Experience</label>
                <select>
                  <option>0-1</option>
                  <option>1-3</option>
                  <option>3-5</option>
                  <option>5+</option>
                </select>
              </div>
            </div>

            <div className="carrier-signup-field">
              <label>Truck Type Experience</label>
              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                <label><input type="checkbox"/> Dry Van</label>
                <label><input type="checkbox"/> Reefer</label>
                <label><input type="checkbox"/> Flatbed</label>
                <label><input type="checkbox"/> Tanker</label>
                <label><input type="checkbox"/> Car Hauler</label>
                <label><input type="checkbox"/> Other</label>
              </div>
            </div>

            <div className="carrier-signup-bottom-actions">
              <div className="carrier-signup-login-actions">
                <button type="submit" className="carrier-signup-btn">Verify to proceed</button>
              </div>
              <div className="carrier-signup-login-text">
                Already have an account? <a href="/login">Login</a>
              </div>
            </div>
          </form>
        </div>
      </div>

      {!isMobile && (
        <div className="carrier-signup-right-bg-simple">
          <img src={'/src/assets/blue_bg_signup.svg'} alt="Blue Background" className="carrier-signup-bg-svg" />
          <div className="carrier-signup-img-block">
            <img src={images[currentImg]} alt="Driver Onboarding" className="carrier-signup-img-top-simple" />
          </div>
          <div className="carrier-signup-info-bottom">
            <div className="carrier-signup-img-indicators" style={{ background: 'transparent', minHeight: '24px', marginBottom: '0', marginTop: '0' }}>
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={ idx === currentImg ? "carrier-signup-dot-active" : "carrier-signup-dot" }
                  style={{ display: 'inline-block', verticalAlign: 'middle' }}
                />
              ))}
            </div>
            <div className="carrier-signup-info-simple" style={{ marginTop: '1rem' }}>
              <h2>Onboard Faster,<br />Manage Smarter with AI</h2>
              <ul>
                <li>🚛 Get onboarded and ready to be hired</li>
                <li>🔗 Connect with verified carriers instantly</li>
                <li>📂 Manage all your CDL & safety documents digitally</li>
                <li>🛒 Join the Marketplace – get listed as available to hire</li>
                <li>⚡ Fast. Paperless. Hassle-free onboarding</li>
                <li>Be visible. Be ready. Get hired faster.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default DriverSignup;
