import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

import DocumentVault from './DocumentVault';
import Marketplace from './Marketplace';
import MyCarrier from './MyCarrier';
import HiringOnboarding from './HiringOnboarding';
import AccountSettings from './AccountSettings';
import AiHub from './AiHub';
import ConsentESignature from './ConsentESignature';
import Messaging from './Messaging';
import HereMap from '../common/HereMap';
// OnboardingCoach removed - compliance data now shown in Compliance & Safety page
import '../../styles/driver/DriverDashboard.css';
import logo from '/src/assets/logo.png';
import resp_logo from '/src/assets/logo_1.png';

export default function DriverDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPostHire, setIsPostHire] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportFormData, setSupportFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [supportSubmitting, setSupportSubmitting] = useState(false);
  const fileUploadRef = React.useRef(null);

  // Messaging unread badge
  const [messagingUnread, setMessagingUnread] = useState(0);

  // Onboarding data state
  const [driverProfile, setDriverProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [onboardingScore, setOnboardingScore] = useState(null);
  const [documentCompletion, setDocumentCompletion] = useState(0);
  const [hasConsent, setHasConsent] = useState(false);
  const [marketplaceViewsCount, setMarketplaceViewsCount] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    profilePicture: null,
    role: 'Pre-Hire Driver'
  });
  
  // Load tracking state
  const [loads, setLoads] = useState([]);
  const [activeLoad, setActiveLoad] = useState(null);
  const [assignedLoads, setAssignedLoads] = useState([]);
  const [completedLoads, setCompletedLoads] = useState([]);
  const [loadsLoading, setLoadsLoading] = useState(false);
  const [tripStarted, setTripStarted] = useState(false);
  const [pickupCompleted, setPickupCompleted] = useState(false);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distanceLeft, setDistanceLeft] = useState(0);
  const [distanceToPickup, setDistanceToPickup] = useState(0);
  const [distanceToDelivery, setDistanceToDelivery] = useState(0);
  const [gpsPermissionGranted, setGpsPermissionGranted] = useState(false);

  // Fetch onboarding data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        setProfileLoading(false);
        return;
      }
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch(`${API_URL}/onboarding/data`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setDriverProfile(data);
          if (typeof data.onboarding_score !== 'undefined') {
            setOnboardingScore(data.onboarding_score);
          }
          
          // Calculate document completion percentage
          if (data.documents) {
            const totalDocs = Object.keys(data.documents).length;
            const uploadedDocs = Object.values(data.documents).filter(doc => doc && doc.uploaded).length;
            const completion = totalDocs > 0 ? (uploadedDocs / totalDocs) * 100 : 0;
            setDocumentCompletion(completion);
          }
          
          // Check consent status
          if (data.consents) {
            const hasAllConsents = Object.values(data.consents).every(consent => consent === true);
            setHasConsent(hasAllConsents);
          }
          
          // Update profile data for header display
          if (data.data) {
            setProfileData({
              name: data.data.fullName || currentUser.displayName || 'Driver',
              profilePicture: data.data.profile_picture_url || null,
              role: isPostHire ? 'Active Driver' : 'Pre-Hire Driver'
            });
          }
          
          // Set availability status from profile
          if (typeof data.is_available !== 'undefined') {
            setIsAvailable(data.is_available);
          }
          
          // Set marketplace views count
          if (typeof data.marketplace_views_count !== 'undefined') {
            setMarketplaceViewsCount(data.marketplace_views_count);
          }
        }

        // Fetch onboarding coach for progress/score if available
        const coachRes = await fetch(`${API_URL}/onboarding/coach-status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (coachRes.ok) {
          const coach = await coachRes.json();
          if (typeof coach.total_score !== 'undefined') {
            setOnboardingScore(coach.total_score);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser, isPostHire]);

  // Poll messaging unread summary (used for sidebar badge)
  useEffect(() => {
    let alive = true;
    if (!currentUser) return;

    const tick = async () => {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(`${API_URL}/messaging/unread/summary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!alive) return;
        setMessagingUnread(Number(data?.total_unread || 0));
      } catch (_) {
        // ignore
      }
    };

    tick();
    const id = setInterval(tick, 15000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [currentUser]);

  const navGroups = [
    {
      title: 'OPERATIONS',
      items: [
        { key: 'home', label: 'My Loads', icon: 'fa-solid fa-house' },
        { key: 'docs', label: 'Document Vault', icon: 'fa-solid fa-folder' },
        { key: 'marketplace', label: 'Marketplace', icon: 'fa-solid fa-store' },
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { key: 'carrier', label: 'My Carrier', icon: 'fa-solid fa-building' },
        { key: 'compliance', label: 'Compliance & Safety', icon: 'fa-solid fa-shield-halved' },
        { key: 'hiring', label: 'Hiring & Onboarding', icon: 'fa-solid fa-user-plus' },
        { key: 'esign', label: 'Consent & E-Signature', icon: 'fa-solid fa-pen-fancy' }
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { key: 'messaging', label: 'Messaging', icon: 'fa-solid fa-envelope' },
        { key: 'settings', label: 'Account & Settings', icon: 'fa-solid fa-gear' },
        { key: 'help', label: 'AI Hub', icon: 'fa-solid fa-robot' },
        { key: 'logout', label: 'Logout', icon: 'fa-solid fa-right-from-bracket' }
      ]
    }
  ];

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle navigation click
  const handleNavClick = (key) => {
    if (key === 'logout') {
      handleLogout();
    } else {
      setActiveNav(key);
      if (isSidebarOpen) setIsSidebarOpen(false);
    }
  };

  // Handle availability toggle
  const handleAvailabilityToggle = async () => {
    if (availabilityLoading || !currentUser) return;
    
    try {
      setAvailabilityLoading(true);
      const newAvailability = !isAvailable;
      
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_URL}/driver/availability`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_available: newAvailability })
      });
      
      if (response.ok) {
        setIsAvailable(newAvailability);
        console.log(`✅ Availability updated to: ${newAvailability ? 'Available' : 'Unavailable'}`);
      } else {
        console.error('Failed to update availability');
        alert('Failed to update availability. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Error updating availability. Please try again.');
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Handle document upload
  const handleDocumentUpload = () => {
    fileUploadRef.current?.click();
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const token = await currentUser.getIdToken();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'general'); // Can be customized

      const response = await fetch(`${API_URL}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('Document uploaded successfully!');
      } else {
        alert('Failed to upload document. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading document. Please try again.');
    } finally {
      if (fileUploadRef.current) {
        fileUploadRef.current.value = '';
      }
    }
  };

  // Handle support form submission
  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setSupportSubmitting(true);
      const token = await currentUser.getIdToken();
      
      const response = await fetch(`${API_URL}/support/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...supportFormData,
          user_id: currentUser.uid,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        // Show success toast
        alert('✅ Your support request has been sent to our admin staff at help@freightpower-ai.com');
        setShowSupportModal(false);
        setSupportFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Failed to submit support request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting support:', error);
      alert('Error submitting support request. Please try again.');
    } finally {
      setSupportSubmitting(false);
    }
  };

  // Fetch loads for driver
  const fetchLoads = async () => {
    if (!currentUser) return;
    try {
      setLoadsLoading(true);
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_URL}/loads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const allLoads = data.loads || [];
        console.log('📦 Fetched loads:', allLoads);
        console.log('📦 First load structure:', allLoads[0]);
        setLoads(allLoads);
        
        // Filter loads by status
        const active = allLoads.find(l => l.status === 'in_transit');
        const assigned = allLoads.filter(l => l.status === 'covered' || l.status === 'assigned');
        const completed = allLoads.filter(l => l.status === 'delivered');
        
        setActiveLoad(active || null);
        setAssignedLoads(assigned);
        setCompletedLoads(completed);
        
        // If there's an active load, check its state
        if (active) {
          setTripStarted(true);
          setPickupCompleted(!!active.pickup_confirmed_at);
          setDeliveryCompleted(active.status === 'delivered');
        }
      }
    } catch (error) {
      console.error('Error fetching loads:', error);
    } finally {
      setLoadsLoading(false);
    }
  };

  // Start trip
  const handleStartTrip = async (load) => {
    if (!currentUser || !load) return;
    
    console.log('🚀 Starting trip for load:', load);
    
    // Get the load ID - it could be in different fields
    const loadId = load.load_id || load.id || load._id;
    console.log('🆔 Load ID found:', loadId);
    console.log('🔍 Available fields:', Object.keys(load));
    
    if (!loadId) {
      alert('Load ID not found');
      console.error('Load object:', load);
      return;
    }
    
    try {
      const token = await currentUser.getIdToken();
      const url = `${API_URL}/loads/${loadId}/driver-update-status`;
      console.log('📡 API URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_status: 'in_transit' })
      });
      
      if (response.ok) {
        console.log('✅ Trip started successfully');
        setTripStarted(true);
        fetchLoads(); // Refresh loads
      } else {
        const error = await response.json();
        console.error('❌ API Error:', error);
        alert(error.detail || 'Failed to start trip');
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      alert('Error starting trip. Please try again.');
    }
  };

  // Mark pickup completed - saves timestamp to database
  const handleMarkPickup = async () => {
    if (!activeLoad || !currentUser) return;
    
    const loadId = activeLoad.load_id || activeLoad.id || activeLoad._id;
    if (!loadId) {
      alert('Load ID not found');
      return;
    }
    
    try {
      const token = await currentUser.getIdToken();
      const payload = {
        pickup_confirmed: true,
        pickup_timestamp: new Date().toISOString(),
        latitude: currentLocation?.latitude || null,
        longitude: currentLocation?.longitude || null
      };
      
      // Update in Firestore via API
      const response = await fetch(`${API_URL}/loads/${loadId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setPickupCompleted(true);
        console.log('✅ Pickup timestamp saved:', payload.pickup_timestamp);
      } else {
        console.error('Failed to save pickup timestamp');
        // Still mark as completed locally
        setPickupCompleted(true);
      }
    } catch (error) {
      console.error('Error saving pickup timestamp:', error);
      // Still mark as completed locally
      setPickupCompleted(true);
    }
  };

  // Mark delivery completed
  const handleMarkDelivery = async () => {
    if (!activeLoad || !currentUser) return;
    
    const loadId = activeLoad.load_id || activeLoad.id || activeLoad._id;
    if (!loadId) {
      alert('Load ID not found');
      return;
    }
    
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_URL}/loads/${loadId}/driver-update-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_status: 'delivered' })
      });
      
      if (response.ok) {
        setDeliveryCompleted(true);
        fetchLoads();
        alert('Delivery marked as completed!');
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to mark delivery');
      }
    } catch (error) {
      console.error('Error marking delivery:', error);
      alert('Error marking delivery. Please try again.');
    }
  };

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  // Get current GPS location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setCurrentLocation(location);
        setGpsPermissionGranted(true);
        
        // Calculate distances if active load exists
        if (activeLoad) {
          updateDistances(location);
        }
      },
      (error) => {
        console.error('GPS Error:', error);
        setGpsPermissionGranted(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  // Update distances to pickup and delivery
  const updateDistances = (location) => {
    if (!activeLoad || !location) return;
    
    // Parse pickup coordinates
    const pickupCoords = activeLoad.origin_coordinates || activeLoad.pickup_coordinates;
    if (pickupCoords) {
      const dist = calculateDistance(
        location.latitude,
        location.longitude,
        pickupCoords.latitude || pickupCoords.lat,
        pickupCoords.longitude || pickupCoords.lng
      );
      setDistanceToPickup(dist);
    }
    
    // Parse delivery coordinates
    const deliveryCoords = activeLoad.destination_coordinates || activeLoad.delivery_coordinates;
    if (deliveryCoords) {
      const dist = calculateDistance(
        location.latitude,
        location.longitude,
        deliveryCoords.latitude || deliveryCoords.lat,
        deliveryCoords.longitude || deliveryCoords.lng
      );
      setDistanceToDelivery(dist);
    }
  };

  // GPS tracking - update location every 30 seconds when trip is active
  useEffect(() => {
    if (!tripStarted || !activeLoad) return;
    
    // Get initial location
    getCurrentLocation();
    
    // Update location every 30 seconds
    const intervalId = setInterval(() => {
      getCurrentLocation();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [tripStarted, activeLoad]);

  // Fetch loads when switching to post-hire
  useEffect(() => {
    if (isPostHire && currentUser) {
      fetchLoads();
    }
  }, [isPostHire, currentUser]);

  function HomeView() {
    return (
      <>
        <header className="fp-header">
          <div className="fp-header-titles">
            <h2>
              <span role="img" aria-label="wave">👋</span>
              Welcome to FreightPower, {profileData.name || 'Driver'}!
            </h2>
            <p className="fp-subtitle">Complete your onboarding to start connecting with carriers and finding loads.</p>
            <button onClick={() => setIsPostHire(true)} className="btn small green-btn">Post Hire</button>
          </div>
        </header>

        {/* Driver Profile Card - Shows onboarding data */}
        {!profileLoading && driverProfile && driverProfile.data && (
          <section style={{ marginBottom: '20px' }}>
            <div className="card" style={{ padding: '20px', background: '#f8fafc' }}>
              <div className="card-header">
                <h3><i className="fa-solid fa-user" style={{ marginRight: '8px' }}></i>Driver Profile</h3>
                {onboardingScore !== null && (
                  <div className="pill" style={{ background:'#e0f2fe', color:'#075985', padding:'6px 10px', borderRadius:'999px', fontWeight:600 }}>
                    Onboarding Score: {Math.round(onboardingScore)}%
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {driverProfile.data.fullName && (
                  <div><strong>Name:</strong> {driverProfile.data.fullName}</div>
                )}
                {driverProfile.data.cdlNumber && (
                  <div><strong>CDL Number:</strong> {driverProfile.data.cdlNumber}</div>
                )}
                {driverProfile.data.cdlClass && (
                  <div><strong>CDL Class:</strong> {driverProfile.data.cdlClass}</div>
                )}
                {driverProfile.data.issuingState && (
                  <div><strong>Issuing State:</strong> {driverProfile.data.issuingState}</div>
                )}
                {driverProfile.data.preferredRegions && (
                  <div><strong>Preferred Regions:</strong> {driverProfile.data.preferredRegions}</div>
                )}
                {driverProfile.data.equipmentExperience && (
                  <div><strong>Equipment Experience:</strong> {driverProfile.data.equipmentExperience}</div>
                )}
              </div>
              {!driverProfile.onboarding_completed && (
                <div style={{ marginTop: '16px', padding: '12px', background: '#fef3c7', borderRadius: '8px', color: '#92400e' }}>
                  <i className="fa-solid fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                  Onboarding not complete.{' '}
                  <span 
                    onClick={() => handleNavClick('settings')}
                    style={{ color: '#1d4ed8', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Complete now
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Onboarding Coach removed - compliance data now shown in Compliance & Safety page */}

        <section className="fp-grid">
          {/* Onboarding Progress Card */}
          <div className="card dd-onboarding-card span-3">
            <div className="dd-onboarding-progress">
              <span className="dd-progress-title">Onboarding Progress</span>
              <span className="dd-progress-percent">
                {(() => {
                  let progress = 0;
                  // Step 1: Documents (33% weightage) - only if >= 50%
                  if (documentCompletion >= 50) {
                    progress += 33;
                  }
                  // Step 2: Consent (33% weightage) - always passed for development phase
                  progress += 33;
                  // Step 3: Availability (34% weightage) - final step controlled by toggle
                  if (isAvailable) {
                    progress += 34;
                  }
                  return `${progress}%`;
                })()}
                {' '}Complete
              </span>
            </div>
            <div className="dd-progress-bar">
              <div className="dd-progress-bar-inner" style={{ 
                width: (() => {
                  let progress = 0;
                  if (documentCompletion >= 50) progress += 33;
                  progress += 33; // Consent always counts
                  if (isAvailable) progress += 34;
                  return `${progress}%`;
                })()
              }} />
            </div>
            <div className="dd-onboarding-steps">
              {/* Document Upload Step */}
              <div className={`dd-step ${documentCompletion === 100 ? 'dd-step-complete' : 'dd-step-inprogress'}`}>
                <i className={`fa-solid ${documentCompletion === 100 ? 'fa-check-circle dd-step-complete-icon-fa' : 'fa-hourglass-half dd-step-inprogress-icon-fa'}`}></i>
                <div className="dd-step-title">Docs Uploaded</div>
                <div className="dd-step-status">
                  {documentCompletion === 100 ? (
                    <span style={{ color: '#10b981' }}>Complete</span>
                  ) : documentCompletion >= 50 ? (
                    <>
                      <span style={{ color: '#f59e0b' }}>In Progress</span>
                      <br />
                      <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>Passed for development phase</span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: '#ef4444' }}>Incomplete</span>
                      <br />
                      <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>Passed for development phase</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Consent Step */}
              <div className="dd-step dd-step-complete">
                <i className="fa-solid fa-check-circle dd-step-complete-icon-fa"></i>
                <div className="dd-step-title">Consent Given</div>
                <div className="dd-step-status">
                  <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>Passed for development phase</span>
                </div>
              </div>
              
              {/* Availability Step */}
              <div className={`dd-step ${isAvailable ? 'dd-step-complete' : 'dd-step-pending'}`}>
                <i className={`fa-solid ${isAvailable ? 'fa-check-circle dd-step-complete-icon-fa' : 'fa-regular fa-circle dd-step-pending-icon-fa'}`}></i>
                <div className="dd-step-title">Availability On</div>
                <div className="dd-step-status">
                  {isAvailable ? (
                    <span style={{ color: '#10b981' }}>Active</span>
                  ) : (
                    <span style={{ color: '#6c757d' }}>Pending</span>
                  )}
                </div>
              </div>
            </div>
            <button 
              className="btn small-cd"
              onClick={() => handleNavClick('settings')}
            >
              Go to Profile
            </button>
          </div>

          {/* Marketplace Activity */}
          <div className="card dd-marketplace-card">
            <div className="card-header">
              <h3>Marketplace Activity</h3>
              {marketplaceViewsCount > 0 && (
                <span className="dd-marketplace-new dd-marketplace-green">{marketplaceViewsCount} New</span>
              )}
            </div>
            <div className="dd-marketplace-content dd-center dd-marketplace-padding">
              <div className="dd-marketplace-eye">
                <i className="fa-solid fa-eye dd-marketplace-eye-icon"></i>
              </div>
              <div className="dd-marketplace-viewed">{marketplaceViewsCount} Carriers Viewed You</div>
              <div className="dd-marketplace-desc">
                {marketplaceViewsCount > 0 
                  ? `This week carriers have shown interest in your profile` 
                  : `No views this week. Toggle availability to be discovered by carriers`}
              </div>
              <button 
                className="btn small-cd"
                onClick={() => handleNavClick('marketplace')}
              >
                View Marketplace
              </button>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="card dd-ai-suggestions-card">
            <div className="card-header">
              <h3>AI Suggestions</h3>
            </div>
            <div className="dd-ai-suggestion">
              <div className="dd-suggestion-title">Medical Card Expiring</div>
              <div className="dd-suggestion-text">Expires in 15 days</div>
            </div>
            <div className="dd-ai-suggestion">
              <div className="dd-suggestion-title">Profile Tip</div>
              <div className="dd-suggestion-text">Add experience details to attract carriers</div>
            </div>
            <div className="dd-ai-suggestion">
              <div className="dd-suggestion-title">Marketplace Ready</div>
              <div className="dd-suggestion-text">Turn on availability to be discovered</div>
            </div>
          </div>

          {/* Service Providers */}
          <div className="card dd-service-providers-card">
            <div className="card-header">
              <h3>Service Providers</h3>
              <span 
                className="view-all" 
                onClick={() => handleNavClick('marketplace')}
                style={{ cursor: 'pointer' }}
              >
                View All
              </span>
            </div>
            <div className="dd-service-grid">
              <div 
                className="dd-service-item dd-center"
                onClick={() => handleNavClick('marketplace')}
                style={{ cursor: 'pointer' }}
              >
                <i className="fa-solid fa-gavel" />
                <div>Legal Help</div>
              </div>
              <div 
                className="dd-service-item dd-center"
                onClick={() => handleNavClick('marketplace')}
                style={{ cursor: 'pointer' }}
              >
                <i className="fa-solid fa-wrench" />
                <div>Roadside</div>
              </div>
              <div 
                className="dd-service-item dd-center"
                onClick={() => handleNavClick('marketplace')}
                style={{ cursor: 'pointer' }}
              >
                <i className="fa-solid fa-parking" />
                <div>Parking</div>
              </div>
              <div 
                className="dd-service-item dd-center"
                onClick={() => handleNavClick('marketplace')}
                style={{ cursor: 'pointer' }}
              >
                <i className="fa-solid fa-gas-pump" />
                <div>Fuel</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card dd-quick-actions-card span-3">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="dd-quick-actions">
              <input 
                type="file" 
                ref={fileUploadRef} 
                style={{ display: 'none' }} 
                onChange={handleFileSelected}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <button 
                className="btn small-cd"
                onClick={handleDocumentUpload}
              >
                <i className="fa-solid fa-upload"></i>
                Upload Document
              </button>
              <button 
                className="btn small-cd"
                onClick={() => handleNavClick('marketplace')}
              >
                <i className="fa-solid fa-store"></i>
                Browse Marketplace
              </button>
              <button 
                className="btn small-cd"
                onClick={() => handleNavClick('esign')}
              >
                <i className="fa-solid fa-pen"></i>
                Complete Consent
              </button>
              <button 
                className="btn small ghost-cd"
                onClick={() => setShowSupportModal(true)}
              >
                <i className="fa-solid fa-headset"></i>
                Get Support
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  function PostHireView() {
    // Calculate total distance and distance left for active load
    const getTotalDistance = () => {
      if (!activeLoad) return 0;
      return activeLoad.estimated_distance || activeLoad.distance_miles || activeLoad.total_distance || 0;
    };

    const getDistanceLeft = () => {
      if (!activeLoad || !pickupCompleted) return getTotalDistance();
      // If pickup is completed, calculate distance from current location to delivery
      // For now, return a placeholder - you'll need real geolocation
      return Math.round(getTotalDistance() * 0.3); // Assuming 30% distance remaining
    };

    const getPickupLocation = () => {
      if (!activeLoad) return { city: '', state: '', full: '' };
      const origin = activeLoad.origin;
      if (typeof origin === 'string') {
        // If origin is a string like "Chicago, IL"
        const parts = origin.split(',').map(s => s.trim());
        return {
          city: parts[0] || '',
          state: parts[1] || '',
          full: origin
        };
      } else if (origin && typeof origin === 'object') {
        // If origin is an object with city/state
        return {
          city: origin.city || '',
          state: origin.state || '',
          full: `${origin.city || ''}, ${origin.state || ''}`
        };
      }
      return { city: 'Pickup', state: '', full: 'Pickup Location' };
    };

    const getDeliveryLocation = () => {
      if (!activeLoad) return { city: '', state: '', full: '' };
      const destination = activeLoad.destination;
      if (typeof destination === 'string') {
        // If destination is a string like "Atlanta, GA"
        const parts = destination.split(',').map(s => s.trim());
        return {
          city: parts[0] || '',
          state: parts[1] || '',
          full: destination
        };
      } else if (destination && typeof destination === 'object') {
        // If destination is an object with city/state
        return {
          city: destination.city || '',
          state: destination.state || '',
          full: `${destination.city || ''}, ${destination.state || ''}`
        };
      }
      return { city: 'Delivery', state: '', full: 'Delivery Location' };
    };

    const getRate = () => {
      if (!activeLoad) return 0;
      return activeLoad.total_rate || activeLoad.linehaul_rate || activeLoad.rate || activeLoad.price || 0;
    };

    const pickupLoc = getPickupLocation();
    const deliveryLoc = getDeliveryLocation();
    const totalDistance = getTotalDistance();
    const distanceLeft = getDistanceLeft();
    const rate = getRate();
    const ratePerMile = totalDistance > 0 ? (rate / totalDistance).toFixed(2) : '0.00';

    return (
      <>
        <header className="fp-header">
          <div className="fp-header-titles">
            <button onClick={() => setIsPostHire(false)} className="btn small">Back to Pre-Hire</button>
          </div>
        </header>

        {/* Active Load Card - Full Width */}
        {activeLoad ? (
          <div className="card dd-active-load-card">
            <div className="dd-active-load-header">
              <h3>Active Load - Pickup to Delivery</h3>
              <span className="dd-load-status">{tripStarted ? 'In Transit' : 'Ready to Start'}</span>
            </div>
            
            {tripStarted ? (
              <div className="dd-active-load-content">
                <div className="dd-load-info-grid">
                  <div className="dd-load-info-item">
                    <span className="dd-info-label">Pickup</span>
                    <span className="dd-info-value">
                      {pickupLoc.full}
                    </span>
                    <span className="dd-info-status" style={{fontSize: '0.875rem', color: '#64748b'}}>
                      {activeLoad.pickup_date || 'Date TBD'}
                    </span>
                  </div>
                  <div className="dd-load-info-item">
                    <span className="dd-info-label">Delivery</span>
                    <span className="dd-info-value">
                      {deliveryLoc.full}
                    </span>
                    <span className="dd-info-status" style={{fontSize: '0.875rem', color: '#64748b'}}>
                      {activeLoad.delivery_date || 'Date TBD'}
                    </span>
                  </div>
                  <div className="dd-load-info-item">
                    <span className="dd-info-label">Distance</span>
                    <span className="dd-info-value">{distanceLeft} miles left</span>
                    <span className="dd-info-status">{totalDistance} total miles</span>
                  </div>
                  <div className="dd-load-info-item">
                    <span className="dd-info-label">Rate</span>
                    <span className="dd-info-value">${rate}</span>
                    <span className="dd-info-status">${ratePerMile}/mile</span>
                  </div>
                </div>
                
                {/* Pickup and Delivery Checkboxes Row */}
                <div style={{display: 'flex', gap: '24px', padding: '16px 0', borderTop: '1px solid #e2e8f0'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <input 
                      type="checkbox" 
                      checked={pickupCompleted} 
                      onChange={handleMarkPickup}
                      style={{cursor: 'pointer', width: '18px', height: '18px'}}
                    />
                    <span style={{fontSize: '0.9rem', color: pickupCompleted ? '#22c55e' : '#64748b', fontWeight: '500'}}>
                      {pickupCompleted ? '✓ Pickup Completed' : 'Mark Pickup'}
                    </span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <input 
                      type="checkbox" 
                      checked={deliveryCompleted} 
                      onChange={handleMarkDelivery}
                      disabled={!pickupCompleted}
                      style={{cursor: pickupCompleted ? 'pointer' : 'not-allowed', width: '18px', height: '18px', opacity: pickupCompleted ? 1 : 0.5}}
                    />
                    <span style={{fontSize: '0.9rem', color: deliveryCompleted ? '#22c55e' : '#64748b', fontWeight: '500', opacity: pickupCompleted ? 1 : 0.5}}>
                      {deliveryCompleted ? '✓ Delivered' : 'Mark Delivery'}
                    </span>
                  </div>
                </div>

                <div className="dd-load-actions">
                  <button className="btn small ghost-cd dd-btn">
                    <i className="fa-solid fa-location-arrow"></i>
                    Navigate
                  </button>
                  <button className="btn small ghost-cd dd-btn">
                    <i className="fa-solid fa-upload"></i>
                    Upload POD
                  </button>
                  <button className="btn small ghost-cd dd-btn">
                    <i className="fa-solid fa-comment"></i>
                    Message Dispatch
                  </button>
                </div>
              </div>
            ) : (
              <div style={{padding: '20px', textAlign: 'center'}}>
                <p style={{marginBottom: '16px', color: '#64748b'}}>Click Start Trip to begin tracking</p>
                <button className="btn small-cd" onClick={() => handleStartTrip(activeLoad)}>
                  <i className="fa-solid fa-play" style={{marginRight: '8px'}}></i>
                  Start Trip
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card dd-active-load-card" style={{textAlign: 'center', padding: '40px'}}>
            <i className="fa-solid fa-truck" style={{fontSize: '3rem', color: '#cbd5e1', marginBottom: '16px'}}></i>
            <h3 style={{margin: '0 0 8px', color: '#1e293b'}}>No Active Load</h3>
            <p style={{margin: 0, color: '#64748b'}}>
              You don't have any active loads at the moment. Check your assigned loads below to start a new trip.
            </p>
          </div>
        )}

        {/* Detailed Trip Tracking Section - Only shows when active load exists */}
        {activeLoad && tripStarted && (
          <div className="card" style={{marginBottom: '24px'}}>
            <div className="card-header">
              <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#1e293b'}}>
                <i className="fa-solid fa-route" style={{marginRight: '8px', color: '#3b82f6'}}></i>
                Trip Details
              </h3>
              {gpsPermissionGranted ? (
                <span style={{fontSize: '0.875rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px'}}>
                  <i className="fa-solid fa-circle" style={{fontSize: '0.5rem'}}></i>
                  GPS Active
                </span>
              ) : (
                <span style={{fontSize: '0.875rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px'}}>
                  <i className="fa-solid fa-circle" style={{fontSize: '0.5rem'}}></i>
                  GPS Disabled
                </span>
              )}
            </div>
            
            {/* Row 1: Pickup Location */}
            <div style={{padding: '20px', borderBottom: '1px solid #e2e8f0'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                    <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <i className="fa-solid fa-location-dot" style={{color: '#3b82f6', fontSize: '1.25rem'}}></i>
                    </div>
                    <div>
                      <div style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '2px'}}>Pickup Location</div>
                      <div style={{fontSize: '1.125rem', fontWeight: '600', color: '#1e293b'}}>{pickupLoc.full}</div>
                    </div>
                  </div>
                  <div style={{paddingLeft: '52px'}}>
                    {gpsPermissionGranted ? (
                      <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                        <i className="fa-solid fa-location-crosshairs" style={{marginRight: '6px', color: '#3b82f6'}}></i>
                        {distanceToPickup} miles away
                      </div>
                    ) : (
                      <div style={{fontSize: '0.875rem', color: '#f59e0b'}}>
                        <i className="fa-solid fa-triangle-exclamation" style={{marginRight: '6px'}}></i>
                        Enable GPS for distance
                      </div>
                    )}
                  </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 20px', background: pickupCompleted ? '#dcfce7' : '#f1f5f9', borderRadius: '8px', transition: 'all 0.2s'}}>
                    <input 
                      type="checkbox" 
                      checked={pickupCompleted} 
                      onChange={handleMarkPickup}
                      style={{width: '20px', height: '20px', cursor: 'pointer', accentColor: '#22c55e'}}
                    />
                    <span style={{fontSize: '0.95rem', fontWeight: '600', color: pickupCompleted ? '#16a34a' : '#64748b'}}>
                      {pickupCompleted ? 'Pickup Completed ✓' : 'Mark Pickup Complete'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Row 2: Load Details */}
            <div style={{padding: '20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'}}>
                <div>
                  <div style={{fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'}}>Load ID</div>
                  <div style={{fontSize: '0.95rem', fontWeight: '600', color: '#1e293b'}}>{activeLoad.load_id}</div>
                </div>
                <div>
                  <div style={{fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'}}>Equipment</div>
                  <div style={{fontSize: '0.95rem', fontWeight: '600', color: '#1e293b'}}>{activeLoad.equipment_type || 'Not Specified'}</div>
                </div>
                <div>
                  <div style={{fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'}}>Weight</div>
                  <div style={{fontSize: '0.95rem', fontWeight: '600', color: '#1e293b'}}>{activeLoad.weight ? `${activeLoad.weight} lbs` : 'Not Specified'}</div>
                </div>
                <div>
                  <div style={{fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'}}>Commodity</div>
                  <div style={{fontSize: '0.95rem', fontWeight: '600', color: '#1e293b'}}>{activeLoad.commodity || 'General Freight'}</div>
                </div>
                <div>
                  <div style={{fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'}}>Total Rate</div>
                  <div style={{fontSize: '0.95rem', fontWeight: '600', color: '#16a34a'}}>${rate}</div>
                </div>
                <div>
                  <div style={{fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'}}>Total Distance</div>
                  <div style={{fontSize: '0.95rem', fontWeight: '600', color: '#1e293b'}}>{totalDistance} miles</div>
                </div>
              </div>
              {activeLoad.special_requirements && (
                <div style={{marginTop: '16px', padding: '12px', background: '#fef3c7', borderRadius: '6px', borderLeft: '3px solid #f59e0b'}}>
                  <div style={{fontSize: '0.75rem', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'}}>
                    <i className="fa-solid fa-triangle-exclamation" style={{marginRight: '6px'}}></i>
                    Special Requirements
                  </div>
                  <div style={{fontSize: '0.875rem', color: '#78350f'}}>{activeLoad.special_requirements}</div>
                </div>
              )}
            </div>

            {/* Row 3: Delivery Location */}
            <div style={{padding: '20px'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                    <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <i className="fa-solid fa-flag-checkered" style={{color: '#16a34a', fontSize: '1.25rem'}}></i>
                    </div>
                    <div>
                      <div style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '2px'}}>Delivery Location</div>
                      <div style={{fontSize: '1.125rem', fontWeight: '600', color: '#1e293b'}}>{deliveryLoc.full}</div>
                    </div>
                  </div>
                  <div style={{paddingLeft: '52px'}}>
                    {gpsPermissionGranted ? (
                      <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                        <i className="fa-solid fa-location-crosshairs" style={{marginRight: '6px', color: '#16a34a'}}></i>
                        {distanceToDelivery} miles away
                      </div>
                    ) : (
                      <div style={{fontSize: '0.875rem', color: '#f59e0b'}}>
                        <i className="fa-solid fa-triangle-exclamation" style={{marginRight: '6px'}}></i>
                        Enable GPS for distance
                      </div>
                    )}
                  </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: pickupCompleted ? 'pointer' : 'not-allowed', padding: '12px 20px', background: deliveryCompleted ? '#dcfce7' : (pickupCompleted ? '#f1f5f9' : '#f8fafc'), borderRadius: '8px', opacity: pickupCompleted ? 1 : 0.5, transition: 'all 0.2s'}}>
                    <input 
                      type="checkbox" 
                      checked={deliveryCompleted} 
                      onChange={handleMarkDelivery}
                      disabled={!pickupCompleted}
                      style={{width: '20px', height: '20px', cursor: pickupCompleted ? 'pointer' : 'not-allowed', accentColor: '#22c55e'}}
                    />
                    <span style={{fontSize: '0.95rem', fontWeight: '600', color: deliveryCompleted ? '#16a34a' : (pickupCompleted ? '#64748b' : '#94a3b8')}}>
                      {deliveryCompleted ? 'Delivered ✓' : 'Mark Delivery Complete'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="dd-two-column-layout">
          {/* Left Column */}
          <div className="dd-left-column">
            {/* Load Summary */}
            <div className="dd-load-summary-section">
              <h3 className="dd-section-title">Load Summary</h3>
              <div className="card dd-load-summary-card dd-no-header">
                <div className="dd-summary-stats-horizontal">
                  <div className="dd-stat-item-horizontal">
                    <div className="dd-stat-number-large">{assignedLoads.length}</div>
                    <div className="dd-stat-label-horizontal">Assigned</div>
                  </div>
                  <div className="dd-stat-item-horizontal">
                    <div className="dd-stat-number-large">{activeLoad ? 1 : 0}</div>
                    <div className="dd-stat-label-horizontal">In Transit</div>
                  </div>
                  <div className="dd-stat-item-horizontal">
                    <div className="dd-stat-number-large">{completedLoads.length}</div>
                    <div className="dd-stat-label-horizontal">Completed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Cards - Assigned Loads */}
            {assignedLoads.length > 0 ? (
              assignedLoads.map((load) => {
                // Parse origin
                const origin = typeof load.origin === 'string' 
                  ? load.origin.split(',').map(s => s.trim())[0] 
                  : (load.origin?.city || 'Pickup');
                
                // Parse destination
                const destination = typeof load.destination === 'string' 
                  ? load.destination.split(',').map(s => s.trim())[0] 
                  : (load.destination?.city || 'Delivery');
                
                // Get rate
                const loadRate = load.total_rate || load.linehaul_rate || load.rate || load.price || 0;
                
                return (
                  <div key={load.load_id} className="card dd-route-card">
                    <div className="dd-route-header">
                      <h4>{origin} to {destination}</h4>
                      <span className="int-status-badge active">Assigned</span>
                    </div>
                    <div className="dd-route-info">
                      <div className="dd-route-details">
                        <div>Pickup: {load.pickup_date || 'TBD'}</div>
                        <div>Delivery: {load.delivery_date || 'TBD'}</div>
                        <div>Rate: ${loadRate}</div>
                      </div>
                      <div className="dd-route-actions">
                        <button className="btn small-cd" onClick={() => handleStartTrip(load)}>
                          Start Trip
                        </button>
                        <button className="btn small ghost-cd">View Details</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="card dd-route-card" style={{textAlign: 'center', padding: '30px'}}>
                <i className="fa-solid fa-clipboard-list" style={{fontSize: '2.5rem', color: '#cbd5e1', marginBottom: '12px'}}></i>
                <p style={{margin: 0, color: '#64748b'}}>No assigned loads at the moment</p>
              </div>
            )}

            {/* Live Route Tracking */}
            <div className="card dd-live-route-card">
              <div className="dd-section-title">
                <h3>Live Route Tracking</h3>
              </div>
              <div className="dd-live-route-content">
                <HereMap
                  containerId="driver-route-map"
                  center={{ lat: 39.8283, lng: -98.5795 }}
                  zoom={6}
                  markers={[
                    { lat: 39.8283, lng: -98.5795, label: 'Current Location', icon: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }
                  ]}
                  height="300px"
                  width="100%"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="dd-right-column">
            {/* Compliance Status */}
            <div className="card dd-compliance-card">
              <div className="dd-section-title">
                <h3>Compliance Status</h3>
              </div>
              <div className="dd-compliance-items">
                <div className="dd-compliance-item ">
                  <i className="fa-solid fa-id-card"></i>
                  <span>CDL License</span>
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="dd-compliance-item ">
                  <i className="fa-solid fa-file-medical"></i>
                  <span>Medical Card</span>
                  <i className="fa-solid fa-exclamation-triangle"></i>
                </div>
                <div className="dd-compliance-item">
                  <i className="fa-solid fa-search"></i>
                  <span>Drug Test</span>
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="dd-compliance-item">
                  <i className="fa-solid fa-clipboard-check"></i>
                  <span>Background Check</span>
                  <i className="fa-solid fa-check"></i>
                </div>
              </div>
              <button className="btn small-cd" style={{width: '100%'}}>View All Documents</button>
            </div>

            {/* Messages & Alerts Section */}
            <div className="dd-messages-alerts-section">
              <h3 className="dd-section-title">Messages & Alerts</h3>
              
              {/* Route Update Card */}
              <div className="card dd-message-card dd-route-update-card">
                <div className="dd-message-icon ">
                  <i className="fa-solid fa-route"></i>
                </div>
                <div className="dd-message-content">
                  <div className="dd-message-title">Route Update</div>
                  <div className="dd-message-text">Traffic ahead on I-76. Alternative route suggested.</div>
                </div>
              </div>

              {/* Medical Card Expiring Card */}
              <div className="card dd-message-card dd-medical-warning-card">
                <div className="dd-message-icon ">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                </div>
                <div className="dd-message-content">
                  <div className="dd-message-title">Medical Card Expiring</div>
                  <div className="dd-message-text">Expires in 15 days. Schedule renewal now.</div>
                </div>
              </div>

              {/* Carrier Message Card */}
              <div className="card dd-message-card dd-carrier-message-card">
                <div className="dd-message-icon ">
                  <i className="fa-solid fa-comment"></i>
                </div>
                <div className="dd-message-content">
                  <div className="dd-message-title">Carrier Message</div>
                  <div className="dd-message-text">Great job on the Chicago delivery!</div>
                </div>
              </div>
            </div>

            {/* AI Suggestions Card */}
              <div className="card dd-ai-suggestions-separate-card">
                <div className="dd-section-title">
                  <span>AI Suggestions</span>
                </div>
                <div className="dd-suggestion-item">
                  <div className="dd-suggestion-title">Fuel Stop Recommended</div>
                  <div className="dd-suggestion-text">Pilot at Exit 142 - Best price in 50 miles ahead</div>
                  <button className="dd-suggestion-link">Navigate</button>
                </div>
                <div className="dd-suggestion-item">
                  <div className="dd-suggestion-title">Break Required Soon</div>
                  <div className="dd-suggestion-text">30-min break needed in 45 minutes</div>
                  <button className="dd-suggestion-link">Find Rest Areas</button>
                </div>
              </div>
          </div>
        </div>
      </>
    );
  }

  // Driver Compliance View Component
  function DriverComplianceView() {
    const [loading, setLoading] = useState(true);
    const [complianceStatus, setComplianceStatus] = useState({
      score: 0, breakdown: {}, status_color: 'Red', documents: [], issues: [], warnings: [], recommendations: []
    });
    const [complianceData, setComplianceData] = useState({
      cdlNumber: '', cdlState: '', cdlClass: '', cdlExpiry: '', medicalCardExpiry: '',
      drugTestStatus: 'pending', mvrStatus: 'pending', clearinghouseStatus: 'pending'
    });
    const [complianceTasks, setComplianceTasks] = useState([]);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [analyzingAI, setAnalyzingAI] = useState(false);

    useEffect(() => {
      if (!currentUser) return;
      const fetchData = async () => {
        setLoading(true);
        try {
          const token = await currentUser.getIdToken();
          const statusRes = await fetch(`${API_URL}/compliance/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (statusRes.ok) {
            const data = await statusRes.json();
            setComplianceStatus({
              score: data.compliance_score || 0, breakdown: data.score_breakdown || {},
              status_color: data.status_color || 'Red', documents: data.documents || [],
              issues: data.issues || [], warnings: data.warnings || [],
              recommendations: data.recommendations || []
            });
            if (data.role_data) {
              setComplianceData(prev => ({
                ...prev, cdlNumber: data.role_data.cdl_number || '', cdlState: data.role_data.cdl_state || '',
                cdlClass: data.role_data.cdl_class || '', cdlExpiry: data.role_data.cdl_expiry || '',
                medicalCardExpiry: data.role_data.medical_card_expiry || '',
                drugTestStatus: data.role_data.drug_test_status || 'pending',
                mvrStatus: data.role_data.mvr_status || 'pending',
                clearinghouseStatus: data.role_data.clearinghouse_status || 'pending'
              }));
            }
          }
          const tasksRes = await fetch(`${API_URL}/compliance/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (tasksRes.ok) setComplianceTasks(await tasksRes.json());
        } catch (e) { console.error('Error:', e); }
        finally { setLoading(false); }
      };
      fetchData();
    }, [currentUser]);

    const runAIAnalysis = async () => {
      if (!currentUser) return;
      setAnalyzingAI(true);
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(`${API_URL}/compliance/ai-analyze`, {
          method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setAiAnalysis(await res.json());
      } catch (e) { console.error('AI error:', e); }
      finally { setAnalyzingAI(false); }
    };

    const getScoreColor = (score) => score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

    if (loading) return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#3b82f6' }}></i>
        <span style={{ marginLeft: '10px' }}>Loading compliance data...</span>
      </div>
    );

    return (
      <div style={{ padding: '20px' }}>
        <header style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Compliance & Safety</h2>
          <p style={{ color: '#6b7280', margin: '8px 0' }}>Monitor your compliance status and required documents</p>
        </header>

        {/* Score Card */}
        <div className="card" style={{ padding: '20px', marginBottom: '20px', background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: 'white' }}>AI Compliance Score</h3>
              <p style={{ margin: '8px 0 0', opacity: 0.8 }}>Based on documents, verification, and completeness</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: getScoreColor(complianceStatus.score) }}>
                {complianceStatus.score}%
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>{complianceStatus.status_color} Status</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '20px' }}>
            {Object.entries(complianceStatus.breakdown).map(([key, val]) => (
              <div key={key} style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'capitalize' }}>{key.replace('_', ' ')}</div>
                <div style={{ fontSize: '20px', fontWeight: '600' }}>{val}%</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Left Column */}
          <div>
            {/* CDL & Credentials */}
            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 16px' }}><i className="fas fa-id-card" style={{ marginRight: '8px' }}></i>CDL & Credentials</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div><strong>CDL Number:</strong> {complianceData.cdlNumber || 'Not provided'}</div>
                <div><strong>CDL State:</strong> {complianceData.cdlState || 'Not provided'}</div>
                <div><strong>CDL Class:</strong> {complianceData.cdlClass || 'Not provided'}</div>
                <div><strong>CDL Expiry:</strong> {complianceData.cdlExpiry || 'Not provided'}</div>
                <div><strong>Medical Card Expiry:</strong> {complianceData.medicalCardExpiry || 'Not provided'}</div>
              </div>
            </div>

            {/* Compliance Checks */}
            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 16px' }}><i className="fas fa-clipboard-check" style={{ marginRight: '8px' }}></i>Compliance Checks</h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <span>Drug Test</span>
                  <span className={`int-status-badge ${complianceData.drugTestStatus === 'passed' ? 'active' : 'pending'}`}>
                    {complianceData.drugTestStatus}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <span>MVR Check</span>
                  <span className={`int-status-badge ${complianceData.mvrStatus === 'passed' ? 'active' : 'pending'}`}>
                    {complianceData.mvrStatus}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <span>FMCSA Clearinghouse</span>
                  <span className={`int-status-badge ${complianceData.clearinghouseStatus === 'passed' ? 'active' : 'pending'}`}>
                    {complianceData.clearinghouseStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ margin: '0 0 16px' }}><i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>Uploaded Documents</h4>
              {complianceStatus.documents && complianceStatus.documents.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Document</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Expiry</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Uploaded</th>
                  </tr></thead>
                  <tbody>
                    {complianceStatus.documents.map((doc, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '8px' }}>{doc.file_name || doc.filename || 'Document'}</td>
                        <td style={{ padding: '8px', fontSize: '12px' }}>{(doc.document_type || doc.type || 'OTHER').replace(/_/g, ' ').toUpperCase()}</td>
                        <td style={{ padding: '8px', fontSize: '12px', color: '#6b7280' }}>
                          {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td style={{ padding: '8px' }}>
                          <span className={`int-status-badge ${doc.status === 'Valid' ? 'active' : doc.status === 'Expired' ? 'inactive' : 'pending'}`}>
                            {doc.status || 'Unknown'}
                          </span>
                        </td>
                        <td style={{ padding: '8px', color: '#6b7280', fontSize: '12px' }}>
                          {doc.uploaded_at ? new Date(doc.uploaded_at * 1000).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p style={{ color: '#6b7280' }}>No documents uploaded yet</p>}
            </div>
          </div>

          {/* Right Column - AI Assistant */}
          <div>
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ margin: '0 0 16px' }}><i className="fas fa-robot" style={{ marginRight: '8px' }}></i>AI Compliance Assistant</h4>
              <button onClick={runAIAnalysis} disabled={analyzingAI} className="btn small-cd" style={{ width: '100%', marginBottom: '16px' }}>
                {analyzingAI ? 'Analyzing...' : 'Run AI Analysis'}
              </button>
              {aiAnalysis && (
                <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', marginBottom: '16px' }}>
                  <strong>Risk Level:</strong> {aiAnalysis.analysis?.risk_level || 'Unknown'}
                  <p style={{ margin: '8px 0 0', fontSize: '14px' }}>{aiAnalysis.analysis?.summary || ''}</p>
                </div>
              )}
              <h5 style={{ margin: '16px 0 8px' }}>Tasks</h5>
              {complianceTasks.length > 0 ? complianceTasks.slice(0, 5).map((task, idx) => (
                <div key={idx} style={{ padding: '8px', background: '#f8fafc', borderRadius: '6px', marginBottom: '8px', fontSize: '14px' }}>
                  <strong>{task.title}</strong>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>{task.description}</div>
                </div>
              )) : <p style={{ color: '#6b7280', fontSize: '14px' }}>No pending tasks</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ContentView({ activeNav }) {
    switch (activeNav) {
      case 'home':
        return isPostHire ? <PostHireView /> : <HomeView />;
      case 'docs':
        return <DocumentVault isPostHire={isPostHire} setIsPostHire={setIsPostHire} />;
      case 'marketplace':
        return (
          <Marketplace 
            isPostHire={isPostHire} 
            setIsPostHire={setIsPostHire}
            isAvailable={isAvailable}
            onAvailabilityToggle={handleAvailabilityToggle}
          />
        );
      case 'carrier':
        return <MyCarrier />;
      case 'compliance':
        return <DriverComplianceView />;
      case 'hiring':
        return <HiringOnboarding />;
      case 'esign':
        return <ConsentESignature />;
      case 'messaging':
        return <Messaging />;
      case 'settings':
        return <AccountSettings onProfileUpdate={() => {
          // Refresh profile data when settings are updated
          const fetchProfile = async () => {
            if (!currentUser) return;
            try {
              const token = await currentUser.getIdToken();
              const response = await fetch(`${API_URL}/onboarding/data`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              if (response.ok) {
                const data = await response.json();
                if (data.data) {
                  setProfileData({
                    name: data.data.fullName || currentUser.displayName || 'Driver',
                    profilePicture: data.data.profile_picture_url || null,
                    role: isPostHire ? 'Active Driver' : 'Pre-Hire Driver'
                  });
                }
              }
            } catch (error) {
              console.error('Error refreshing profile:', error);
            }
          };
          fetchProfile();
        }} />;
      case 'help':
        return <AiHub />;
      default:
        return (
          <div>
            <header className="fp-header">
              <div className="fp-header-titles">
                <h2>{navGroups.flatMap(g => g.items).find(i => i.key === activeNav)?.label || 'View'}</h2>
                <p className="fp-subtitle">This is the {activeNav} view. Only the inner area changes.</p>
              </div>
            </header>
            <section className="fp-grid">
              <div className="card">
                <div className="card-header"><h3>Placeholder</h3></div>
              </div>
            </section>
          </div>
        );
    }
  }

  return (
    <div className={`fp-dashboard-root ${isDarkMode ? 'dark-root' : ''}`}>
      <div className="fp-topbar">
        <div className="topbar-row topbar-row-1">
          <div className="topbar-left">
            <button className="hamburger" aria-label="Open sidebar" onClick={() => setIsSidebarOpen(true)}>
              <i className="fa-solid fa-bars" />
            </button>
            <div className="brand-block">
              <div className="brand-row">
                <div className="logo">
                  <div className="logo">
                                    {/* Desktop / large-screen logo */}
                                    <img src={logo} alt="FreightPower" className="landing-logo-image desktop-logo" />
                                    {/* Responsive compact logo shown at <=768px */}
                                    <img src={resp_logo} alt="FreightPower" className="landing-logo-image mobile-logo" />
                                  </div>
                </div>
                      <div className="user-profile dd-user-profile">
                        <img 
                          src={profileData.profilePicture || "https://randomuser.me/api/portraits/men/75.jpg"} 
                          alt={profileData.name} 
                          className="avatar-img user-avatar-desktop dd-avatar-img"
                          onError={(e) => {
                            e.target.src = "https://randomuser.me/api/portraits/men/75.jpg";
                          }}
                        />
                        <div className="user-info user-info-desktop dd-user-info">
                          <div className="user-name">{profileData.name || 'Driver'}</div>
                          <div className="user-role dd-user-role">{profileData.role}</div>
                        </div>
                      </div>

              </div>
            </div>
          </div>

          <div className="topbar-right actions-right dd-actions-right">
            {isPostHire ? (
              /* Post-hire topbar content */
              <>
                <span className="dd-posthire-status">
                  <span className="dd-status-dot dd-all-docs-active" />
                  <span className="dd-status-text">All Docs Active</span>
                </span>
                <span className="dd-posthire-status">
                  <span className="dd-status-text">{isAvailable ? 'Available' : 'Unavailable'}</span>
                  <label className="dd-toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={isAvailable}
                      onChange={handleAvailabilityToggle}
                      disabled={availabilityLoading}
                    />
                    <span className="dd-toggle-slider"></span>
                  </label>
                </span>
                <span className="dd-posthire-status">
                  <i className="fa-regular fa-clock dd-timer-icon" />
                  <span className="dd-status-text">8h 45m left</span>
                </span>
                <div className="dd-notif-bell">
                  <i className="fa-regular fa-bell notif-icon dd-notif-icon" aria-hidden="true" />
                  <span className="dd-notif-badge">3</span>
                </div>
              </>
            ) : (
              /* Pre-hire topbar content */
              <>
                <span className="dd-missing-doc-chip">
                  <span className="missing-doc-dot dd-missing-doc-dot" />
                  <span className="missing-doc-text dd-missing-doc-text">Missing Docs</span>
                </span>
                <div className="dd-notif-bell">
                  <i className="fa-regular fa-bell notif-icon dd-notif-icon" aria-hidden="true" />
                  <span className="dd-notif-badge">3</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`fp-content-row ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <aside className={`fp-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="brand-row">
              <div className="logo"><img src={logo} alt="FreightPower" className="landing-logo-image" /></div>
            </div>
            <div className="ids mobile-ids">
              <div className="mobile-id-line"><span className="id-pair"><span className="id-label">{profileData.name || 'Driver'}</span></span></div>
              <div className="mobile-id-line"><span className="id-pair"><span className="id-label">{profileData.role}</span></span></div>
            </div>
            <div className="chips sidebar-chips">
              {isPostHire ? (
                <>
                  <span className="chip green">All Docs Active</span>
                  <span className={`chip ${isAvailable ? 'blue' : 'gray'}`}>
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <span className="chip orange">8h 45m left</span>
                </>
              ) : (
                <span className="chip yellow">Missing Docs</span>
              )}
            </div>
          </div>
          <nav className="fp-nav">
            {navGroups.map((group) => (
              <div className="nav-group" key={group.title}>
                <div className="nav-group-title">{group.title}</div>
                <ul>
                  {group.items.map((item) => (
                    <li
                      className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
                      key={item.key}
                      onClick={() => handleNavClick(item.key)}
                      role="button"
                      tabIndex={0}
                    >
                      <i className={`${item.icon} icon`} aria-hidden="true"></i>
                      <span className="label">{item.label}</span>
                      {item.key === 'messaging' && messagingUnread > 0 && (
                        <span className="nav-unread-badge">{messagingUnread > 99 ? '99+' : messagingUnread}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="sidebar-dark-control" aria-hidden="false">
            <span className="dark-label">Dark Mode</span>
            <button
              className="dark-toggle"
              aria-pressed={isDarkMode}
              aria-label="Toggle dark mode"
              onClick={() => setIsDarkMode((s) => !s)}
            >
              <span className="dark-toggle-knob" />
            </button>
          </div>
          <button className="sidebar-close" aria-label="Close sidebar" onClick={() => setIsSidebarOpen(false)}>
            <i className="fa-solid fa-xmark" />
          </button>
        </aside>

        {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)} />}

        <main className="fp-main">
          <ContentView activeNav={activeNav} />
        </main>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="modal-overlay" onClick={() => setShowSupportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Get Support</h3>
              <button className="modal-close" onClick={() => setShowSupportModal(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSupportSubmit} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Name</label>
                <input
                  type="text"
                  required
                  value={supportFormData.name}
                  onChange={(e) => setSupportFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Your name"
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email</label>
                <input
                  type="email"
                  required
                  value={supportFormData.email}
                  onChange={(e) => setSupportFormData(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="your.email@example.com"
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Subject</label>
                <input
                  type="text"
                  required
                  value={supportFormData.subject}
                  onChange={(e) => setSupportFormData(prev => ({ ...prev, subject: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Brief description of your issue"
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Message</label>
                <textarea
                  required
                  value={supportFormData.message}
                  onChange={(e) => setSupportFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Please describe your issue in detail..."
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn small ghost-cd"
                  onClick={() => setShowSupportModal(false)}
                  disabled={supportSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn small-cd"
                  disabled={supportSubmitting}
                >
                  {supportSubmitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
