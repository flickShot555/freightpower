import React, { useState } from 'react'
import '../../styles/carrier/Marketplace.css'

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState('loads') // loads | drivers | services
  const [searchQuery, setSearchQuery] = useState('')
  const [equipmentType, setEquipmentType] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [distance, setDistance] = useState('')

  // Mock drivers data
  const drivers = [
    {
      id: 1,
      name: 'Marcus Johnson',
      rating: 4.8,
      trips: 127,
      class: 'A - TX',
      location: 'Dallas, TX',
      experience: '5 years',
      endorsements: ['Hazmat', 'Tanker', 'Double/Triple'],
      safetyScore: 95,
      onTime: true,
      available: true,
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      lastActivity: '2 days ago',
      equipmentTypes: ['CDL Valid', 'Med Card Active', 'MVR Clean']
    },
    {
      id: 2,
      name: 'Sarah Williams',
      rating: 4.4,
      trips: 89,
      class: 'A - CA',
      location: 'Los Angeles, CA',
      experience: '3 years',
      endorsements: ['Hazmat', 'Passenger'],
      safetyScore: 92,
      onTime: true,
      available: true,
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      lastActivity: '1 day ago',
      equipmentTypes: ['CDL Valid', 'Med Card Active', 'MVR Clean']
    },
    {
      id: 3,
      name: 'Robert Martinez',
      rating: 4.7,
      trips: 203,
      class: 'A - FL',
      location: 'Miami, FL',
      experience: '7 years',
      endorsements: ['Tanker', 'Double/Triple'],
      safetyScore: 98,
      onTime: false,
      available: true,
      photo: 'https://randomuser.me/api/portraits/men/67.jpg',
      lastActivity: '5 hours ago',
      equipmentTypes: ['CDL Valid', 'Med Card Active', 'MVR Clean']
    },
    {
      id: 4,
      name: 'Jennifer Davis',
      rating: 5.0,
      trips: 45,
      class: 'A - NY',
      location: 'Buffalo, NY',
      experience: '2 years',
      endorsements: ['Hazmat', 'Tanker', 'Double/Triple', 'Passenger'],
      safetyScore: 100,
      onTime: true,
      available: true,
      photo: 'https://randomuser.me/api/portraits/women/68.jpg',
      lastActivity: '3 hours ago',
      equipmentTypes: ['CDL Valid', 'Med Card Active', 'MVR Clean']
    },
    {
      id: 5,
      name: 'David Thompson',
      rating: 4.6,
      trips: 156,
      class: 'B - IL',
      location: 'Chicago, IL',
      experience: '4 years',
      endorsements: ['None'],
      safetyScore: 88,
      onTime: false,
      available: false,
      photo: 'https://randomuser.me/api/portraits/men/71.jpg',
      lastActivity: '2 hours ago',
      equipmentTypes: ['CDL Expiring', 'Med Card Active', 'MVR Clear']
    }
  ]

  // Mock loads data
  const loads = [
    {
      id: 1,
      origin: 'Chicago, IL',
      destination: 'Dallas, TX',
      pickupDate: 'Dec 10, 2024',
      deliveryDate: 'Delivery: Dec 12, 2024',
      rate: '$2,850',
      perMile: '$1.75/mile',
      status: 'Active',
      postedTime: 'Posted 1h ago',
      carrier: 'Sky Jet',
      distance: '925 miles',
      urgency: 'normal'
    },
    {
      id: 2,
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      pickupDate: 'Dec 16, 2024',
      deliveryDate: 'Delivery: Dec 18, 2024',
      rate: '$1,950',
      perMile: '$3.12/mile',
      status: 'Pending',
      postedTime: 'Posted 4h ago',
      carrier: 'Reefer',
      distance: '662 miles',
      urgency: 'normal'
    },
    {
      id: 3,
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      pickupDate: 'Dec 4, 2024',
      deliveryDate: 'Delivery: Dec 12, 2024',
      rate: '$1,200',
      perMile: '$3.18/mile',
      status: 'Urgent',
      postedTime: 'Posted 8h ago',
      carrier: 'Flatbed',
      distance: '372 miles',
      urgency: 'urgent'
    }
  ]

  return (
    <div className="marketplace">
      <header className="marketplace-header">
        <div className="marketplace-header-content">
          <h1>Marketplace</h1>
          <p className="marketplace-subtitle">Find loads, hire drivers, and connect with service providers</p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="marketplace-nav">
        <div className="marketplace-tabs">
          <button
            className={`marketplace-tab ${activeTab === 'loads' ? 'active' : ''}`}
            onClick={() => setActiveTab('loads')}
          >
            <i className="fa-solid fa-truck" />
            Loads
          </button>
          <button
            className={`marketplace-tab ${activeTab === 'drivers' ? 'active' : ''}`}
            onClick={() => setActiveTab('drivers')}
          >
            <i className="fa-solid fa-user" />
            Drivers
          </button>
          <button
            className={`marketplace-tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <i className="fa-solid fa-tools" />
            Services
          </button>
        </div>
      </div>

      {/* Search and Filters - Only show on Loads tab */}
      {activeTab === 'loads' && (
        <div className="marketplace-controls">
          <div className="marketplace-inner">
            <div className="search-section">
          <div className="search-input-container">
            <i className="fa-solid fa-search search-icon" />
            <input
              type="text"
              className="marketplace-search"
              placeholder="Search loads, drivers, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">
              <i className="fa-solid fa-search" />
              Search
            </button>
          </div>
        </div>

        <div className="filters-section">
          <select
            className="filter-select"
            value={equipmentType}
            onChange={(e) => setEquipmentType(e.target.value)}
          >
            <option value="">Equipment Type</option>
            <option value="dry-van">Dry Van</option>
            <option value="reefer">Reefer</option>
            <option value="flatbed">Flatbed</option>
          </select>

          <input
            type="text"
            className="filter-input"
            placeholder="Origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />

          <input
            type="text"
            className="filter-input"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <input
            type="text"
            className="filter-input"
            placeholder="mm/dd/yyyy"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          />

          <select
            className="filter-select"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          >
            <option value="">Distance</option>
            <option value="0-100">0-100 miles</option>
            <option value="100-500">100-500 miles</option>
            <option value="500+">500+ miles</option>
          </select>
            </div>
          </div>
        </div>
      )}

      {/* Loads Content */}
      {activeTab === 'loads' && (
        <div className="loads-grid">
          {loads.map(load => (
            <div key={load.id} className={`load-card ${load.urgency === 'urgent' ? 'urgent' : ''}`}>
              <div className="load-card-header">
                <div className="route-info">
                  <div className="route-cities">
                    <span className="origin">{load.origin}</span>
                    <i className="fa-solid fa-arrow-right route-arrow" />
                    <span className="destination">{load.destination}</span>
                  </div>
                  <div className="route-meta">
                    <span className="pickup-date">{load.pickupDate}</span>
                    <span className="delivery-date">{load.deliveryDate}</span>
                  </div>
                </div>
                <div className={`status-badge status-${load.status.toLowerCase()}`}>
                  {load.status}
                </div>
              </div>

              <div className="load-details">
                <div className="load-rate">
                  <div className="rate-amount">{load.rate}</div>
                  <div className="rate-per-mile">{load.perMile}</div>
                </div>
                <div className="load-meta">
                  <div className="carrier-info">
                    <i className="fa-solid fa-truck carrier-icon" />
                    {load.carrier}
                  </div>
                  <div className="distance-info">
                    <i className="fa-solid fa-route" />
                    {load.distance}
                  </div>
                </div>
              </div>

              <div className="load-actions">
                <button className="btn-book-now">Bid/Counter</button>
                <button className="btn-accept">Accept</button>
              </div>

              <div className="posted-time">{load.postedTime}</div>
            </div>
          ))}
        </div>
      )}

      {/* Drivers Content */}
      {activeTab === 'drivers' && (
        <div className="drivers-content">
          <div className="drivers-filterbar">
            <div className="filter-row">
              <div className="filter-group">
                <label className="filter-label">Location &amp; Radius</label>
                <div className="location-radius">
                  <input className="filter-input" placeholder="City, State or ZIP" />
                </div>
              </div>
              <div className="location-radius">
                  <select className="filter-select radius-select">
                    <option>25 miles</option>
                    <option>50 miles</option>
                    <option>100 miles</option>
                  </select>
                </div>
              <div className="filter-group">
                <label className="filter-label">CDL Class</label>
                <select className="filter-select">
                  <option>All Classes</option>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select className="filter-select">
                  <option>All Status</option>
                  <option>Available</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Compliance</label>
                <select className="filter-select">
                  <option>All</option>
                  <option>Compliant</option>
                  <option>Non-Compliant</option>
                </select>
              </div>
            </div>
            <div className="endorsements-row">
              <span className="filter-label">Endorsements</span>
              <button className="endorsement-chip selected">Hazmat</button>
              <button className="endorsement-chip">Tanker</button>
              <button className="endorsement-chip">Double/Triple</button>
              <button className="endorsement-chip">Passenger</button>
              <button className="endorsement-chip">School Bus</button>
            </div>
            <div className="drivers-toolbar">
              <div className="drivers-count">1,247 drivers found</div>
              <div className="drivers-sort">
                <label>Sort by:</label>
                <select>
                  <option>Relevance</option>
                  <option>Rating</option>
                  <option>Experience</option>
                  <option>Location</option>
                </select>
              </div>
            </div>
          </div>

          <div className="drivers-list">
            {drivers.map(driver => (
              <div key={driver.id} className="driver-card" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                  <div className="driver-avatar" style={{alignSelf:'flex-start'}}>
                    <img src={driver.photo} alt={driver.name} />
                  </div>
                  <div className="driver-info">
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <div className="driver-name" style={{fontWeight:700, fontSize:'1rem'}}>{driver.name}</div>
                      <span style={{color:'#fbbf24', fontWeight:600, fontSize:'0.95rem', marginLeft:4}}>
                        <i className="fa-solid fa-star" style={{marginRight:2}} />
                        {driver.rating}
                      </span>
                      <span style={{color:'#64748b', fontSize:'0.92rem', marginLeft:8}}>&#8226; {driver.trips} trips</span>
                    </div>
                    <div style={{display:'flex', gap:32, marginTop:6, marginBottom:2}}>
                      <div>
                        <div style={{color:'#94a3b8', fontWeight:600, fontSize:'0.85rem'}}>CDL INFO</div>
                        <div style={{fontWeight:600, fontSize:'0.95rem'}}>Class {driver.class}</div>
                        <div style={{color:'#64748b', fontSize:'0.9rem'}}>Exp: 03/2025</div>
                      </div>
                      <div>
                        <div style={{color:'#94a3b8', fontWeight:600, fontSize:'0.85rem'}}>LOCATION</div>
                        <div style={{fontWeight:600, fontSize:'0.95rem'}}>{driver.location}</div>
                        <div style={{color:'#64748b', fontSize:'0.9rem'}}>2 hours ago</div>
                      </div>
                      <div>
                        <div style={{color:'#94a3b8', fontWeight:600, fontSize:'0.85rem'}}>STATUS</div>
                        <div style={{color:'#22c55e', fontWeight:600, fontSize:'0.95rem'}}><i className="fa-solid fa-circle" style={{fontSize:'0.7em', marginRight:4}}/> Available</div>
                      </div>
                      <div>
                        <div style={{color:'#94a3b8', fontWeight:600, fontSize:'0.85rem'}}>AI SAFETY SCORE</div>
                        <div style={{color:'#16a34a', fontWeight:700, fontSize:'0.95rem'}}>95/100</div>
                      </div>
                    </div>
                    <div className="driver-endorsements" style={{marginTop:4}}>
                      <span style={{color:'#64748b', fontWeight:500, fontSize:'0.92rem'}}>Endorsements:</span>
                      {driver.endorsements.map((endorsement, index) => (
                        <span key={index} className={`endorsement ${endorsement.toLowerCase().replace(/[/\s]/g, '-')}`} style={{fontSize:'0.92rem'}}>{endorsement}</span>
                      ))}
                    </div>
                    <div className="driver-equipment">
                      {driver.equipmentTypes.map((equipment, index) => (
                        <span key={index} className={`equipment ${equipment.toLowerCase().replace(/\s/g, '-')}`} style={{fontSize:'0.92rem'}}>
                          <i className={`fa-solid ${equipment.includes('Valid') || equipment.includes('Active') || equipment.includes('Clean') ? 'fa-check-circle' : equipment.includes('Expiring') ? 'fa-exclamation-triangle' : 'fa-times-circle'}`} />
                          {equipment}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="driver-actions">
                  <button className={`btn-hire ${driver.available ? 'active' : 'inactive'}`}>{driver.available ? 'Hire Driver' : 'Not Available'}</button>
                  <div className="driver-menu">
                    <i className="fa-solid fa-file-invoice" />
                    <i className="fa-solid fa-message" />
                    <i className="fa-regular fa-heart" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="drivers-pagination">
            <span>Showing 1-5 of 1,247 drivers</span>
            <div className="pagination">
              <button>1</button>
              <button>2</button>
              <button>3</button>
              <span>...</span>
              <button>25</button>
            </div>
          </div>
        </div>
      )}

      {/* Services Content */}
      {activeTab === 'services' && (
        <div className="services-content">
          <div className="coming-soon">
            <i className="fa-solid fa-tools fa-3x" />
            <h3>Service Marketplace Coming Soon</h3>
            <p>Find maintenance, repair, and other logistics services</p>
          </div>
        </div>
      )}
    </div>
  )
}