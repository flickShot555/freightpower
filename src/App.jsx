import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/landing_page/LandingPage'
import HelpCenter from './components/landing_page/HelpCenter'
import RoleSelection from './components/landing_page/RoleSelection'
import CarrierSignup from './components/carrier/CarrierSignup'
import Login from './components/Login'
import DriverSignup from './components/driver/DriverSignup'
import ShipperSignup from './components/shipper/ShipperSignup'
import Verification from './components/verification/Verification'
import CarrierDashboard from './components/carrier/CarrierDashboard'
import DriverDashboard from './components/driver/DriverDashboard'
import ShipperDashboard from './components/shipper/ShipperDashboard'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/faq" element={<HelpCenter />} />
  <Route path="/select-role" element={<RoleSelection />} />
  <Route path="/carrier-signup" element={<CarrierSignup />} />
  <Route path="/driver-signup" element={<DriverSignup />} />
  <Route path="/shipper-signup" element={<ShipperSignup />} />
  <Route path="/login" element={<Login />} />
  <Route path="/verify" element={<Verification />} />
  <Route path="/carrier-dashboard" element={<CarrierDashboard />} />
  <Route path="/driver-dashboard" element={<DriverDashboard />} />
  <Route path="/shipper-dashboard" element={<ShipperDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
