import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useMediaQuery from "../../hooks/useMediaQuery";
import "../../styles/carrier/CarrierSignup.css";
import "../../styles/carrier/CarrierLogin.css";
import "../../styles/driver/DriverSignup.css"; // reuse driver overrides for spacing
import shipperImg from "../../assets/hero_bg.png";
import carrier_ob_1 from "../../assets/carrier_ob_1.png";
import carrier_ob_2 from "../../assets/carrier_ob_2.jpg";
import carrier_ob_3 from "../../assets/carrier_ob_3.jpg";

const ShipperSignup = () => {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const images = [carrier_ob_1, carrier_ob_2, carrier_ob_3];
  const [currentImg, setCurrentImg] = useState(0);
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((p) => (p + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="driver-signup-page">
      <div className="carrier-signup-container">
        <div className="carrier-signup-left">
          <img src={'/src/assets/pattern_bg_signup.svg'} alt="Pattern" className="carrier-signup-pattern-bg" />
          <div className="carrier-signup-form-bg">
            <h1 className="carrier-signup-title">Shipper/broker Signup</h1>
            <p className="carrier-signup-subtitle">Join our network of professional shippers and brokers</p>
            <form className="carrier-signup-form" onSubmit={(e)=>{ e.preventDefault(); navigate('/verify', { state: { role: 'shipper' } }); }}>
              <div className="carrier-signup-field">
                <label>Company Name</label>
                <input type="text" placeholder="Company Name" value={company} onChange={(e)=>setCompany(e.target.value)} />
              </div>
              <div className="carrier-signup-field">
                <label>Full Name</label>
                <input type="text" placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} />
              </div>
              <div className="carrier-signup-field">
                <label>Email Address</label>
                <input type="email" placeholder="Email Address" value={email} onChange={(e)=>setEmail(e.target.value)} />
              </div>
              <div className="carrier-signup-row">
                <div className="carrier-signup-field">
                  <label>MCN Number (Broker)</label>
                  <input type="text" placeholder="MCN Number" />
                </div>
                <div className="carrier-signup-field">
                  <label>Phone Number</label>
                  <input type="text" placeholder="Phone Number" />
                </div>
              </div>
              <div className="carrier-signup-field">
                <label>Password</label>
                <input type="password" placeholder="Password" />
              </div>
              <div className="carrier-signup-row">
                <div className="carrier-signup-field">
                  <label>Business Type (Optional)</label>
                  <select>
                    <option>Business Type</option>
                  </select>
                </div>
                <div className="carrier-signup-field">
                  <label>Freight Type (Optional)</label>
                  <select>
                    <option>Freight Type</option>
                  </select>
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
              <img src={images[currentImg]} alt="Shipper Onboarding" className="carrier-signup-img-top-simple" />
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
              <div className="carrier-signup-info-simple" style={{ marginTop: '1rem' }}>
                <h2>Find & Onboard Carriers Faster. Manage Smarter.</h2>
                <ul>
                  <li>Instantly invite carriers to upload documents</li>
                  <li>View AI-powered safety and compliance scores</li>
                  <li>One-time onboarding — use your profile across the platform</li>
                  <li>Integrate your own TMS tools and streamline workflows</li>
                  <li>Live load tracking, instant BOL, and fast communication</li>
                  <li>Access a robust marketplace for services and support</li>
                  <li>All documents organized in a secure digital vault</li>
                </ul>
                <p style={{marginTop: '8px', color: '#E8EBE6'}}>🚀 Save time. Gain visibility. Move freight smarter.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipperSignup;
