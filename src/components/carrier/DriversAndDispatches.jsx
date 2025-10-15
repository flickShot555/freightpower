import React, { useState } from 'react';
import '../../styles/carrier/DriversAndDispatches.css';

const DriversAndDispatches = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [cdlFilter, setCdlFilter] = useState('All CDL Types');
  const [availabilityFilter, setAvailabilityFilter] = useState('All Availability');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  // Mock driver data based on the screenshot
  const drivers = [
    {
      id: 1,
      name: 'John Martinez',
      location: 'Houston, TX',
      avatar: 'JM',
      status: 'Available',
      cdlClass: 'A',
      endorsements: 'HazMat, Tanker',
      medicalCard: 'Valid until 12/31/24',
      equipment: 'Truck #5-67',
      assignLoad: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      location: 'Houston, TX',
      avatar: 'SJ',
      status: 'Assigned',
      cdlClass: 'A',
      endorsements: 'Passenger, School Bus',
      medicalCard: 'Expires 01/2025',
      equipment: 'Truck #5-67',
      assignLoad: false,
      onRoute: true
    },
    {
      id: 3,
      name: 'Mike Thompson',
      location: 'Dallas, TX',
      avatar: 'MT',
      status: 'Off Duty',
      cdlClass: 'B',
      endorsements: 'None',
      medicalCard: 'Expired 12/2024',
      equipment: 'Truck #0-89',
      assignLoad: false,
      offDuty: true
    },
    {
      id: 4,
      name: 'Lisa Chen',
      location: 'San Antonio, TX',
      avatar: 'LC',
      status: 'Available',
      cdlClass: 'A',
      endorsements: 'Oversized/Triple HazMat',
      medicalCard: 'Valid until 06/2025',
      equipment: 'Truck #3-34',
      assignLoad: true
    },
    {
      id: 5,
      name: 'Robert Davis',
      location: 'Fort Worth, TX',
      avatar: 'RD',
      status: 'Assigned',
      cdlClass: 'A',
      endorsements: 'Truck, HazMat',
      medicalCard: 'Valid until 08/2025',
      equipment: 'Truck #5-67',
      assignLoad: false,
      onRoute: true
    }
  ];

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCdl = cdlFilter === 'All CDL Types' || driver.cdlClass.includes(cdlFilter.replace('CDL ', ''));
    const matchesAvailability = availabilityFilter === 'All Availability' || driver.status === availabilityFilter;
    const matchesLocation = locationFilter === 'All Locations' || driver.location.includes(locationFilter);
    
    return matchesSearch && matchesCdl && matchesAvailability && matchesLocation;
  });

  return (
    <div className="drivers-dispatches">
      {/* Header Section */}
      <div className="drivers-header">
        <div className="drivers-header-content">
          <h1>Drivers & Dispatches</h1>
          <p className="drivers-subtitle">Manage your drivers and dispatch operations</p>
        </div>
        <div className="drivers-actions">
          <button className="btn small-cd">
            <i className="fas fa-plus"></i>
            Add Driver
          </button>
          <button className="btn small ghost-cd">
            <i className="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="drivers-nav">
        <div className="drivers-tabs">
          <button 
            className={`driver-tab ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            Driver Directory
          </button>
          <button 
            className={`driver-tab ${activeTab === 'dispatch' ? 'active' : ''}`}
            onClick={() => setActiveTab('dispatch')}
          >
            Dispatch Board
          </button>
          <button 
            className={`driver-tab ${activeTab === 'app' ? 'active' : ''}`}
            onClick={() => setActiveTab('app')}
          >
          </button>
        </div>
      </div>

      {/* Driver Directory Tab Content */}
      {activeTab === 'directory' && (
        <>
          {/* Search and Filters */}
          <div className="drivers-controls">
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="drivers-search"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters-container">
              <select
                className="driver-dd-filter-select"
                value={cdlFilter}
                onChange={(e) => setCdlFilter(e.target.value)}
              >
                <option>All CDL Types</option>
                <option>CDL Class A</option>
                <option>CDL Class B</option>
                <option>CDL Class C</option>
              </select>
              <select
                className="driver-dd-filter-select"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option>All Availability</option>
                <option>Available</option>
                <option>Assigned</option>
                <option>Off Duty</option>
              </select>
              <select
                className="driver-dd-filter-select"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option>All Locations</option>
                <option>Houston</option>
                <option>Dallas</option>
                <option>San Antonio</option>
                <option>Fort Worth</option>
              </select>
            </div>
          </div>

          {/* Driver Cards Grid */}
          <div className="drivers-grid">
            {filteredDrivers.map(driver => (
              <div key={driver.id} className="driver-card">
                <div className="driver-header">
                  <div className="driver-profile">
                    <div className={`driver-avatar ${driver.status.toLowerCase().replace(' ', '-')}`}>
                      {driver.avatar}
                    </div>
                    <div className="driver-info">
                      <h3>{driver.name}</h3>
                      <p>{driver.location}</p>
                    </div>
                  </div>
                  <div className={`driver-status ${driver.status.toLowerCase().replace(' ', '-')}`}>
                    {driver.status}
                  </div>
                </div>

                <div className="driver-details">
                  <div className="driver-row cdl-class">
                    <span className="label">CDL Class:</span>
                    <span className="value">{driver.cdlClass}</span>
                  </div>
                  <div className="driver-row">
                    <span className="label">Endorsements:</span>
                    <span className="value">{driver.endorsements}</span>
                  </div>
                  <div className="driver-row">
                    <span className="label">Medical Card:</span>
                    <span className={`value ${driver.medicalCard.includes('Valid') ? 'valid' : ''}`}>{driver.medicalCard}</span>
                  </div>
                  <div className="driver-row">
                    <span className="label">Equipment:</span>
                    <span className="value">{driver.equipment}</span>
                  </div>
                </div>

                <div className="driver-actions">
                  <div className="icon-row">
                    {driver.assignLoad && (
                    <button className="btn small-cd" style={{width: "100%"}}>
                      Assign Load
                    </button>
                  )}
                    {driver.onRoute && (
                      <button className="btn small ghost-cd btn-on-route" title="On Route">
                        On Route
                      </button>
                    )}
                    {driver.offDuty && (
                      <button className="btn small ghost-cd btn-update-dock" title="Update Dock">
                        Off Duty
                      </button>
                    )}
                    <button className="btn-chat" title="Chat">
                      <i className="fas fa-comment"></i>
                    </button>
                    <button className="btn-more" title="More">
                      <i className="fas fa-ellipsis-h"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Dispatch Board Tab Content */}
      {activeTab === 'dispatch' && (
        <div className="dispatch-board">
          <div className="dispatch-board-row">
            {/* Active Drivers Section */}
            <div className="active-drivers">
              <div className="active-drivers-header">
                <h3>Active Drivers</h3>
                <span className="driver-count">24 drivers</span>
              </div>
              <div className="driver-status-filters">
                <span className="status-chip available">Available (8)</span>
                <span className="status-chip assigned">Assigned (12)</span>
                <span className="status-chip in-transit">In Transit (3)</span>
                <span className="status-chip rest">Rest (1)</span>
              </div>
              <div className="drivers-list">
                {/* Example driver card, repeat for each driver */}
                <div className="driver-item">
                  <div className="driver-header-row" style={{display: 'flex', alignItems: 'center', marginBottom: '2px', width: '100%'}}>
                    <div className="driver-header-left">
                      <img className="driver-avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Mike Rodriguez" />
                      <div className="driver-header-info">
                        <div className="driver-name">Mike Rodriguez</div>
                        <div className="driver-label">CDL-A, HazMat</div>
                      </div>
                    </div>
                    <div className="driver-header-dot">
                      <span className="driver-status-dot available"></span>
                    </div>
                  </div>
                  <div className="driver-row"><span className="driver-label">Status:</span><span className="driver-status available">Available</span></div>
                  <div className="driver-row"><span className="driver-label">Location:</span><span className="driver-value">Dallas, TX</span></div>
                  <div className="driver-row"><span className="driver-label">HOS Left:</span><span className="driver-value">8h 45m</span></div>
                  <div className="driver-row"><span className="driver-label">Truck:</span><span className="driver-value">TX-2847</span></div>
                </div>
                <div className="driver-item">
                  <div className="driver-header-row" style={{display: 'flex', alignItems: 'center', marginBottom: '2px', width: '100%'}}>
                    <div className="driver-header-left">
                      <img className="driver-avatar" src="https://randomuser.me/api/portraits/men/45.jpg" alt="James Wilson" />
                      <div className="driver-header-info">
                        <div className="driver-name">James Wilson</div>
                        <div className="driver-label">CDL-A</div>
                      </div>
                    </div>
                    <div className="driver-header-dot">
                      <span className="driver-status-dot assigned"></span>
                    </div>
                  </div>
                  <div className="driver-row"><span className="driver-label">Status:</span><span className="driver-status assigned">Assigned</span></div>
                  <div className="driver-row"><span className="driver-label">Location:</span><span className="driver-value">Phoenix, AZ</span></div>
                  <div className="driver-row"><span className="driver-label">HOS Left:</span><span className="driver-value">6h 20m</span></div>
                  <div className="driver-row"><span className="driver-label">Load:</span><span className="driver-link">#LD-4892</span></div>
                </div>
                <div className="driver-item">
                  <div className="driver-header-row" style={{display: 'flex', alignItems: 'center', marginBottom: '2px', width: '100%'}}>
                    <div className="driver-header-left">
                      <img className="driver-avatar" src="https://randomuser.me/api/portraits/women/68.jpg" alt="Sarah Chen" />
                      <div className="driver-header-info">
                        <div className="driver-name">Sarah Chen</div>
                        <div className="driver-label">CDL-A, Doubles</div>
                      </div>
                    </div>
                    <div className="driver-header-dot">
                      <span className="driver-status-dot available"></span>
                    </div>
                  </div>
                  <div className="driver-row"><span className="driver-label">Status:</span><span className="driver-status available">Available</span></div>
                  <div className="driver-row"><span className="driver-label">Location:</span><span className="driver-value">Denver, CO</span></div>
                  <div className="driver-row"><span className="driver-label">HOS Left:</span><span className="driver-value">10h 15m</span></div>
                  <div className="driver-row"><span className="driver-label">Truck:</span><span className="driver-value">CO-1923</span></div>
                </div>
                <div className="driver-item">
                  <div className="driver-header-row" style={{display: 'flex', alignItems: 'center', marginBottom: '2px', width: '100%'}}>
                    <div className="driver-header-left">
                      <img className="driver-avatar" src="https://randomuser.me/api/portraits/men/12.jpg" alt="Robert Johnson" />
                      <div className="driver-header-info">
                        <div className="driver-name">Robert Johnson</div>
                        <div className="driver-label">CDL-A, HazMat</div>
                      </div>
                    </div>
                    <div className="driver-header-dot">
                      <span className="driver-status-dot in-transit"></span>
                    </div>
                  </div>
                  <div className="driver-row"><span className="driver-label">Status:</span><span className="driver-status in-transit">In Transit</span></div>
                  <div className="driver-row"><span className="driver-label">Location:</span><span className="driver-value">-</span></div>
                  <div className="driver-row"><span className="driver-label">HOS Left:</span><span className="driver-value">-</span></div>
                  <div className="driver-row"><span className="driver-label">Truck:</span><span className="driver-value">-</span></div>
                </div>
              </div>
            </div>
            {/* Live Tracking Map Section */}
            <div className="live-tracking-map">
              <div className="live-tracking-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                <h3 style={{margin:0}}><h3>Live Tracking Map</h3></h3>
                <button className="btn small ghost-cd"><i className="fas fa-expand"></i> Fullscreen</button>
              </div>
              <div className="map-legend">
                  <span><span className="legend-dot available"></span>Available</span>
                  <span><span className="legend-dot assigned"></span>Assigned</span>
                  <span><span className="legend-dot in-transit"></span>In Transit</span>
                  <span><span className="legend-dot rest"></span>Rest/Exception</span>
                </div>
              <div className="map-container">
                <div className="map-placeholder">
                  <i className="fas fa-map-marked-alt"></i>
                  <p>Interactive North America Map<br/><span style={{fontSize:'0.95em',color:'#94a3b8'}}>Real-time GPS tracking of all drivers and trucks</span></p>
                  {/* Dots for drivers can be added here */}
                </div>
              </div>
            </div>
          </div>

          {/* Load Assignment & Control */}
          <div className="dispatch-section load-assignment">
            <div className="load-assignment-row">
              <div className="load-assignment-left">
                <div className="load-assignment-header-row">
                  <h3 className="load-assignment-title">Load Assignment & Control</h3>
                  <div className="load-assignment-actions">
                    <button className="btn small-cd"><i className="fas fa-plus"></i> Quick Assign</button>
                    <button className="btn small ghost-cd"><i className="fas fa-random"></i> Reassign Load</button>
                  </div>
                </div>
                <div className="load-assignment-content">
                  <div className="available-loads-col">
                    <div className="available-loads-title">Available Loads</div>
                    <div className="available-load-card">
                      <div className="available-load-card-main-grid">
                        <div className="available-load-id">#LD-7834</div>
                        <div className="available-load-price">$2,850</div>
                        <div className="available-load-label">Pickup:</div>
                        <div className="available-load-value">Chicago, IL</div>
                        <div className="available-load-label">Delivery:</div>
                        <div className="available-load-value">Atlanta, GA</div>
                        <div className="available-load-label">Due:</div>
                        <div className="available-load-due">Tomorrow 8:00 AM</div>
                        <div className="available-load-label">Weight:</div>
                        <div className="available-load-value">42,000 lbs</div>
                      </div>
                    </div>
                    <div className="available-load-card">
                      <div className="available-load-card-main-grid">
                        <div className="available-load-id">#LD-7835</div>
                        <div className="available-load-price">$3,200</div>
                        <div className="available-load-label">Pickup:</div>
                        <div className="available-load-value">Los Angeles, CA</div>
                        <div className="available-load-label">Delivery:</div>
                        <div className="available-load-value">Phoenix, AZ</div>
                        <div className="available-load-label">Due:</div>
                        <div className="available-load-due gray">Tomorrow 8:00 AM</div>
                        <div className="available-load-label">Weight:</div>
                        <div className="available-load-value">38,000 lbs</div>
                      </div>
                    </div>
                  </div>
                  <div className="exception-handling-col">
                    <div className="exception-handling-title">Exception Handling</div>
                    <div className="exception-card red">
                      <div className="exception-card-header">
                        <span className="exception-icon"><i className="fas fa-triangle-exclamation" ></i></span> <span>HOS Violation Alert</span> <span className="exception-time">2 min ago</span>
                      </div>
                      <div className="exception-desc">Robert Johnson approaching 14-hour limit on Load #LD-5021</div>
                      <div className="exception-actions">
                        <button className="btn small-cd">Force Rest</button>
                        <button className="btn small ghost-cd">Reassign Load</button>
                      </div>
                    </div>
                    <div className="exception-card yellow">
                      <div className="exception-card-header">
                        <span className="exception-icon"><i className="fas fa-triangle-exclamation" ></i></span> <span >Detention Report</span> <span className="exception-time">15 min ago</span>
                      </div>
                      <div className="exception-desc">James Wilson delayed 3+ hours at delivery - Load #LD-4892</div>
                      <div className="exception-actions">
                        <button className="btn small-cd">Log Detention</button>
                        <button className="btn small ghost-cd">Contact Customer</button>
                      </div>
                    </div>
                    <div className="exception-card blue">
                      <div className="exception-card-header">
                        <span className="exception-icon"><i className="fas fa-screwdriver-wrench"></i></span> <span>Maintenance Alert</span> <span className="exception-time">1 hour ago</span>
                      </div>
                      <div className="exception-desc">Truck TX-2847 due for inspection in 500 miles</div>
                      <div className="exception-actions">
                        <button className="btn small-cd">Schedule Service</button>
                        <button className="btn small ghost-cd">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Dispatch Activity */}
          {/* Stat Cards Row */}
          <div className="dispatch-metrics">
            <div className="dispatch-stat-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',width:'100%'}}>
                <div>
                  <div className="dispatch-stat-num">24</div>
                  <div className="dispatch-stat-label">Active Drivers</div>
                </div>
                <div className="dispatch-stat-icon green">
                  <i className="fas fa-users"></i>
                </div>
              </div>
              <div className="dispatch-stat-sub green"><i className="fas fa-arrow-up" style={{marginRight:'4px'}}></i>+2 from yesterday</div>
            </div>
            <div className="dispatch-stat-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',width:'100%'}}>
                <div>
                  <div className="dispatch-stat-num">8</div>
                  <div className="dispatch-stat-label">Available</div>
                </div>
                <div className="dispatch-stat-icon blue">
                  <i className="fas fa-user"></i>
                </div>
              </div>
              <div className="dispatch-stat-sub blue">Ready for assignment</div>
            </div>
            <div className="dispatch-stat-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',width:'100%'}}>
                <div>
                  <div className="dispatch-stat-num">15</div>
                  <div className="dispatch-stat-label">Active Loads</div>
                </div>
                <div className="dispatch-stat-icon purple">
                  <i className="fas fa-box"></i>
                </div>
              </div>
              <div className="dispatch-stat-sub purple">3 pending assignment</div>
            </div>
            <div className="dispatch-stat-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',width:'100%'}}>
                <div>
                  <div className="dispatch-stat-num">96%</div>
                  <div className="dispatch-stat-label">On-Time Rate</div>
                </div>
                <div className="dispatch-stat-icon green">
                  <i className="fas fa-clock"></i>
                </div>
              </div>
              <div className="dispatch-stat-sub green"><i className="fas fa-arrow-up" style={{marginRight:'4px'}}></i>+2.5% this week</div>
            </div>
            <div className="dispatch-stat-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',width:'100%'}}>
                <div>
                  <div className="dispatch-stat-num">3</div>
                  <div className="dispatch-stat-label">Active Alerts</div>
                </div>
                <div className="dispatch-stat-icon red">
                  <i className="fas fa-triangle-exclamation"></i>
                </div>
              </div>
              <div className="dispatch-stat-sub red">1 critical, 2 warnings</div>
            </div>
          </div>
          <div className="dispatch-section recent-activity">
            <h3>
              Recent Dispatch Activity
              <button className="btn-view-all">View All Activity</button>
            </h3>
            <div className="activity-list">
              <div className="dispatch-activity-item">
                <span className="activity-icon check">
                  <i className="fas fa-check-circle"></i>
                </span>
                <div className="activity-content">
                    <div>
                      <span style={{fontWeight:600}}>Mike Rodriguez</span> assigned to Load <a href="#" style={{textDecoration:'underline'}}>#LD-7834</a>
                    </div>
                    <div className="activity-meta">2 minutes ago by John Mitchell</div>
                </div>
              </div>
              <div className="dispatch-activity-item">
                <span className="activity-icon warning">
                  <i className="fas fa-exclamation-circle"></i>
                </span>
                <div className="activity-content">
                    <div>
                      <span style={{fontWeight:600}}>James Wilson</span> reported detention at pickup location
                    </div>
                    <div className="activity-meta">15 minutes ago</div>
                </div>
              </div>
              <div className="dispatch-activity-item">
                <span className="activity-icon exchange">
                  <i className="fas fa-exchange-alt"></i>
                </span>
                <div className="activity-content">
                    <div>
                      Load <a href="#" style={{textDecoration:'underline'}}>#LD-4892</a> reassigned from <span style={{fontWeight:600}}>David Thompson</span> to <span style={{fontWeight:600}}>Sarah Chen</span>
                    </div>
                    <div className="activity-meta">1 hour ago by John Mitchell</div>
                </div>
              </div>
              <div className="dispatch-activity-item">
                <span className="activity-icon alert">
                  <i className="fas fa-exclamation-triangle"></i>
                </span>
                <div className="activity-content">
                    <div>
                      <span style={{fontWeight:600}}>Robert Johnson</span> approaching HOS limit - automatic rest period initiated
                    </div>
                    <div className="activity-meta">2 hours ago</div>
                </div>
              </div>
              <div className="dispatch-activity-item">
                <span className="activity-icon location">
                  <i className="fas fa-map-marker-alt"></i>
                </span>
                <div className="activity-content">
                    <div>
                      <span style={{fontWeight:600}}>Sarah Chen</span> completed delivery for Load <a href="#" style={{textDecoration:'underline'}}>#LD-7801</a>
                    </div>
                    <div className="activity-meta">3 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversAndDispatches;