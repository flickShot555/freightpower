import React, { useState } from 'react';
import '../../styles/driver/DocumentVault.css';

export default function DocumentVault({ isPostHire, setIsPostHire }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const complianceDocuments = [
    {
      id: 1,
      title: "Commercial Driver's License",
      icon: "fa-solid fa-id-card",
      expires: "March 15, 2026",
      lastUpdated: "Jan 10, 2024",
      status: "Active",
      statusColor: "green",
      sharedStatus: "Not Shared Yet"
    },
    {
      id: 2,
      title: "DOT Medical Card",
      icon: "fa-solid fa-stethoscope",
      expires: "June 20, 2025",
      lastUpdated: "Dec 15, 2023",
      status: "Active",
      statusColor: "green",
      sharedStatus: "Not Shared Yet"
    },
    {
      id: 3,
      title: "Background Check",
      icon: "fa-solid fa-user-shield",
      expires: "-",
      lastUpdated: "-",
      status: "Missing",
      statusColor: "red",
      description: "Required for marketplace eligibility"
    },
    {
      id: 4,
      title: "Drug Test Results",
      icon: "fa-solid fa-vial",
      expires: "-",
      lastUpdated: "-",
      status: "Missing",
      statusColor: "red",
      description: "Required for marketplace eligibility"
    }
  ];

  const onboardingDocuments = [
    {
      id: 1,
      title: "W-9 Tax Form",
      icon: "fa-solid fa-file-invoice",
      lastUpdated: "Jan 5, 2024",
      status: "Complete",
      statusColor: "green",
      sharedStatus: "Not Shared Yet"
    },
    {
      id: 2,
      title: "Data Sharing Consent",
      icon: "fa-solid fa-handshake",
      lastUpdated: "-",
      status: "Pending",
      statusColor: "orange",
      description: "Required before sharing profile with carriers",
      hasAction: true
    }
  ];

  const postHireComplianceDocuments = [
    {
      id: 1,
      title: "Commercial Driver License",
      status: "Active",
      statusColor: "green",
      date: "Updated: Oct 1, 2024",
      expires: "Expires: Oct 1, 2026"
    },
    {
      id: 2,
      title: "Medical Certificate",
      status: "Pending Soon",
      statusColor: "orange",
      date: "Updated: Nov 15, 2023",
      expires: "Expires: Nov 15, 2025"
    },
    {
      id: 3,
      title: "Background Check",
      status: "Active",
      statusColor: "green",
      date: "Updated: Jan 10, 2024",
      expires: "Expires: Jan 10, 2026"
    },
    {
      id: 4,
      title: "Drug Test Results",
      status: "Active",
      statusColor: "green",
      date: "Updated: Mar 5, 2024",
      expires: "Expires: Mar 5, 2026"
    }
  ];

  const postHireTripDocuments = [
    {
      id: 1,
      title: "Rate Confirmation",
      status: "Active",
      statusColor: "green",
      date: "Load #: FP-2024-519",
      carrier: "Signed with Carrier A"
    },
    {
      id: 2,
      title: "Bill of Lading",
      status: "Active",
      statusColor: "green",
      date: "Load #: FP-2024-520",
      carrier: "Morning Start"
    },
    {
      id: 3,
      title: "Proof of Delivery",
      status: "Missing",
      statusColor: "red",
      date: "Load #: FP-2024-519",
      carrier: "Required by Carrier A"
    },
    {
      id: 4,
      title: "Add Document",
      status: "",
      statusColor: "",
      date: "Upload delivery reports or any",
      carrier: "additional documents"
    }
  ];

  const uploadOptions = [
    {
      icon: "fa-solid fa-id-card",
      title: "State Document",
      subtitle: "DOT card & others"
    },
    {
      icon: "fa-solid fa-upload",
      title: "Bulk Upload",
      subtitle: "Multiple documents"
    },
    {
      icon: "fa-solid fa-file-lines",
      title: "Form Preview",
      subtitle: "Available templates"
    },
    {
      icon: "fa-solid fa-folder",
      title: "File Folder",
      subtitle: "Browse files"
    }
  ];

  function PostHireDocumentView() {
    return (
      <div className={`dd-document-vault ${isDarkMode ? 'dark' : ''}`}>
        {/* Header */}
        <div className="dd-vault-header">
                  <h1>Document Vault</h1>
        <p className="dd-vault-subtitle">Manage and organize all your important documents</p>

          <button onClick={() => setIsPostHire(false)} className="btn small dd-back-btn">Back to Pre-Hire</button>
        </div>

        {/* Compliance Status Card */}
        <div className="dd-compliance-status-card">
          <div className="dd-compliance-card-header">
            <h3 className="dd-compliance-title">Compliance Status</h3>
            <span className="dd-last-updated">Last updated: 2 hours ago</span>
          </div>
          
          <div className="dd-status-summary-section">
            <div className="dd-status-info">
              <span className="dd-status-main">4/5 Documents Active</span>
              <div className="dd-status-badges">
                <span className="dd-status-badge expiring">1 Expiring Soon</span>
                <span className="dd-status-badge active">
                  <i className="fa-solid fa-check"></i>
                  4 Active
                </span>
                <span className="dd-status-badge warning">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                  1 Expiring
                </span>
              </div>
            </div>
          </div>
          
          <div className="dd-progress-bar-container-new">
            <div className="dd-progress-bar-full">
              <div className="dd-progress-fill-full"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="dd-action-buttons">
          <button className="btn dd-upload-btn">
            <i className="fa-solid fa-upload"></i>
            Upload Documents
          </button>
          <button className="btn dd-scan-btn">
            <i className="fa-solid fa-camera"></i>
            Scan with Camera
          </button>
          <button className="btn dd-export-btn">
            <i className="fa-solid fa-download"></i>
            Export Doc Pack
          </button>
          <select className="dd-filter-select">
            <option>All Documents</option>
            <option>Active Only</option>
            <option>Pending Only</option>
          </select>
        </div>

        {/* Compliance Documents Section */}
        <div className="dd-post-hire-section">
          <div className="dd-section-header-post">
            <div className="dd-section-title-post">
              <i className="fa-solid fa-shield-halved dd-section-icon"></i>
              <h3>Compliance Documents</h3>
            </div>
            <span className="dd-section-count">4 documents</span>
          </div>
          
          <div className="dd-post-hire-grid">
            {postHireComplianceDocuments.map((doc) => (
              <div key={doc.id} className="dd-post-hire-card">
                <div className="dd-card-icon">
                  <i className="fa-solid fa-file-text"></i>
                </div>
                <div className="dd-card-status">
                  <span className={`dd-status-badge ${doc.statusColor}`}>
                    {doc.status}
                  </span>
                </div>
                <h4 className="dd-card-title">{doc.title}</h4>
                <p className="dd-card-date">{doc.date}</p>
                <p className="dd-card-expires">{doc.expires}</p>
                <div className="dd-card-actions">
                  <button className="dd-action-btn">
                    <i className="fa-solid fa-eye"></i>
                    View
                  </button>
                  <button className="dd-action-btn">
                    <i className="fa-solid fa-download"></i>
                    Export
                  </button>
                  <button className="dd-action-btn">
                    <i className="fa-solid fa-share"></i>
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trip Documents Section */}
        <div className="dd-post-hire-section">
          <div className="dd-section-header-post">
            <div className="dd-section-title-post">
              <i className="fa-solid fa-truck dd-section-icon"></i>
              <h3>Trip Documents</h3>
            </div>
            <span className="dd-section-count">3 documents</span>
          </div>
          
          <div className="dd-post-hire-grid">
            {postHireTripDocuments.map((doc) => (
              <div key={doc.id} className={`dd-post-hire-card ${doc.id === 4 ? 'dd-add-card' : ''}`}>
                {doc.id === 4 ? (
                  <>
                    <div className="dd-add-icon">
                      <i className="fa-solid fa-plus"></i>
                    </div>
                    <h4 className="dd-card-title">{doc.title}</h4>
                    <p className="dd-card-date">{doc.date}</p>
                    <p className="dd-card-carrier">{doc.carrier}</p>
                    <button className="btn dd-upload-btn-small">
                      <i className="fa-solid fa-upload"></i>
                      Upload
                    </button>
                  </>
                ) : (
                  <>
                    <div className="dd-card-icon">
                      <i className="fa-solid fa-file-text"></i>
                    </div>
                    <div className="dd-card-status">
                      <span className={`dd-status-badge ${doc.statusColor}`}>
                        {doc.status}
                      </span>
                    </div>
                    <h4 className="dd-card-title">{doc.title}</h4>
                    <p className="dd-card-date">{doc.date}</p>
                    <p className="dd-card-carrier">{doc.carrier}</p>
                    <div className="dd-card-actions">
                      <button className="dd-action-btn">
                        <i className="fa-solid fa-eye"></i>
                        View
                      </button>
                      <button className="dd-action-btn">
                        <i className="fa-solid fa-download"></i>
                        Export
                      </button>
                      <button className="dd-action-btn">
                        <i className="fa-solid fa-share"></i>
                        Share
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Onboarding Documents Section */}
        <div className="dd-post-hire-section">
          <div className="dd-section-header-post">
            <div className="dd-section-title-post">
              <i className="fa-solid fa-user-plus dd-section-icon"></i>
              <h3>Onboarding Documents</h3>
            </div>
            <span className="dd-section-count">2 documents</span>
          </div>
        </div>
      </div>
    );
  }

  if (isPostHire) {
    return <PostHireDocumentView />;
  }

  return (
    <div className={`dd-document-vault ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="dd-vault-header">
        <h1>Document Vault</h1>
        <p className="dd-vault-subtitle">Manage and organize all your important documents</p>
        <button onClick={() => setIsPostHire(true)} className="btn dd-post-hire-btn">Post Hire</button>
      </div>

      {/* Compliance Progress */}
      <div className="card dd-compliance-progress-card">
        <div className="card-header">
          <h3>Compliance Progress</h3>
          <span className="dd-progress-summary">3 of 5 documents uploaded</span>
        </div>
        
        <div className="dd-progress-container">
          <div className="dd-progress-bar-new">
            <div className="dd-progress-fill-new"></div>
          </div>
          <div className="dd-progress-details">
            <span className="dd-progress-percent-new">60% Complete</span>
            <span className="dd-progress-missing">2 documents missing</span>
          </div>
        </div>
        
        {/* AI Marketplace Readiness Check */}
        <div className="dd-ai-readiness-check">
          <div className="dd-ai-header">
            <h4>AI Marketplace Readiness Check</h4>
          </div>
          <p className="dd-ai-description">
            Missing documents that carriers typically require:
          </p>
          <div className="dd-ai-alerts">
            <div className="dd-alert-item-new">
              <i className="fa-solid fa-exclamation-circle dd-alert-icon-new"></i>
              <span>Drug Test Results (Required by 85% of carriers)</span>
            </div>
            <div className="dd-alert-item-new">
              <i className="fa-solid fa-exclamation-circle dd-alert-icon-new"></i>
              <span>Background Check (Required by 92% of carriers)</span>
            </div>
          </div>
          <button className="btn dd-upload-missing-btn-new">Upload Missing Documents</button>
        </div>
      </div>

      {/* Document Grid */}
      <div className="dd-documents-grid">
        {/* Compliance Documents */}
        <div className="dd-document-section-new">
          <div className="dd-section-header-new">
            <i className="fa-solid fa-shield-halved dd-section-icon-new"></i>
            <h3>Compliance Documents</h3>
          </div>
          
          <div className="dd-document-cards-grid">
            {complianceDocuments.map((doc) => (
              <div key={doc.id} className={`dd-document-card ${doc.status === 'Missing' ? 'dd-missing-doc' : ''}`}>
                <div className="dd-doc-header">
                  <i className={`${doc.icon} dd-doc-icon`}></i>
                  <span className={`dd-status-badge-new ${doc.statusColor}`}>
                    {doc.status}
                  </span>
                </div>
                <h4 className="dd-doc-title-new">{doc.title}</h4>
                
                {doc.status !== 'Missing' ? (
                  <>
                    <p className="dd-doc-expires-new">Expires: {doc.expires}</p>
                    <p className="dd-doc-updated-new">Last Updated: {doc.lastUpdated}</p>
                    <div className="dd-doc-shared">
                      <span className="dd-shared-status">{doc.sharedStatus}</span>
                      <div className="dd-doc-buttons">
                        <button className="dd-doc-btn dd-view-btn-new">View</button>
                        <button className="dd-doc-btn dd-replace-btn">Replace</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="dd-doc-description">{doc.description}</p>
                    <button className="dd-upload-doc-btn">Upload Document</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Onboarding Documents */}
        <div className="dd-document-section-new">
          <div className="dd-section-header-new">
            <i className="fa-solid fa-user-plus dd-section-icon-new"></i>
            <h3>Onboarding Documents</h3>
          </div>
          
          <div className="dd-document-cards-grid">
            {onboardingDocuments.map((doc) => (
              <div key={doc.id} className={`dd-document-card ${doc.status === 'Pending' ? 'dd-pending-doc' : ''}`}>
                <div className="dd-doc-header">
                  <i className={`${doc.icon} dd-doc-icon`}></i>
                  <span className={`dd-status-badge-new ${doc.statusColor}`}>
                    {doc.status}
                  </span>
                </div>
                <h4 className="dd-doc-title-new">{doc.title}</h4>
                
                {doc.status === 'Complete' ? (
                  <>
                    <p className="dd-doc-updated-new">Last Updated: {doc.lastUpdated}</p>
                    <div className="dd-doc-shared">
                      <span className="dd-shared-status">{doc.sharedStatus}</span>
                      <div className="dd-doc-buttons">
                        <button className="dd-doc-btn dd-view-btn-new">View</button>
                        <button className="dd-doc-btn dd-replace-btn">Replace</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="dd-doc-description">{doc.description}</p>
                    <button className="dd-consent-btn">Sign Consent Form</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Upload Options */}
      <div className="card dd-upload-options-card">
        <div className="card-header">
          <h3>Quick Upload Options</h3>
        </div>
        <div className="dd-upload-grid">
          {uploadOptions.map((option, index) => (
            <div key={index} className="dd-upload-option">
              <i className={`${option.icon} dd-upload-icon`}></i>
              <div className="dd-upload-text">
                <h4>{option.title}</h4>
                <p>{option.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consent Request */}
      <div className="card dd-consent-card">
        <div className="dd-consent-content">
          <i className="fa-solid fa-exclamation-triangle dd-consent-icon"></i>
          <div className="dd-consent-text">
            <h4>Consent Required for Marketplace</h4>
            <p>You must provide consent to share your documents with carriers, you may opt out and skip sharing without fees. This ensures your privacy and gives you control over your information.</p>
          </div>
        </div>
        <button className="btn dd-give-consent-btn">Give Consent</button>
      </div>
    </div>
  );
}