import { Link } from 'react-router-dom'
import '../../styles/landing_page/role-selection.css'

export default function RoleSelection() {
  return (
    <div className="role-page">
      <div className="role-container">
        <h1>Select your role</h1>
        <p className="subtitle">Choose the account type that best describes you to continue sign up.</p>
        <div className="roles-grid">
          <Link to="/carrier-signup" className="role-card carrier">
            <div className="role-icon">🚚</div>
            <h2>Carrier</h2>
            <p>Manage loads, bids and dispatches.</p>
          </Link>

          <Link to="/driver-signup" className="role-card driver">
            <div className="role-icon">👨‍✈️</div>
            <h2>Driver</h2>
            <p>Complete trips and upload documents.</p>
          </Link>

          <Link to="/shipper-signup" className="role-card shipper">
            <div className="role-icon">📦</div>
            <h2>Broker/Shipper</h2>
            <p>Post loads and track shipments.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
