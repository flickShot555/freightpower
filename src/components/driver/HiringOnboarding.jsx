import React from 'react';
import '../../styles/driver/HiringOnboarding.css';

export default function HiringOnboarding() {
  return (
    <div className="ho-container">
      <header className="ho-header">
        <div>
          <h2>Hiring & Onboarding</h2>
          <div className="ho-progress-label">
            Marketplace Eligibility Progress
          </div>
        </div>
      </header>

      <div className='progress-section'>
        <div className='ho-details'>
            <span className="ho-ai-available">AI Assistant Available</span>
        <span className="ho-progress-status">2/6 Complete (33%)</span>
        </div>
        <div className="ho-progress-bar">
            <div className="ho-progress-bar-fill" style={{width: '33%'}}></div>
        </div>  
        <div className="ho-info-card ho-info-complete">
        <i className="fa-solid fa-circle-info"></i>
        <div className='ho-info-text'>
            <h5>Complete all required items to unlock Marketplace visibility</h5>
        <p>Carriers will be able to find and hire you once onboarding is complete.</p>
        </div>
      </div>
      </div>

      <section className="ho-section">
        <h3>Required Documents & Information</h3>
        <div className="ho-required-grid">
          <div className="ho-card complete">
            <div className="ho-card-header">
              <span className="ho-card-title">Application for Employment</span>
              <span className="int-status-badge active">Complete</span>
            </div>
            <p className="ho-card-desc">Personal info, driving history, references</p>
            <button className="btn small ghost-cd">View Application</button>
          </div>
          <div className="ho-card complete">
            <div className="ho-card-header">
              <span className="ho-card-title">Commercial Driver's License</span>
                <span className="int-status-badge active">Complete</span>
              </div>
            <p className="ho-card-desc">Expires: March 15, 2026</p>
            <button className="btn small ghost-cd">View Document</button>
          </div>
          <div className="ho-card missing">
            <div className="ho-card-header">
              <span className="ho-card-title">DOT Medical Certificate</span>
              <span className="int-status-badge revoked">Missing</span>
            </div>
            <p className="ho-card-desc warning">Required for compliance</p>
            <button className="btn btn small-cd">Upload Medical Card</button>
          </div>
          <div className="ho-card missing">
            <div className="ho-card-header">
              <span className="ho-card-title">Drug Test Results</span>
              <span className="int-status-badge revoked">Missing</span>
            </div>
            <p className="ho-card-desc warning">Pre-employment screening required</p>
            <button className="btn btn small-cd">Upload Test Results</button>
          </div>
          <div className="ho-card missing">
            <div className="ho-card-header">
              <span className="ho-card-title">Background Check</span>
              <span className="int-status-badge revoked">Missing</span>
            </div>
            <p className="ho-card-desc warning">Criminal history verification</p>
            <button className="btn btn small-cd">Start Background Check</button>
          </div>
          <div className="ho-card missing">
            <div className="ho-card-header">
              <span className="ho-card-title">Digital Consent Form</span>
              <span className="int-status-badge revoked">Missing</span>
            </div>
            <p className="ho-card-desc warning">Terms & conditions agreement</p>
            <button className="btn btn small-cd">Sign Consent Form</button>
          </div>
        </div>
      </section>

      <section className="ho-section">
        <h3>Optional Training & Knowledge Base <span className="int-status-badge active">Recommended</span></h3>
        <div className="ho-training-card">
          <div className="ho-training-header">
            <i className="fa-solid fa-graduation-cap"></i>
            <div>
              <span className="ho-training-title">Earn "Trained & Ready" Badge</span>
              <p>Complete training modules to boost your profile visibility to carriers</p>
            </div>
          </div>
          <div className="ho-training-grid">
            <div className="ho-training-item">
              <span className="ho-training-label">FreightPower Basics</span>
              <button className="btn btn small-cd">Start Course</button>
            </div>
            <div className="ho-training-item">
              <span className="ho-training-label">Hours of Service</span>
              <button className="btn btn small-cd">Start Course</button>
            </div>
            <div className="ho-training-item">
              <span className="ho-training-label">Safety & Compliance</span>
              <button className="btn btn small-cd">Start Course</button>
            </div>
          </div>
        </div>
      </section>

      <div className="ho-info-card ho-ai-recommend">
        <div className="ai-content">
          <h4>AI Assistant Recommendations</h4>
          <ul className="ai-list">
            <li><span className="ai-list-icon"><i className="fa-solid fa-lightbulb"></i></span>Upload your DOT Medical Certificate to maintain compliance status</li>
            <li><span className="ai-list-icon"><i className="fa-solid fa-lightbulb"></i></span>Complete background check to unlock Marketplace access faster</li>
          </ul>
          <button className="btn small ghost-cd dd-btn">Chat with AI Assistant</button>
        </div>
      </div>
    </div>
  );
}
