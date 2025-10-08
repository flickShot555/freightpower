import React from 'react';
import '../../styles/driver/AccountSettings.css';

export default function AccountSettings() {
  return (
    <div className="account-settings-container">
      <header className="account-settings-header">
        <h2>Account & Settings</h2>
        <p>Manage your profile, preferences, security, and integrations</p>
      </header>

      {/* Profile & Preferences Section */}
      <div className="profile-preferences-section">
        {/* Profile Card */}
        <div className="profile-card">
          <h2 className="profile-card-title">
            Profile
          </h2>
          <div className="profile-card-header">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="profile-avatar" />
            <div>
              <div className="profile-name">Marcus Johnson</div>
              <button className="change-photo-btn">Change Photo</button>
            </div>
          </div>
          <div className="profile-field">
            <label>Phone</label>
            <input type="text" value="+1 (555) 123-4567" readOnly />
          </div>
          <div className="profile-field">
            <label>Email</label>
            <input type="email" value="marcus.johnson@email.com" readOnly />
          </div>
          <div className="profile-field">
            <label>Address</label>
            <textarea value="123 Main St, Dallas, TX 75201" rows={2} readOnly />
          </div>
          <div className="emergency-contact-label">Emergency Contact</div>
          <div className="profile-field">
            <input type="text" placeholder="Contact Name" />
          </div>
          <div className="profile-field">
            <input type="text" placeholder="Relationship" />
          </div>
          <div className="profile-field">
            <input type="text" placeholder="Phone Number" />
          </div>
          <button className="preview-profile-btn">
            Preview Marketplace Profile
          </button>
        </div>

        {/* Preferences Card */}
        <div className="preferences-card">
          <h2 className="preferences-card-title">
            Preferences
          </h2>
          <div className="preferences-field">
            <label>Language</label>
            <select defaultValue="English">
              <option>English</option>
              <option>Spanish</option>
            </select>
          </div>
          <div className="preferences-section-label">Notifications</div>
          <div className="preferences-checkbox">
            <label>Compliance Alerts</label>
            <label className="toggle-switch">
              <input type="checkbox" checked readOnly />
              <span className="slider"></span>
            </label>
          </div>
          <div className="preferences-checkbox">
            <label>Messages</label>
            <label className="toggle-switch">
              <input type="checkbox" checked readOnly />
              <span className="slider"></span>
            </label>
          </div>
          <div className="preferences-checkbox">
            <label>AI Tips</label>
            <label className="toggle-switch">
              <input type="checkbox" readOnly />
              <span className="slider"></span>
            </label>
          </div>
          <div className="preferences-link">
            <a href="#">View Notification History</a>
          </div>
          <div className="preferences-field">
            <label>Calendar Sync</label>
            <select defaultValue="Google Calendar">
              <option>Google Calendar</option>
              <option>Outlook</option>
            </select>
          </div>

        </div>
      </div>
      
      {/* Security & Accessibility Section */}
      <div className="security-accessibility-section">
        <div className="security-card">
          <h3 className="card-title">Security</h3>
          <ul className="action-list">
            <li className="action-item">Change Password <span className="chev">›</span></li>
            <li className="action-item">
              <div className="action-left">
                <div className="action-title">Two-Factor Authentication</div>
                <div className="status enabled">Enabled</div>
              </div>
              <span className="chev">›</span>
            </li>
            <li className="action-item">Biometric Login <span className="chev">›</span></li>
            <li className="action-item">Session & Device Management <span className="chev">›</span></li>
          </ul>
        </div>

        <div className="accessibility-card">
          <h3 className="card-title">Accessibility</h3>
          <div className="access-field">
            <label>Font Size</label>
            <select defaultValue="Medium">
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
          <div className="preferences-section-label">Assistive Features</div>
          <div className="preferences-checkbox">
            <label>High Contrast Mode</label>
            <label className="toggle-switch">
              <input type="checkbox" readOnly />
              <span className="slider"></span>
            </label>
          </div>
          <div className="preferences-checkbox">
            <label>Screen Reader Compatible</label>
            <label className="toggle-switch">
              <input type="checkbox" checked readOnly />
              <span className="slider"></span>
            </label>
          </div>
          <div className="preferences-checkbox muted">
            <label>Voice Commands</label>
            <div className="coming-soon">Coming Soon</div>
          </div>
        </div>
      </div>

       {/* Reports & Integrations Section */}
      <div className="reports-integrations-section">
        <div className="reports-card">
          <h3 className="card-title">Reports</h3>
          <ul className="action-list">
            <li className="action-item">Compliance Report <span className="download">⤓</span></li>
            <li className="action-item">Load Report <span className="download">⤓</span></li>
            <li className="action-item">Activity Log <span className="download">⤓</span></li>
          </ul>

          <div className="divider" />
          <div className="export-label">Export Options</div>
          <div className="export-options">
            <button className="btn pdf">PDF</button>
            <button className="btn csv">CSV</button>
          </div>
          <button className="btn request">Request Full Data Download</button>
        </div>

        <div className="integrations-card">
          <h3 className="card-title">Integrations</h3>
          <ul className="integration-list">
            <li className="integration-item">
              <div>
                <div className="integration-title">ELD Device</div>
                <div className="integration-desc">Garmin eLog 2.0 - Device ID: #GL2024567</div>
              </div>
              <div className="integration-status connected">Connected</div>
            </li>
            <li className="integration-item">
              <div>
                <div className="integration-title">Fuel Services</div>
                <div className="integration-desc">TVC Pro Driver - Fleet Card Integration</div>
              </div>
              <div className="integration-status connected">Connected</div>
            </li>
            <li className="integration-item">
              <div>
                <div className="integration-title">Training Provider</div>
                <div className="integration-desc">Connect training services for compliance tracking</div>
              </div>
              <div className="integration-status disconnected">Not Connected</div>
            </li>
          </ul>
          <button className="btn manage">Manage Permissions</button>
        </div>
      </div>
      {/* Support & Help Section */}
      <div className="support-help-section">
        <div className="support-card">
          <h3 className="card-title">Support & Help</h3>
          <ul className="action-list">
            <li className="action-item">Help Center & FAQ <span className="external">↗</span></li>
            <li className="action-item">Contact Support <span className="chev">›</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
