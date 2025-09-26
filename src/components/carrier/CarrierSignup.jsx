import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useMediaQuery from "../../hooks/useMediaQuery";
import "../../styles/carrier/CarrierSignup.css";
import carrier_ob_1 from "../../assets/carrier_ob_1.png";
import carrier_ob_2 from "../../assets/carrier_ob_2.jpg";
import carrier_ob_3 from "../../assets/carrier_ob_3.jpg";

const CarrierSignup = () => {
  const images = [carrier_ob_1, carrier_ob_2, carrier_ob_3];
  const [currentImg, setCurrentImg] = useState(0);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="carrier-signup-container">
      <div className="carrier-signup-left">
        <img src={"/src/assets/pattern_bg_signup.svg"} alt="Pattern" className="carrier-signup-pattern-bg" />
        <div className="carrier-signup-form-bg">
          <h1 className="carrier-signup-title">Carrier Signup</h1>
          <p className="carrier-signup-subtitle">
            Join our network of trusted carriers in just a few minutes
          </p>
          <form className="carrier-signup-form" onSubmit={(e) => {
            e.preventDefault();
            // navigate to verification with role
            navigate('/verify', { state: { role: 'carrier' } });
          }}>
            <div className="carrier-signup-field">
              <label>Company Name *</label>
              <input type="text" placeholder="Company Name" />
            </div>
            <div className="carrier-signup-field">
              <label>Full Name *</label>
              <input type="text" placeholder="Full Name" />
            </div>
            <div className="carrier-signup-row">
              <div className="carrier-signup-field">
                <label>Email Address *</label>
                <input type="email" placeholder="Email Address" />
              </div>
              <div className="carrier-signup-field">
                <label>MC or DOT Number *</label>
                <input type="text" placeholder="MC or DOT Number" />
              </div>
            </div>
            <div className="carrier-signup-row">
              <div className="carrier-signup-field">
                <label>Phone Number</label>
                <input type="text" placeholder="Phone Number" />
              </div>
              <div className="carrier-signup-field">
                <label>Number of Trucks Owned</label>
                <select>
                  <option>Number of Trucks Owned</option>
                  <option>1</option>
                  <option>2-5</option>
                  <option>6-10</option>
                  <option>10+</option>
                </select>
              </div>
            </div>
            <div className="carrier-signup-field">
              <label>Password</label>
              <input type="password" placeholder="Password" />
            </div>
            <div className="carrier-signup-field">
              <label>States You Operate In <span className="optional">(optional)</span></label>
              <select>
                <option>States You Operate In</option>
                <option>California</option>
                <option>Texas</option>
                <option>Florida</option>
                <option>New York</option>
              </select>
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
      {/* Only show right container on large screens */}
      {(!isMobile) && (
        <div className="carrier-signup-right-bg-simple" style={{ display: isMobile ? 'none' : 'flex' }}>
          <img src={"/src/assets/blue_bg_signup.svg"} alt="Blue Background" className="carrier-signup-bg-svg" />
          <div className="carrier-signup-img-block">
            <img
              src={images[currentImg]}
              alt="Carrier Onboarding"
              className="carrier-signup-img-top-simple"
            />
          </div>
          <div className="carrier-signup-info-bottom">
            <div className="carrier-signup-img-indicators" style={{ background: 'transparent', minHeight: '24px', marginBottom: '0', marginTop: '0' }}>
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={
                    idx === currentImg
                      ? "carrier-signup-dot-active"
                      : "carrier-signup-dot"
                  }
                  style={{ display: 'inline-block', verticalAlign: 'middle' }}
                />
              ))}
            </div>
            <div className="carrier-signup-info-simple" style={{ marginTop: '1rem' }}>
              <h2>Onboard Faster,<br />Manage Smarter with AI</h2>
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
      )}
    </div>
  );
};

export default CarrierSignup;
