import React, { useState } from 'react';
import '../../styles/carrier/ConsentESignature.css';

export default function ConsentESignature() {
  const [activeTab, setActiveTab] = useState('active-signatures');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  // Active Signatures state
  const [documentSearch, setDocumentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('All Document Types');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Templates data matching the screenshot
  const templates = [
    {
      id: 1,
      name: 'Driver Employment Agreement',
      description: 'Comprehensive employment contract for new drivers including terms, conditions, and safety requirements.',
      category: 'HR',
      categoryColor: '#4285f4',
      icon: 'fa-solid fa-user',
      updated: '2 days ago'
    },
    {
      id: 2,
      name: 'Safety Training Acknowledgment',
      description: 'Mandatory safety training completion form with acknowledgement of safety protocols and procedures.',
      category: 'Safety',
      categoryColor: '#22c55e',
      icon: 'fa-solid fa-shield-halved',
      updated: '1 week ago'
    },
    {
      id: 3,
      name: 'Non-Disclosure Agreement',
      description: 'Standard NDA template for protecting confidential business information and trade secrets.',
      category: 'Legal',
      categoryColor: '#9c27b0',
      icon: 'fa-solid fa-scale-balanced',
      updated: '3 days ago'
    },
    {
      id: 4,
      name: 'DOT Physical Certification',
      description: 'Medical examination certification form required for commercial driver compliance.',
      category: 'Compliance',
      categoryColor: '#ff9800',
      icon: 'fa-solid fa-stethoscope',
      updated: '5 days ago'
    },
    {
      id: 5,
      name: 'Broker Service Agreement',
      description: 'Standard service agreement template for establishing partnerships with freight brokers.',
      category: 'Legal',
      categoryColor: '#e91e63',
      icon: 'fa-solid fa-handshake',
      updated: '1 week ago'
    },
    {
      id: 6,
      name: 'Background Check Authorization',
      description: 'Authorization form for conducting background checks on potential drivers and employees.',
      category: 'HR',
      categoryColor: '#00bcd4',
      icon: 'fa-solid fa-user-check',
      updated: '4 days ago'
    }
  ];

  // Mock data for signature activity
  const signatureActivity = [
    {
      id: 1,
      document: 'Driver Employment Agreement',
      signer: 'John Martinez',
      status: 'Completed',
      timestamp: '2 hours ago',
      statusColor: 'green'
    },
    {
      id: 2,
      document: 'Safety Training Acknowledgment',
      signer: 'Sarah Johnson',
      status: 'Pending',
      timestamp: '1 day ago',
      statusColor: 'orange'
    },
    {
      id: 3,
      document: 'NDA - Broker Partnership',
      signer: 'FastTrack Logistics',
      status: 'Sent',
      timestamp: '3 days ago',
      statusColor: 'blue'
    }
  ];

  const categories = ['All Categories', 'HR', 'Safety', 'Legal', 'Compliance'];

  // Statistics data
  const signatureStats = {
    pending: 24,
    partiallySigned: 8,
    completedToday: 12,
    overdue: 3
  };

  // Active documents data
  const activeDocuments = [
    {
      id: 1,
      name: 'Driver Agreement - Q4 2024',
      type: 'PDF',
      size: '2.4 MB',
      recipients: [
        { name: 'Mike Johnson', status: 'Pending', avatar: 'MJ' },
        { name: 'Sarah Davis', status: 'Signed', avatar: 'SD' }
      ],
      initiator: 'John Carter',
      dateSent: 'Jan 15, 2025',
      dueDate: 'Jan 22, 2025',
      status: 'Partially Signed',
      statusColor: 'orange',
      icon: 'fa-file-alt',
      iconColor: 'blue'
    },
    {
      id: 2,
      name: 'NDA - TechCorp Partnership',
      type: 'PDF',
      size: '1.8 MB',
      recipients: [
        { name: 'Robert Wilson', status: 'Declined', avatar: 'RW' }
      ],
      initiator: 'John Carter',
      dateSent: 'Jan 12, 2025',
      dueDate: 'Jan 19, 2025',
      status: 'Declined',
      statusColor: 'red',
      icon: 'fa-file-contract',
      iconColor: 'purple'
    },
    {
      id: 3,
      name: 'Safety Handbook 2025',
      type: 'PDF',
      size: '5.2 MB',
      recipients: [
        { name: 'Lisa Martinez', status: 'Pending', avatar: 'LM' },
        { name: 'David Brown', status: 'Pending', avatar: 'DB' }
      ],
      moreRecipients: 3,
      initiator: 'Emily Johnson',
      dateSent: 'Jan 14, 2025',
      dueDate: 'Jan 28, 2025',
      status: 'Pending',
      statusColor: 'orange',
      icon: 'fa-book',
      iconColor: 'orange'
    },
    {
      id: 4,
      name: 'Carrier Onboarding Packet',
      type: 'PDF',
      size: '3.1 MB',
      recipients: [
        { name: 'Amanda White', status: 'Signed', avatar: 'AW' }
      ],
      initiator: 'John Carter',
      dateSent: 'Jan 10, 2025',
      dueDate: 'Jan 17, 2025',
      status: 'Signed',
      statusColor: 'green',
      icon: 'fa-clipboard-check',
      iconColor: 'green'
    },
    {
      id: 5,
      name: 'Bill of Lading - Load #2458',
      type: 'PDF',
      size: '1.2 MB',
      recipients: [
        { name: 'Mike Johnson', status: 'Pending', avatar: 'MJ' }
      ],
      initiator: 'Emily Johnson',
      dateSent: 'Jan 16, 2025',
      dueDate: 'Jan 18, 2025',
      status: 'Overdue',
      statusColor: 'red',
      icon: 'fa-file-alt',
      iconColor: 'blue'
    }
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(activeDocuments.length / itemsPerPage);
  const currentDocuments = activeDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(currentDocuments.map(doc => doc.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDocumentSelect = (documentId) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'template-blue',
      green: 'template-green',
      purple: 'template-purple',
      orange: 'template-orange',
      red: 'template-red',
      teal: 'template-teal'
    };
    return colorMap[color] || 'template-blue';
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="consent-esignature">
      {/* Header */}
      <header className="consent-header">
        <div className="header-content">
          <h1>Consent & eSignature</h1>
          <p className="header-subtitle">Manage digital signatures, templates, and compliance documentation</p>
        </div>
        <div className="header-actions">
          {activeTab === 'active-signatures' ? (
            <>
              <button className="btn-action new-document">
                <i className="fa-solid fa-plus"></i>
                New Document
              </button>
              <button className="btn-action export-list">
                <i className="fa-solid fa-file-export"></i>
                Export List
              </button>
            </>
          ) : activeTab === 'completed-archive' ? (
            <>
              <button className="btn-action export">
                <i className="fa-solid fa-download"></i>
                Export
              </button>
              <button className="btn-action move-to-vault">
                <i className="fa-solid fa-archive"></i>
                Move to Vault
              </button>
            </>
          ) : (
            <>
              <button className="btn-action create-agreement">
                <i className="fa-solid fa-plus"></i>
                Create Agreement
              </button>
              <button className="btn-action upload-template">
                <i className="fa-solid fa-upload"></i>
                Upload Template
              </button>
            </>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="consent-tabs">
        <button 
          className={`tab-btn ${activeTab === 'template-library' ? 'active' : ''}`}
          onClick={() => setActiveTab('template-library')}
        >
          Template Library
        </button>
        <button 
          className={`tab-btn ${activeTab === 'active-signatures' ? 'active' : ''}`}
          onClick={() => setActiveTab('active-signatures')}
        >
          Active Signatures
        </button>
        <button 
          className={`tab-btn ${activeTab === 'completed-archive' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed-archive')}
        >
          Completed Archive
        </button>
      </div>

      {/* Template Library Tab */}
      {activeTab === 'template-library' && (
        <div className="template-library">
          {/* Search and Filter Bar */}
          <div className="search-filter-bar">
            <div className="search-box">
              <i className="fa-solid fa-search"></i>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="category-select-wrapper">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down category-select-icon"></i>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="templates-grid">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="template-card">
                <div className="template-header">
                  <div className="template-category-badge" style={{ backgroundColor: template.categoryColor }}>
                    <i className={template.icon}></i>
                  </div>
                  <div className="template-category-label">{template.category}</div>
                </div>
                <div className="template-content">
                  <h3 className="template-name">{template.name}</h3>
                  <p className="template-description">{template.description}</p>
                  <div className="template-meta">
                    <span className="template-updated">Updated {template.updated}</span>
                  </div>
                </div>
                <div className="template-actions">
                  <button className="use-template-btn">Use Template</button>
                </div>
              </div>
            ))}
          </div>
          <div className="recent-activity-section">
        <h3>Recent Signature Activity</h3>
        <div className="activity-list">
          {signatureActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                <i className={`fa-solid ${
                  activity.status === 'Completed' ? 'fa-check-circle' :
                  activity.status === 'Pending' ? 'fa-clock' : 'fa-paper-plane'
                }`}></i>
              </div>
              <div className="activity-content">
                <div className="activity-document">{activity.document}</div>
                <div className="activity-signer">Signed by {activity.signer}</div>
              </div>
              <div className="activity-status">
                <span className={`status-badge ${activity.statusColor}`}>{activity.status}</span>
                <div className="activity-time">{activity.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </div>
      )}

      {/* Active Signatures Tab */}
      {activeTab === 'active-signatures' && (
        <div className="active-signatures">
          {/* Statistics Cards */}
          <div className="signature-stats">
            <div className="stat-card pending">
              <div className="stat-content">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{signatureStats.pending}</div>
              </div>
              <div className="stat-icon">
                <i className="fa-solid fa-clock"></i>
              </div>
            </div>
            <div className="stat-card partially-signed">
              <div className="stat-content">
                <div className="stat-label">Partially Signed</div>
                <div className="stat-value">{signatureStats.partiallySigned}</div>
              </div>
              <div className="stat-icon">
                <i className="fa-solid fa-pen-alt"></i>
              </div>
            </div>
            <div className="stat-card completed">
              <div className="stat-content">
                <div className="stat-label">Completed Today</div>
                <div className="stat-value">{signatureStats.completedToday}</div>
              </div>
              <div className="stat-icon">
                <i className="fa-solid fa-check-circle"></i>
              </div>
            </div>
            <div className="stat-card overdue">
              <div className="stat-content">
                <div className="stat-label">Overdue</div>
                <div className="stat-value">{signatureStats.overdue}</div>
              </div>
              <div className="stat-icon">
                <i className="fa-solid fa-exclamation-triangle"></i>
              </div>
            </div>
          </div>

          {/* Document Filters */}
          <div className="document-filters">
            <div className="filter-row">
              <div className="search-box">
                <i className="fa-solid fa-search"></i>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={documentSearch}
                  onChange={(e) => setDocumentSearch(e.target.value)}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All Status">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Partially Signed">Partially Signed</option>
                <option value="Signed">Signed</option>
                <option value="Declined">Declined</option>
                <option value="Overdue">Overdue</option>
              </select>
              <select
                value={documentTypeFilter}
                onChange={(e) => setDocumentTypeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All Document Types">All Document Types</option>
                <option value="PDF">PDF</option>
                <option value="DOC">DOC</option>
                <option value="DOCX">DOCX</option>
              </select>
            </div>
          </div>

          {/* Active Documents Table */}
          <div className="documents-table-container">
            <div className="table-header">
              <h3>Active Documents</h3>
              <div className="table-actions">
                <label className="select-all">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  Select All
                </label>
              </div>
            </div>

            <div className="documents-table">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>DOCUMENT NAME</th>
                    <th>RECIPIENTS</th>
                    <th>INITIATOR</th>
                    <th>DATE SENT</th>
                    <th>DUE DATE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDocuments.map((document) => (
                    <tr key={document.id} className={selectedDocuments.includes(document.id) ? 'selected' : ''}>
                      <td data-label="Select">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(document.id)}
                          onChange={() => handleDocumentSelect(document.id)}
                        />
                      </td>
                      <td data-label="Document">
                        <div className="document-name-cell">
                          <div className={`document-icon ${document.iconColor}`}>
                            <i className={`fa-solid ${document.icon}`}></i>
                          </div>
                          <div className="document-info">
                            <div className="document-title">{document.name}</div>
                            <div className="document-meta">{document.type} • {document.size}</div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Recipients">
                        <div className="recipients-cell">
                          {document.recipients.map((recipient, index) => (
                            <div key={index} className="recipient-item">
                              <div className="recipient-avatar">{recipient.avatar}</div>
                              <div className="recipient-info">
                                <div className="recipient-name">{recipient.name}</div>
                                <div className={`recipient-status ${recipient.status.toLowerCase()}`}>
                                  {recipient.status}
                                </div>
                              </div>
                            </div>
                          ))}
                          {document.moreRecipients && (
                            <div className="more-recipients">
                              +{document.moreRecipients} more recipients
                            </div>
                          )}
                        </div>
                      </td>
                      <td data-label="Initiator">
                        <div className="initiator-cell">
                          <div className="initiator-avatar">
                            <i className="fa-solid fa-user"></i>
                          </div>
                          <div className="initiator-name">{document.initiator}</div>
                        </div>
                      </td>
                      <td data-label="Date Sent" className="date-cell">{document.dateSent}</td>
                      <td data-label="Due Date" className={`due-date-cell ${document.status === 'Overdue' ? 'overdue' : ''}`}>
                        {document.dueDate}
                      </td>
                      <td data-label="Status">
                        <span className={`status-badge ${document.statusColor}`}>
                          {document.status === 'Partially Signed' ? 'Partially Signed' : document.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <div className="pagination-info">
                Showing 1 to {Math.min(itemsPerPage, activeDocuments.length)} of {activeDocuments.length} documents
              </div>
              <div className="pagination-controls">
                <button 
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Pre
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button 
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Archive Tab */}
      {activeTab === 'completed-archive' && (
        <div className="completed-archive">
          {/* Document Filters */}
          <div className="document-filters">
            <div className="filter-row">
              <div className="search-box">
                <i className="fa-solid fa-search"></i>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={documentSearch}
                  onChange={(e) => setDocumentSearch(e.target.value)}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All Status">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Partially Signed">Partially Signed</option>
                <option value="Signed">Signed</option>
                <option value="Declined">Declined</option>
                <option value="Overdue">Overdue</option>
              </select>
              <select
                value={documentTypeFilter}
                onChange={(e) => setDocumentTypeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All Document Types">All Document Types</option>
                <option value="PDF">PDF</option>
                <option value="DOC">DOC</option>
                <option value="DOCX">DOCX</option>
              </select>
            </div>
          </div>

          {/* Archive Documents Table */}
          <div className="documents-table-container">
            <div className="documents-table">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>DOCUMENT NAME</th>
                    <th>RECIPIENTS</th>
                    <th>DATE COMPLETED</th>
                    <th>RETENTION TAG</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Select">
                      <input type="checkbox" />
                    </td>
                    <td data-label="Document">
                      <div className="document-name-cell">
                        <div className="document-icon red">
                          <i className="fa-solid fa-file-pdf"></i>
                        </div>
                        <div className="document-info">
                          <div className="document-title">Carrier Safety Packet v2.1</div>
                          <div className="document-meta">Contract #CSP-2024-001</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Recipients">
                      <div className="recipients-cell">
                        <div className="recipient-item">
                          <div className="recipient-avatar">JS</div>
                          <span className="recipient-name">John Smith</span>
                        </div>
                        <div className="more-recipients">+2 others</div>
                      </div>
                    </td>
                    <td data-label="Date Completed">
                      <div className="date-cell">Dec 15, 2024 2:34 PM</div>
                    </td>
                    <td data-label="Retention Tag">
                      <span className="retention-tag three-year">3-Year Storage</span>
                    </td>
                    <td data-label="Status">
                      <span className="status-badge green">Signed & Archived</span>
                    </td>
                    <td data-label="Action">
                      <button className="action-btn view">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Select">
                      <input type="checkbox" />
                    </td>
                    <td data-label="Document">
                      <div className="document-name-cell">
                        <div className="document-icon blue">
                          <i className="fa-solid fa-file-alt"></i>
                        </div>
                        <div className="document-info">
                          <div className="document-title">Master Service Agreement</div>
                          <div className="document-meta">Contract #MSA-2024-089</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Recipients">
                      <div className="recipients-cell">
                        <div className="recipient-item">
                          <div className="recipient-avatar">SJ</div>
                          <span className="recipient-name">Sarah Johnson</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Date Completed">
                      <div className="date-cell">Dec 14, 2024 11:22 AM</div>
                    </td>
                    <td data-label="Retention Tag">
                      <span className="retention-tag permanent">Permanent</span>
                    </td>
                    <td data-label="Status">
                      <span className="status-badge green">Signed & Archived</span>
                    </td>
                    <td data-label="Action">
                      <button className="action-btn view">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Select">
                      <input type="checkbox" />
                    </td>
                    <td data-label="Document">
                      <div className="document-name-cell">
                        <div className="document-icon green">
                          <i className="fa-solid fa-file-excel"></i>
                        </div>
                        <div className="document-info">
                          <div className="document-title">Bill of Lading #BOL-789456</div>
                          <div className="document-meta">Load #FP-2024-3421</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Recipients">
                      <div className="recipients-cell">
                        <div className="recipient-item">
                          <div className="recipient-avatar">MD</div>
                          <span className="recipient-name">Mike Davis</span>
                        </div>
                        <div className="more-recipients">+1 other</div>
                      </div>
                    </td>
                    <td data-label="Date Completed">
                      <div className="date-cell">Dec 13, 2024 4:15 PM</div>
                    </td>
                    <td data-label="Retention Tag">
                      <span className="retention-tag five-year">5-Year Storage</span>
                    </td>
                    <td data-label="Status">
                      <span className="status-badge green">Signed & Archived</span>
                    </td>
                    <td data-label="Action">
                      <button className="action-btn view">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Select">
                      <input type="checkbox" />
                    </td>
                    <td data-label="Document">
                      <div className="document-name-cell">
                        <div className="document-icon purple">
                          <i className="fa-solid fa-shield-alt"></i>
                        </div>
                        <div className="document-info">
                          <div className="document-title">Non-Disclosure Agreement</div>
                          <div className="document-meta">NDA-2024-156</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Recipients">
                      <div className="recipients-cell">
                        <div className="recipient-item">
                          <div className="recipient-avatar">LC</div>
                          <span className="recipient-name">Lisa Chen</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Date Completed">
                      <div className="date-cell">Dec 12, 2024 9:45 AM</div>
                    </td>
                    <td data-label="Retention Tag">
                      <span className="retention-tag three-year">3-Year Storage</span>
                    </td>
                    <td data-label="Status">
                      <span className="status-badge green">Signed & Archived</span>
                    </td>
                    <td data-label="Action">
                      <button className="action-btn view">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Select">
                      <input type="checkbox" />
                    </td>
                    <td data-label="Document">
                      <div className="document-name-cell">
                        <div className="document-icon orange">
                          <i className="fa-solid fa-clipboard-check"></i>
                        </div>
                        <div className="document-info">
                          <div className="document-title">Proof of Delivery #POD-321987</div>
                          <div className="document-meta">Load #FP-2024-3420</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Recipients">
                      <div className="recipients-cell">
                        <div className="recipient-item">
                          <div className="recipient-avatar">RW</div>
                          <span className="recipient-name">Robert Wilson</span>
                        </div>
                        <div className="more-recipients">+2 others</div>
                      </div>
                    </td>
                    <td data-label="Date Completed">
                      <div className="date-cell">Dec 11, 2024 6:30 PM</div>
                    </td>
                    <td data-label="Retention Tag">
                      <span className="retention-tag five-year">5-Year Storage</span>
                    </td>
                    <td data-label="Status">
                      <span className="status-badge green">Signed & Archived</span>
                    </td>
                    <td data-label="Action">
                      <button className="action-btn view">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <div className="pagination-info">
                Showing 1 to 10 of 247 results
              </div>
              <div className="pagination-controls">
                <button className="pagination-btn" disabled>
                  Pre
                </button>
                <button className="pagination-number active">1</button>
                <button className="pagination-number">2</button>
                <button className="pagination-number">3</button>
                <span className="pagination-ellipsis">...</span>
                <button className="pagination-number">25</button>
                <button className="pagination-btn">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Retention & Compliance Notice */}
          <div className="retention-compliance-notice">
            <div className="notice-content">
              <div className="notice-icon">
                <i className="fa-solid fa-info-circle"></i>
              </div>
              <div className="notice-text">
                <h4>Retention & Compliance</h4>
                <p>Documents are automatically tagged with retention policies based on type and regulatory requirements.</p>
              </div>
            </div>
            <div className="notice-actions">
              <button className="btn-compliance-export">
                <i className="fa-solid fa-download"></i>
                Compliance Export
              </button>
              <button className="btn-retention-settings">
                <i className="fa-solid fa-cog"></i>
                Retention Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}