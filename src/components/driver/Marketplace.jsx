import React, { useState } from 'react';
import '../../styles/driver/Marketplace.css';

export default function Marketplace({ isPostHire, setIsPostHire }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  function PostHireMarketplaceView() {
    return (
      <>
        <header className="fp-header">
          <div className="fp-header-titles">
            <h2>Marketplace</h2>
            <p className="fp-subtitle">Your smart CDL staffing hub - connect with carriers and service providers</p>
            <button onClick={() => setIsPostHire(false)} className="btn small dd-back-btn">Pre-Hire</button>
          </div>
        </header>
        
        <section className="fp-grid">
          {/* Driver Availability Section */}
          <div className="card mp-availability-card">
            <div className="card-header">
              <h3>Driver Availability</h3>
              <span className="int-status-badge active">Currently Available</span>
            </div>
            <div className="mp-availability-content">
              <div className="mp-visibility-status">
                <div className="mp-status-icon active"></div>
                <span>You are visible to carriers in FreightPower's staffing pool</span>
              </div>
              <div className="mp-consent-info">
                <p className="mp-consent-text">By being available, you've agreed to share your CDL & compliance information with carriers through FreightPower.</p>
                <button className='btn small-cd'>
                  <i className="fa-solid fa-info-circle"></i>
                  Auto-Consent Active
                </button>
              </div>
            </div>
          </div>

          {/* Promote Myself Section */}
          <div className="mp-promote-card">
            <div className="mp-promote-content">
              <div className="mp-promote-header">
                <i className="fa-solid fa-star"></i>
                <h4>Promote Myself</h4>
              </div>
              <p className="mp-promote-text">Boost your profile to appear higher in carrier searches</p>
              <button className="btn small-cd">Promote Profile - $9.99</button>
            </div>
          </div>

          {/* AI Staffing Insights */}
          <div className="card mp-ai-insights-card">
            <div className="mp-ai-header">
              <h3>AI Staffing Insights</h3>
            </div>
            <div className="mp-insights-grid">
              <div className="mp-insight-item high-demand">
                <div className="mp-insight-header">
                  <i className="fa-solid fa-trending-up"></i>
                  <span>High Demand Alert</span>
                </div>
                <p>There are 12 carriers in your region actively hiring — make sure your profile is up to date.</p>
              </div>
              <div className="mp-insight-item special-offer">
                <div className="mp-insight-header">
                  <i className="fa-solid fa-gift"></i>
                  <span>Special Offer</span>
                </div>
                <p>20% discount available with CDL protection service this week only.</p>
              </div>
            </div>
          </div>

          {/* Service Providers Hub */}
          <div className="card mp-services-card">
            <div className="card-header">
              <h3>Service Providers Hub</h3>
              <div className="mp-search-bar">
                <i className="fa-solid fa-search"></i>
                <input type="text" placeholder="Search services..." />
              </div>
            </div>
            
            <div className="mp-services-grid">
              <div className="mp-service-category">
                <div>
                  <div className="mp-service-icon cdl-protection">
                  <i className="fa-solid fa-shield"></i>
                </div>
                <h4>CDL Protection (TVC)</h4>
                <p>Protect your CDL with expert legal representation and violation defense services.</p>
                <span className="int-status-badge warning">20% Off This Week</span>
                </div>
                <button className="btn small-cd" style={{marginTop: '20px', width: '100%'}}>Connect</button>
              </div>

              <div className="mp-service-category">
                <div>
                  <div className="mp-service-icon eld-solutions">
                  <i className="fa-solid fa-tablet-screen-button"></i>
                </div>
                <h4>ELD Solutions</h4>
                <p>Advanced ELD integrations with real-time compliance monitoring and reporting.</p>
                <span className="int-status-badge warning">Multiple Options</span>
                </div>
                <button className="btn small-cd" style={{marginTop: '20px', width: '100%'}}>Connect</button>
              </div>

              <div className="mp-service-category">
                <div>
                  <div className="mp-service-icon fuel-programs">
                  <i className="fa-solid fa-gas-pump"></i>
                </div>
                <h4>Fuel Programs</h4>
                <p>Access exclusive fuel discounts and rewards programs nationwide.</p>
                <span className="int-status-badge active">Save up to 15¢/gal</span>
                </div>
                <button className="btn small-cd" style={{marginTop: '20px', width: '100%'}}>Connect</button>
              </div>

              <div className="mp-service-category">
                <div>
                  <div className="mp-service-icon roadside">
                  <i className="fa-solid fa-wrench"></i>
                </div>
                <h4>Roadside Repair</h4>
                <p>24/7 roadside assistance and repair network for emergency breakdowns.</p>
                <span className="int-status-badge warning">24/7 Available</span>
                </div>
                <button className="btn small-cd" style={{marginTop: '20px', width: '100%'}}>Connect</button>
              </div>

              <div className="mp-service-category">
                <div>
                  <div className="mp-service-icon training">
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <h4>Training & Compliance</h4>
                <p>Continuing education and compliance training to advance your career.</p>
                <span className="int-status-badge warning">Earn Certifications</span>
                </div>
                <button className="btn small-cd" style={{marginTop: '20px', width: '100%'}}>Connect</button>
              </div>

              <div className="mp-service-category">
                <div>
                  <div className="mp-service-icon financial">
                  <i className="fa-solid fa-credit-card"></i>
                </div>
                <h4>Financial Services</h4>
                <p>Banking, factoring, and financial planning services for drivers.</p>
                <span className="int-status-badge warning">Multiple Partners</span>
                </div>
                <button className="btn small-cd" style={{marginTop: '20px', width: '100%'}}>Connect</button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (isPostHire) {
    return <PostHireMarketplaceView />;
  }

  return (
    <>
      <header className="fp-header">
        <div className="fp-header-titles">
          <h2>Marketplace</h2>
          <p className="fp-subtitle">Your smart CDL staffing hub - connect with carriers and service providers</p>
          <button onClick={() => setIsPostHire(true)} className="btn small green-btn">Post Hire</button>
        </div>
      </header>
      
      <section className="fp-grid">
        {/* Hidden Status Alert */}
        <div className="card mp-alert-card">
          <div className="mp-alert-content">
            <i className="fa-solid fa-eye-slash mp-alert-icon"></i>
            <div className="mp-alert-text">
              <span className="mp-alert-title">You are currently hidden from carriers</span>
              <p className="mp-alert-subtitle">Toggle 'Available' to enter the hiring pool</p>
            </div>
            <button className="btn small-cd">Become Available</button>
          </div>
        </div>

        {/* GPS-Based Services */}
        <div className="card mp-gps-services-card">
          <div className="card-header">
            <h3>GPS-Based Services</h3>
          </div>
          
          <div className="mp-search-container">
            <div className="mp-search-input">
              <i className="fa-solid fa-search"></i>
              <input type="text" placeholder="Search services near you..." />
            </div>
          </div>

          <div className="mp-service-icons-grid">
            <div className="mp-service-icon-item">
              <div className="mp-service-icon fuel">
                <i className="fa-solid fa-gas-pump"></i>
              </div>
              <span>Fuel Stations</span>
            </div>
            <div className="mp-service-icon-item">
              <div className="mp-service-icon parking">
                <i className="fa-solid fa-parking"></i>
              </div>
              <span>Parking</span>
            </div>
            <div className="mp-service-icon-item">
              <div className="mp-service-icon repair">
                <i className="fa-solid fa-wrench"></i>
              </div>
              <span>Repair Shops</span>
            </div>
            <div className="mp-service-icon-item">
              <div className="mp-service-icon cdl">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <span>CDL Protection</span>
            </div>
            <div className="mp-service-icon-item">
              <div className="mp-service-icon training">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <span>Training</span>
            </div>
            <div className="mp-service-icon-item">
              <div className="mp-service-icon eld">
                <i className="fa-solid fa-mobile-screen"></i>
              </div>
              <span>ELD/Tech</span>
            </div>
          </div>
        </div>

        {/* AI Highlights */}
        <div className="card mp-highlights-card">
          <div className="card-header">
            <h3>AI Highlights</h3>
          </div>
          
          <div className="mp-highlight-item">
            <div className="mp-highlight-icon">
              <i className="fa-solid fa-gas-pump"></i>
            </div>
            <div className="mp-highlight-content">
              <h4>Fuel Discount Alert</h4>
              <p>XYZ Fuel Station - 10¢ off per gallon, 2.3 miles ahead</p>
            </div>
          </div>

          <div className="mp-highlight-item">
            <div className="mp-highlight-icon">
              <i className="fa-solid fa-exclamation-triangle"></i>
            </div>
            <div className="mp-highlight-content">
              <h4>CDL Renewal Reminder</h4>
              <p>Your CDL expires in 45 days - renew to stay eligible</p>
            </div>
          </div>
        </div>

        {/* Nearby Service Providers */}
        <div className="card mp-nearby-providers-card">
          <div className="card-header">
            <h3>Nearby Service Providers</h3>
            <div className="mp-filter-controls">
              <button className="btn small mp-filter-btn">
                <i className="fa-solid fa-filter"></i>
                Filters
              </button>
              <button className="btn small mp-favorites-btn">
                <i className="fa-solid fa-heart"></i>
                Favorites
              </button>
            </div>
          </div>

          <div className="mp-provider-list">
            <div className="mp-provider-item">
              <div className="mp-provider-icon shell">
                <i className="fa-solid fa-gas-pump"></i>
              </div>
              <div className="mp-provider-info">
                <h4>Shell Station</h4>
                <p>1.2 miles • Open 24/7</p>
                <p className="mp-provider-description">Premium fuel station with truck parking and amenities</p>
                <span className="mp-provider-offer">15¢ discount active</span>
              </div>
              <div className="mp-provider-actions">
                <span className="int-status-badge active">
                  Verified
                </span>
                <button className="btn small-cd">View Details</button>
              </div>
            </div>

            <div className="mp-provider-item">
              <div className="mp-provider-icon repair">
                <i className="fa-solid fa-wrench"></i>
              </div>
              <div className="mp-provider-info">
                <h4>Mike's Truck Repair</h4>
                <p>3.8 miles • Open until 8 PM</p>
                <p className="mp-provider-description">Full-service truck repair and maintenance facility</p>
                <span className="mp-provider-offer">Emergency service available</span>
              </div>
              <div className="mp-provider-actions">
                <span className="int-status-badge active">
                  Connected
                </span>
                <button className="btn small-cd">Contact Now</button>
              </div>
            </div>

            <div className="mp-provider-item">
              <div className="mp-provider-icon parking">
                <i className="fa-solid fa-parking"></i>
              </div>
              <div className="mp-provider-info">
                <h4>TruckStop Plaza</h4>
                <p>6.1 miles • Open 24/7</p>
                <p className="mp-provider-description">Secure parking with showers, food court, and WiFi</p>
                <span className="mp-provider-offer">42 spots available</span>
              </div>
              <div className="mp-provider-actions">
                <span className="int-status-badge active">
                  Verified
                </span>
                <button className="btn small-cd">Reserve Spot</button>
              </div>
            </div>

            <div className="mp-provider-item">
              <div className="mp-provider-icon legal">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <div className="mp-provider-info">
                <h4>TVC Legal Protection</h4>
                <p>61 miles • Nationwide</p>
                <p className="mp-provider-description">Comprehensive CDL protection and legal services</p>
                <span className="mp-provider-offer">Special offer this week</span>
              </div>
              <div className="mp-provider-actions">
                <span className="int-status-badge warning">20% Off</span>
                <button className="btn small-cd">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}