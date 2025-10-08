import React, { useState } from 'react';
import '../../styles/driver/MyCarrier.css';

export default function MyCarrier() {
  const [activeTab, setActiveTab] = useState('Active');
  const [isDarkMode, setIsDarkMode] = useState(false); // Local dark mode state, like Marketplace

  return (
    <>
      {/* Optional: Add a toggle button for demo/testing */}
      {/* <button onClick={() => setIsDarkMode(d => !d)}>Toggle Dark Mode</button> */}
      <section className={`dd-grid${isDarkMode ? ' dark' : ''}`}>
          {/* Carrier Info Card */}
          <div className="card mc-carrier-card">
            <div className="mc-carrier-header">
              <div className="mc-carrier-logo">TL</div>
              <div className="mc-carrier-info">
                <div className="mc-carrier-name">
                  <h3>TransLogistics Inc.</h3>
                  <span className="mc-verified-badge">
                    <i className="fa-solid fa-check-circle"></i>
                    Verified Carrier
                  </span>
                </div>
                <div className="mc-carrier-details">
                  <span className="mc-detail">DOT: 2847563</span>
                  <span className="mc-detail">MC: 928374</span>
                  <span className="mc-detail">Atlanta, GA</span>
                  <span className="mc-detail">15 Years in Operation</span>
                </div>
              </div>
              <div className="mc-carrier-status">
                <span className="mc-status-badge active">Active</span>
                <div className="mc-rating">
                  <i className="fa-solid fa-star"></i>
                  <span>98.5% On-Time</span>
                </div>
              </div>
            </div>
          </div>

            {/* AI Assistant Alert */}
          <div className="card mc-ai-alert-card">
            <div className="mc-ai-alert">
              <div className="mc-ai-icon">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div className="mc-ai-content">
                <h4>AI Assistant</h4>
                <p>Your CDL expires in 45 days. Upload renewal to maintain compliance.</p>
              </div>
              <button className="btn small mc-upload-btn">Upload Now</button>
            </div>
          </div>



          {/* Two Column Layout */}
          <div className="mc-two-column-layout">
            {/* Left Column */}
            <div className="mc-left-column">
              {/* Active Load Card */}
              <div className="card mc-active-load-card">
                <div className="mc-load-header">
                  <div className="mc-load-title">
                    <div className="mc-status-dot active"></div>
                    <span className="mc-load-badge">Active Load #TL-4829</span>
                    <span className="mc-transit-badge">In Transit</span>
                  </div>
                  <div className="mc-load-actions">
                    <button className="btn small mc-view-route-btn">
                      <i className="fa-solid fa-route"></i>
                      View Route
                    </button>
                    <button className="btn small mc-message-dispatch-btn">
                      <i className="fa-solid fa-message"></i>
                      Message Dispatch
                    </button>
                  </div>
                </div>

                <div className="mc-load-details">
                  <div className="mc-load-locations">
                    <div className="mc-location pickup">
                      <h5>Pickup</h5>
                      <p>Amazon Warehouse</p>
                      <p>1234 Industrial Blvd, Atlanta, GA 30309</p>
                      <p className="mc-status-text">
                        <i className="fa-solid fa-check"></i>
                        Completed - 2 hours ago
                      </p>
                    </div>
                    <div className="mc-location delivery">
                      <h5>Delivery</h5>
                      <p>Walmart Distribution</p>
                      <p>5678 Commerce Way, Jacksonville, FL 32218</p>
                      <p className="mc-eta-text">ETA: 4:30 PM (127 miles left)</p>
                    </div>
                  </div>

                  <div className="mc-progress-section">
                    <div className="mc-progress-header">
                      <span>Trip Progress</span>
                      <span>68% Complete</span>
                    </div>
                    <div className="mc-progress-bar">
                      <div className="mc-progress-fill" style={{width: '68%'}}></div>
                    </div>
                  </div>

                  <div className="mc-load-buttons">
                    <button className="btn mc-view-docs-btn">
                      <i className="fa-solid fa-file-text"></i>
                      View Docs
                    </button>
                    <button className="btn mc-upload-pod-btn">
                      <i className="fa-solid fa-upload"></i>
                      Upload POD
                    </button>
                  </div>
                </div>
              </div>

              {/* Assignments Section */}
              <div className="card mc-assignments-card">
                <div className="mc-assignments-header">
                  <h3>Assignments</h3>
                  <div className="mc-assignment-tabs">
                    <button 
                      className={`mc-tab ${activeTab === 'Active' ? 'active' : ''}`}
                      onClick={() => setActiveTab('Active')}
                    >
                      Active
                    </button>
                    <button 
                      className={`mc-tab ${activeTab === 'Completed' ? 'active' : ''}`}
                      onClick={() => setActiveTab('Completed')}
                    >
                      Completed
                    </button>
                    <button 
                      className={`mc-tab ${activeTab === 'Archived' ? 'active' : ''}`}
                      onClick={() => setActiveTab('Archived')}
                    >
                      Archived
                    </button>
                  </div>
                </div>

                <div className="mc-assignment-list">
                  <div className="mc-assignment-item">
                    <div className="mc-assignment-info">
                      <h4>Load #TL-4830</h4>
                      <span className="mc-assignment-badge assigned">Assigned</span>
                      <div className="mc-assignment-route">
                        <p>From: Miami, FL</p>
                        <p>Home Depot Warehouse</p>
                      </div>
                      <div className="mc-assignment-route">
                        <p>To: Tampa, FL</p>
                        <p>Lowe's Distribution</p>
                      </div>
                      <div className="mc-assignment-details">
                        <span>245 miles • $580</span>
                      </div>
                    </div>
                    <div className="mc-assignment-schedule">
                      <p>Pickup: Tomorrow 8:00 AM</p>
                      <button className="btn small mc-start-trip-btn">Start Trip</button>
                    </div>
                  </div>

                  <div className="mc-assignment-item">
                    <div className="mc-assignment-info">
                      <h4>Load #TL-4831</h4>
                      <span className="mc-assignment-badge pending">Pending</span>
                      <div className="mc-assignment-route">
                        <p>From: Orlando, FL</p>
                        <p>Target Distribution</p>
                      </div>
                      <div className="mc-assignment-route">
                        <p>To: Savannah, GA</p>
                        <p>Walmart Supercenter</p>
                      </div>
                      <div className="mc-assignment-details">
                        <span>312 miles • $720</span>
                      </div>
                    </div>
                    <div className="mc-assignment-schedule">
                      <p>Pickup: Dec 28, 10:00 AM</p>
                      <button className="btn small mc-view-details-btn">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="mc-right-column">
              {/* Compliance Sync */}
              <div className="card mc-compliance-card">
                <div className="card-header">
                  <h3>Compliance Sync</h3>
                </div>
                <div className="mc-compliance-list">
                  <div className="mc-compliance-item">
                    <span>CDL License</span>
                    <div className="mc-status-icon active">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </div>
                  <div className="mc-compliance-item">
                    <span>Medical Certificate</span>
                    <div className="mc-status-icon active">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </div>
                  <div className="mc-compliance-item">
                    <span>Background Check</span>
                    <div className="mc-status-icon active">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </div>
                  <div className="mc-compliance-item">
                    <span>Drug Test</span>
                    <div className="mc-status-icon warning">
                      <i className="fa-solid fa-exclamation-triangle"></i>
                    </div>
                  </div>
                  <div className="mc-compliance-item">
                    <span>Insurance</span>
                    <div className="mc-status-icon active">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </div>
                </div>
                <p className="mc-compliance-note">
                  <i className="fa-solid fa-check"></i>
                  Driver has consented to share information with this carrier.
                </p>
              </div>

              {/* Communication Hub */}
              <div className="card mc-communication-card">
                <div className="card-header">
                  <h3>Communication Hub</h3>
                </div>
                <div className="mc-contact-info">
                  <div className="mc-dispatcher">
                    <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sarah Johnson" className="mc-dispatcher-avatar" />
                    <div className="mc-dispatcher-info">
                      <h4>Sarah Johnson</h4>
                      <span>Dispatcher</span>
                    </div>
                  </div>
                  
                  <div className="mc-recent-activity">
                    <h4>Recent Activity</h4>
                    <span className="mc-activity-time">2 min ago</span>
                    <p>"Load #TL-4829 delivery confirmed. Great job!"</p>
                  </div>

                  <div className="mc-communication-actions">
                    <button className="btn mc-message-full-btn">
                      <i className="fa-solid fa-message"></i>
                      Message
                    </button>
                    <button className="btn mc-call-btn">
                      <i className="fa-solid fa-phone"></i>
                      Call
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card mc-quick-actions-card">
                <div className="card-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="mc-quick-actions">
                  <button className="mc-quick-action">
                    <i className="fa-solid fa-upload"></i>
                    <span>Upload Documents</span>
                  </button>
                  <button className="mc-quick-action">
                    <i className="fa-solid fa-calendar"></i>
                    <span>View Schedule</span>
                  </button>
                  <button className="mc-quick-action">
                    <i className="fa-solid fa-chart-line"></i>
                    <span>Performance Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
}