import React, { useState } from 'react';
import '../../styles/carrier/ComplianceSafety.css';

export default function ComplianceSafety() {
  const [selectedTask, setSelectedTask] = useState(null);

  // Mock data based on the screenshot
  const complianceData = {
    dotNumber: '3456789',
    mcNumber: '789012',
    authorityType: 'Common Carrier',
    dotStatus: 'Active',
    lastFmsaSync: 'Today, 6:00 AM',
    nextReview: 'March 2025',
    auditTrial: 'View History'
  };

  const aiScore = 82;
  const scoreBreakdown = {
    fmsaData: 85,
    documentStatus: 78,
    driverQualification: 90,
    safetyHistory: 88
  };

  const basicScores = [
    { 
      name: 'Hours of Service', 
      score: '15%', 
      threshold: '65%', 
      status: 'success',
      icon: 'fa-clock'
    },
    { 
      name: 'Unsafe Driving', 
      score: '8%', 
      threshold: '65%', 
      status: 'success',
      icon: 'fa-car-crash'
    },
    { 
      name: 'Vehicle Maintenance', 
      score: '45%', 
      threshold: '80%', 
      status: 'warning',
      icon: 'fa-wrench'
    },
    { 
      name: 'Crash Indicator', 
      score: '12%', 
      threshold: '65%', 
      status: 'success',
      icon: 'fa-chart-line'
    },
    { 
      name: 'Drugs/Alcohol', 
      score: '0%', 
      threshold: '50%', 
      status: 'success',
      icon: 'fa-pills'
    },
    { 
      name: 'HazMat', 
      score: 'N/A', 
      threshold: 'Not Applicable', 
      status: 'neutral',
      icon: 'fa-radiation'
    }
  ];

  const complianceTasks = [
    {
      id: 1,
      type: 'critical',
      title: 'Renew General Liability Insurance',
      description: 'Expires in 30 days - March 15, 2025',
      actions: ['Upload Doc', 'Assign'],
      icon: 'fa-file-shield'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Driver CDL Renewal - John Smith',
      description: 'Expires in 45 days - April 01, 2025',
      actions: ['Notify Driver', 'Mark Complete'],
      icon: 'fa-id-card'
    },
    {
      id: 3,
      type: 'critical',
      title: 'Vehicle Inspection Overdue - Unit #1234',
      description: 'Annual inspection was due February 28, 2025',
      actions: ['Schedule', 'Assign'],
      icon: 'fa-clipboard-check'
    }
  ];

  const complianceDocuments = [
    { name: 'General Liability', status: 'valid', expires: '03/15/2025' },
    { name: 'Operating Authority', status: 'active' },
    { name: 'ELD Certificate', status: 'warning', expires: '04/01/2025' },
    { name: 'Drug Testing Policy', status: 'missing' }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'critical';
      case 'neutral': return 'neutral';
      default: return '';
    }
  };

  return (
    <div className="compliance-safety">
      {/* Header */}
      <header className="compliance-header">
        <div className="header-content">
          <h1>Compliance & Safety</h1>
          <p className="header-subtitle">Monitor FMCSA compliance, safety ratings, and risk management</p>
        </div>
        <div className="header-actions">
          <button className="btn-action available-snapshots">
            <i className="fa-solid fa-camera"></i>
            Available Snapshots
          </button>
          <button className="btn-action sync-fmcsa">
            <i className="fa-solid fa-sync"></i>
            Sync FMCSA
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="compliance-grid">
        {/* Left Column */}
        <div className="compliance-left">
          {/* Compliance Profile Overview */}
          <div className="compliance-card profile-overview">
            <h3>Compliance Profile Overview</h3>
            <div className="profile-details">
              <div className="profile-row">
                <span className="label">DOT Number</span>
                <span className="value">{complianceData.dotNumber}</span>
              </div>
              <div className="profile-row">
                <span className="label">MC Number</span>
                <span className="value">{complianceData.mcNumber}</span>
              </div>
              <div className="profile-row">
                <span className="label">Authority Type</span>
                <span className="value">{complianceData.authorityType}</span>
              </div>
              <div className="profile-row">
                <span className="label">DOT Status</span>
                <span className="value status active">{complianceData.dotStatus}</span>
              </div>
              <div className="profile-row">
                <span className="label">Insurance Status</span>
                <span className="value status expiring">Expiring 03/15/2025</span>
              </div>
              <div className="profile-row">
                <span className="label">Safety Rating</span>
                <span className="value status satisfactory">Satisfactory</span>
              </div>
              <div className="profile-row">
                <span className="label">Last FMCSA Sync</span>
                <span className="value">{complianceData.lastFmsaSync}</span>
              </div>
              <div className="profile-row">
                <span className="label">Next Review</span>
                <span className="value">{complianceData.nextReview}</span>
              </div>
              <div className="profile-row">
                <span className="label">Audit Trail</span>
                <span className="value link">{complianceData.auditTrial}</span>
              </div>
            </div>
          </div>

          {/* BASIC Scores */}
          <div className="compliance-card basic-scores">
            <h3>BASIC Scores</h3>
            <div className="scores-grid">
              {basicScores.map((score, index) => (
                <div key={index} className={`score-item ${getStatusClass(score.status)}`}>
                  <div className="score-header">
                    <i className={`fa-solid ${score.icon} score-icon`}></i>
                    <span className="score-name">{score.name}</span>
                    <i className={`fa-solid ${
                      score.status === 'success' ? 'fa-circle-check' : 
                      score.status === 'warning' ? 'fa-triangle-exclamation' : 
                      'fa-circle-info'
                    } status-icon`}></i>
                  </div>
                  <div className="score-value">{score.score}</div>
                  <div className="score-threshold">Threshold: {score.threshold}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BASIC Score Trends */}
          <div className="compliance-card score-trends">
            <h3>BASIC Score Trends</h3>
            <div className="trends-placeholder">
              <i className="fa-solid fa-chart-line trend-icon"></i>
              <p>Score trend visualization would appear here</p>
            </div>
          </div>

          {/* Compliance Tasks */}
          <div className="compliance-card compliance-tasks">
            <div className="tasks-header">
              <h3>Compliance Tasks</h3>
              <span className="task-count">{complianceTasks.length} Critical</span>
            </div>
            
            <div className="tasks-list">
              {complianceTasks.map((task) => (
                <div key={task.id} className={`task-item ${task.type}`}>
                  <div className="task-icon">
                    <i className={`fa-solid ${task.icon}`}></i>
                  </div>
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                    <div className="task-description">{task.description}</div>
                    <div className="task-actions">
                      {task.actions.map((action, idx) => (
                        <button key={idx} className="task-action-btn">{action}</button>
                      ))}
                    </div>
                  </div>
                  <div className="task-time">
                    {task.type === 'critical' ? '2:45 PM' : '1:30 PM'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="compliance-right">
          {/* AI Compliance Score */}
          <div className="compliance-card ai-score">
            <h3>AI Compliance Score</h3>
            <div className="score-circle">
              <div className="score-progress">
                <svg viewBox="0 0 100 100" className="progress-ring">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeDasharray={`${aiScore * 2.827} 282.7`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="score-number">{aiScore}</div>
                <div className="score-label">Score</div>
              </div>
            </div>
            <div className="score-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">FMCSA Data</span>
                <span className="breakdown-value">{scoreBreakdown.fmsaData}%</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Document Status</span>
                <span className="breakdown-value">{scoreBreakdown.documentStatus}%</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Driver Qualification</span>
                <span className="breakdown-value">{scoreBreakdown.driverQualification}%</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Safety History</span>
                <span className="breakdown-value">{scoreBreakdown.safetyHistory}%</span>
              </div>
            </div>
            <button className="view-score-breakdown">View Score Breakdown</button>
          </div>

          {/* Compliance Documents */}
          <div className="compliance-card compliance-documents">
            <h3>Compliance Documents</h3>
            <div className="compliance-documents-list">
              {complianceDocuments.map((doc, index) => (
                <div key={index} className={`compliance-document-row ${doc.status}`} style={{boxShadow: 'none', border: 'none', margin: 0}}>
                  <i className={`fa-solid ${
                    doc.status === 'valid' ? 'fa-shield-halved' :
                    doc.status === 'active' ? 'fa-id-card' :
                    doc.status === 'warning' ? 'fa-sun' :
                    'fa-file-medical'
                  } doc-icon ${doc.status}`} style={{fontSize: 22, marginRight: 12}}></i>
                  <div className="document-details" style={{flex: 1}}>
                    <div className="document-name" style={{fontWeight: 700, color: '#222e3a', fontSize: '1rem', marginBottom: 2}}>{doc.name}</div>
                    {doc.expires && (
                      <div className="document-expires" style={{fontSize: '0.93rem', color: '#64748b'}}>
                        {doc.status === 'valid' ? 'Valid until' : 'Expires'} {doc.expires}
                      </div>
                    )}
                    {doc.status === 'active' && !doc.expires && (
                      <div className="document-status" style={{fontSize: '0.93rem', color: '#64748b'}}>Active</div>
                    )}
                    {doc.status === 'missing' && (
                      <div className="document-status missing" style={{fontSize: '0.93rem', color: '#dc2626'}}>Missing</div>
                    )}
                  </div>
                  <i className={`fa-solid ${
                    doc.status === 'valid' ? 'fa-circle-check' :
                    doc.status === 'active' ? 'fa-circle-check' :
                    doc.status === 'warning' ? 'fa-triangle-exclamation' :
                    'fa-circle-xmark'
                  } doc-status-icon ${doc.status}`} style={{fontSize: 22, marginLeft: 'auto', color: (
                    doc.status === 'valid' || doc.status === 'active' ? '#22c55e' :
                    doc.status === 'warning' ? '#f59e0b' : '#dc2626')}}></i>
                </div>
              ))}
            </div>
            <button className="go-to-vault-btn">Go to Document Vault</button>
          </div>
        </div>
      </div>
    </div>
  );
}