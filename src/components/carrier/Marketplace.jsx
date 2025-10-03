import React, { useState, useEffect } from 'react'
import '../../styles/carrier/Marketplace.css'
import '../../styles/carrier/ServicesPage.css'

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState('loads') // loads | drivers | services
  const [searchQuery, setSearchQuery] = useState('')
  const [equipmentType, setEquipmentType] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [distance, setDistance] = useState('')
  const [serviceTab, setServiceTab] = useState('all')
  const [showSidebar, setShowSidebar] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsMobile(true)
        setShowSidebar(false)
      } else {
        setIsMobile(false)
        setShowSidebar(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

          <div className="drivers-actions">
          <button className="btn-export">
            <i className="fa-solid fa-download"></i> Export
          </button>
          <button className="btn-post-request">
            <i className="fa-solid fa-plus"></i> Post Driver Request
          </button>
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
              <button aria-label="Previous page">&lt;</button>
              <button className="active" aria-current="page">1</button>
              <button>2</button>
              <button>3</button>
              <span>...</span>
              <button>25</button>
              <button aria-label="Next page">&gt;</button>
            </div>
          </div>
        </div>
      )}

      {/* Services Content */}
      {activeTab === 'services' && (
        <div className="services-page">
          {/* Service Tabs */}
          <div className="services-header">
            <div className="services-tabs">
              <button className={`service-tab ${serviceTab === 'all' ? 'active' : ''}`} onClick={() => setServiceTab('all')}>
                <i className="fa-solid fa-th"></i> All Services
              </button>
              <button className={`service-tab ${serviceTab === 'fuel' ? 'active' : ''}`} onClick={() => setServiceTab('fuel')}>
                <i className="fa-solid fa-gas-pump"></i> Fuel
              </button>
              <button className={`service-tab ${serviceTab === 'parking' ? 'active' : ''}`} onClick={() => setServiceTab('parking')}>
                <i className="fa-solid fa-square-parking"></i> Parking
              </button>
              <button className={`service-tab ${serviceTab === 'parts' ? 'active' : ''}`} onClick={() => setServiceTab('parts')}>
                <i className="fa-solid fa-cog"></i> Parts
              </button>
              <button className={`service-tab ${serviceTab === 'maintenance' ? 'active' : ''}`} onClick={() => setServiceTab('maintenance')}>
                <i className="fa-solid fa-wrench"></i> Maintenance
              </button>
              <button className={`service-tab ${serviceTab === 'factoring' ? 'active' : ''}`} onClick={() => setServiceTab('factoring')}>
                <i className="fa-solid fa-dollar-sign"></i> Factoring
              </button>
              <button className={`service-tab ${serviceTab === 'insurance' ? 'active' : ''}`} onClick={() => setServiceTab('insurance')}>
                <i className="fa-solid fa-shield-alt"></i> Insurance
              </button>
              <button className={`service-tab ${serviceTab === 'food' ? 'active' : ''}`} onClick={() => setServiceTab('food')}>
                <i className="fa-solid fa-utensils"></i> Food
              </button>
              <button className={`service-tab ${serviceTab === 'favourites' ? 'active' : ''}`} onClick={() => setServiceTab('food')}>
                <i className="fa-solid fa-heart"></i> Favourites
              </button>
              <button className={`service-tab ${serviceTab === 'history' ? 'active' : ''}`} onClick={() => setServiceTab('food')}>
                <i className="fa-solid fa-history"></i> History
              </button>
            </div>
          </div>
          <div className="services-main">
            {/* Services Grid and Info */}
            <div className="services-left">
              <div className="services-info">
                <span>Showing 247 service providers</span>
                <div className="sort-controls">
                  <label htmlFor="services-sort-select">Sort by:</label>
                  <select id="services-sort-select" className="filter-select" style={{ minWidth: 120 }}>
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="reviews">Reviews</option>
                    <option value="distance">Distance</option>
                  </select>
                  {isMobile && (
                    <button
                      className="btn-filter-toggle"
                      aria-label="Show Filters"
                      onClick={() => setShowSidebar((v) => !v)}
                      style={{ marginLeft: 8 }}
                    >
                      <i className="fa-solid fa-filter"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Service Cards Grid */}
              <div className="services-grid">
                {/* Pilot Flying J Card */}
                <div className="service-card">
                  <div className="card-header">
                    <div className="provider-info">
                      <div className="provider-logo red">PJ</div>
                      <div>
                        <h3>Pilot Flying J</h3>
                        <p>Fuel Network</p>
                      </div>
                    </div>
                    <i className="fa-regular fa-heart"></i>
                  </div>
                  <div className="service-features">
                    <span className="feature nationwide"><i class="fa-solid fa-location-dot"></i> Nationwide Coverage</span>
                    <div className="rating">
                      <span><i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i> 4.8</span>
                      <span>(1,247 reviews)</span>
                    </div>
                    <span className="discount"><i class="fa-solid fa-tag"></i> 12¢ off per gallon</span>
                    <span className="cashback">Plus 2% cash back on purchases</span>
                  </div>
                  <button className="btn-request">Request Quote</button>
                </div>

                {/* TruckPro Service Card */}
                <div className="service-card">
                  <div className="card-header">
                    <div className="provider-info">
                      <div className="provider-logo blue">TP</div>
                      <div>
                        <h3>TruckPro Service</h3>
                        <p>Maintenance & Repair</p>
                      </div>
                    </div>
                    <i className="fa-regular fa-heart"></i>
                  </div>
                  <div className="service-features">
                    <span className="location"><i class="fa-solid fa-location-dot"></i> Dallas, TX - 50 mile radius</span>
                    <div className="rating">
                      <span><i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i> 4.9</span>
                      <span>(456 reviews)</span>
                    </div>
                    <span className="emergency"><i class="fa-solid fa-clock"></i> 24/7 Emergency Service</span>
                    <span className="mobile">Mobile repair units available</span>
                  </div>
                  <button className="btn-request">Request Quote</button>
                </div>

                {/* Progressive Commercial Card */}
                <div className="service-card">
                  <div className="card-header">
                    <div className="provider-info">
                      <div className="provider-logo">PC</div>
                      <div>
                        <h3>Progressive Commercial</h3>
                        <p>Commercial Insurance</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-heart red"></i>
                  </div>
                  <div className="service-features">
                    <span className="coverage"><i class="fa-solid fa-location-dot"></i> All 50 States</span>
                    <div className="rating">
                      <span> 4.6</span>
                      <span>(2,134 reviews)</span>
                    </div>
                    <span className="savings"><i class="fa-solid fa-percent"></i> Save up to 25%</span>
                    <span className="discount">Multi-policy discount available</span>
                  </div>
                  <button className="btn-get-quote">Get Quote</button>
                </div>

                {/* RTS Financial Card */}
                <div className="service-card">
                  <div className="card-header">
                    <div className="provider-info">
                      <div className="provider-logo dollar">$</div>
                      <div>
                        <h3>RTS Financial</h3>
                        <p>Invoice Factoring</p>
                      </div>
                    </div>
                    <i className="fa-regular fa-heart"></i>
                  </div>
                  <div className="service-features">
                    <span className="service-type"><i class="fa-solid fa-location-dot"></i> Nationwide Service</span>
                    <div className="rating">
                      <span><i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i> 4.7</span>
                      <span>(892 reviews)</span>
                    </div>
                    <span className="funding"><i class="fa-solid fa-bolt"></i> Same-day funding</span>
                    <span className="rate">Rates starting at 1.5%</span>
                  </div>
                  <button className="btn-apply">Apply Now</button>
                </div>

                {/* SecurePark Network Card */}
                <div className="service-card">
                  <div className="card-header">
                    <div className="provider-info">
                      <div className="provider-logo purple">SP</div>
                      <div>
                        <h3>SecurePark Network</h3>
                        <p>Truck Parking</p>
                      </div>
                    </div>
                    <i className="fa-regular fa-heart"></i>
                  </div>
                  <div className="service-features">
                    <span className="locations"><i class="fa-solid fa-location-dot"></i> 150+ Locations</span>
                    <div className="rating">
                      <span><i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i> 4.5</span>
                      <span>(678 reviews)</span>
                    </div>
                    <span className="security"><i class="fa-solid fa-shield-alt"></i> Secure & Monitored</span>
                    <span className="available">24/7 security & reservations</span>
                  </div>
                  <button className="btn-reserve">Reserve Spot</button>
                </div>

                {/* FleetParts Direct Card */}
                <div className="service-card">
                  <div className="card-header">
                    <div className="provider-info">
                      <div className="provider-logo orange">FP</div>
                      <div>
                        <h3>FleetParts Direct</h3>
                        <p>Truck Parts & Components</p>
                      </div>
                    </div>
                    <i className="fa-regular fa-heart"></i>
                  </div>
                  <div className="service-features">
                    <span className="shipping"><i class="fa-solid fa-location-dot"></i> Same-day shipping</span>
                    <div className="rating">
                      <span><i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i> 4.8</span>
                      <span>(1,523 reviews)</span>
                    </div>
                    <span className="free-shipping"><i class="fa-solid fa-truck"></i> Free shipping $200+</span>
                    <span className="oem">OEM & aftermarket parts</span>
                  </div>
                  <button className="btn-browse">Browse Parts</button>
                </div>
              </div>

              <div className="load-more">
                <button className="btn-load-more">Load More Providers</button>
              </div>
            </div>

            {/* Filters Sidebar */}
            {(showSidebar || !isMobile) && (
              <div className={`services-sidebar${showSidebar && isMobile ? ' active' : ''}`}>
                {isMobile && (
                  <button
                    className="btn-filter-close"
                    aria-label="Close Filters"
                    onClick={() => setShowSidebar(false)}
                    style={{ float: 'right', marginBottom: 12 }}
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                )}
                <h3>Filters</h3>
                
                <div className="filter-section">
                  <h4>Location</h4>
                  <input type="text" placeholder="Enter city or ZIP code" className="location-input" />
                  <div className="radius-selector">
                    <label>Radius</label>
                    <select>
                      <option>25 miles</option>
                      <option>50 miles</option>
                      <option>100 miles</option>
                    </select>
                  </div>
                </div>

                <div className="filter-section">
                  <h4>Minimum Rating</h4>
                  <div className="rating-filters">
                    <label><input type="radio" name="rating" />
                      <i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i>
                      <i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i>
                      <i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i>
                      <i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i>
                      <i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i>
                      5 stars
                    </label>
                    <label><input type="radio" name="rating" />
                      <i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i>
                      <i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i>
                      <i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i>
                      <i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i>
                      4+ stars
                    </label>
                    <label><input type="radio" name="rating" />
                      <i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i>
                      <i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i>
                      <i className="fa-solid fa-star" style={{color:'#fbbf24'}}></i>
                      3+ stars
                    </label>
                  </div>
                </div>

                <div className="filter-section">
                  <h4>Service Features</h4>
                  <div className="feature-checkboxes">
                    <label><input type="checkbox" /> 24/7 Service</label>
                    <label><input type="checkbox" checked /> Mobile Service</label>
                    <label><input type="checkbox" checked /> Same-day Service</label>
                    <label><input type="checkbox" /> Warranty Included</label>
                  </div>
                </div>

                <div className="filter-section">
                  <h4>Price Range</h4>
                  <div className="price-filters">
                    <label><input type="radio" name="price" /> $ - Budget</label>
                    <label><input type="radio" name="price" checked /> $$ - Moderate</label>
                    <label><input type="radio" name="price" /> $$$ - Premium</label>
                  </div>
                </div>

                <div className="filter-actions">
                  <button className="btn-apply-filters">Apply Filters</button>
                  <button className="btn-clear-filters">Clear All Filters</button>
                </div>

                <div className="quick-actions">
                  <h4>Quick Actions</h4>
                  <button className="quick-action-btn service">
                    <i className="fa-solid fa-add"></i>
                    Request Service
                  </button>
                  <button className="quick-action-btn emergency">
                    <i className="fa-solid fa-exclamation-circle"></i>
                    Request Emergency Service
                  </button>
                  <button className="quick-action-btn maintenance">
                    <i className="fa-solid fa-calendar"></i>
                    Schedule Maintenance
                  </button>
                  <button className="quick-action-btn insurance">
                    <i className="fa-solid fa-shield"></i>
                    Get Insurance Quote
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}