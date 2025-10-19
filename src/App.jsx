import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './components/landing_page/LandingPage'
import HelpCenter from './components/landing_page/HelpCenter'
import RoleSelection from './components/landing_page/RoleSelection'
import Signup from './components/Signup'
import Login from './components/Login'
import AdminSignup from './components/AdminSignup'
import AdminLogin from './components/AdminLogin'
import Verification from './components/verification/Verification'
import AdminVerification from './components/verification/AdminVerification'
import CarrierDashboard from './components/carrier/CarrierDashboard'
import DriverDashboard from './components/driver/DriverDashboard'
import ShipperDashboard from './components/shipper/ShipperDashboard'
import AdminDashboard from './components/admin/AdminDashboard'
import SuperAdminDashboard from './components/super_admin/SuperAdminDashboard'
import CarrierOnboarding from './components/onboarding/CarrierOnboarding'
import DriverOnboarding from './components/onboarding/DriverOnboarding'
import ShipperOnboarding from './components/onboarding/ShipperOnboarding'
import './App.css'
import Chatbot from './components/landing_page/Chatbot'
import { useState } from 'react'
import AI from '/src/assets/chatbot.svg'

function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMinimized, setChatMinimized] = useState(false)
  return (
    <Router>
      <InnerRoutes chatOpen={chatOpen} chatMinimized={chatMinimized} setChatOpen={setChatOpen} setChatMinimized={setChatMinimized} />
    </Router>
  )
}

function InnerRoutes({ chatOpen, chatMinimized, setChatOpen, setChatMinimized }){
  const location = useLocation()
  const showChat = location.pathname === '/'

  return (
    <>
      {/* persistent chatbot bubble - only show on landing page */}
      {showChat && !chatOpen && !chatMinimized && (
        <div style={{position:'fixed', right:18, bottom:18, zIndex:1200}}>
          <div onClick={() => setChatOpen(s => !s)} style={{width:56,height:56,borderRadius:12,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 20px rgba(16,24,40,0.12)',cursor:'pointer'}}>
            <img src={AI} alt="AI" style={{width:36,height:36}} />
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/faq" element={<HelpCenter />} />
  <Route path="/select-role" element={<RoleSelection />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />
  <Route path="/admin-signup" element={<AdminSignup />} />
  <Route path="/admin-login" element={<AdminLogin />} />
  <Route path="/onboarding/carrier" element={<CarrierOnboarding />} />
  <Route path="/onboarding/driver" element={<DriverOnboarding />} />
  <Route path="/onboarding/shipper" element={<ShipperOnboarding />} />
  <Route path="/verify" element={<Verification />} />
  <Route path="/admin-verify" element={<AdminVerification />} />
  <Route path="/carrier-dashboard" element={<CarrierDashboard />} />
  <Route path="/driver-dashboard" element={<DriverDashboard />} />
  <Route path="/admin-dashboard" element={<AdminDashboard />} />
  <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
  <Route path="/shipper-dashboard" element={<ShipperDashboard />} />
      </Routes>
      {showChat && <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} onMinimizeChange={(min)=>{ setChatMinimized(min) }} />}
    </>
  )
}

export default App
