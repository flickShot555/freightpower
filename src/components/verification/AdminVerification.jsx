import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/verification/Verification.css';

const AdminVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (location && location.state && location.state.role) || 'carrier';

  const goToDashboardForRole = (r) => {
    switch (r) {
      case 'admin':
        return '/admin-dashboard';
      case 'driver':
        return '/driver-dashboard';
      case 'shipper':
        return '/shipper-dashboard';
      case 'carrier':
      default:
        return '/carrier-dashboard';
    }
  }

  return (
    <div className="verification-page">
      <div className="verification-container">
        <button className="verification-close" onClick={() => navigate(-1)}>✕</button>
        <div className="verification-card">
          <div className="verification-icon">📱</div>
          <h2>Change to Verify with SMS</h2>
          <p className="verification-sub">We have sent code to your number +92381***445</p>

          <form className="verification-form" onSubmit={(e) => { e.preventDefault(); /* after verification redirect based on role */ navigate(goToDashboardForRole(role)); }}>
            <div className="verification-otp">
              <input maxLength={1} />
              <input maxLength={1} />
              <input maxLength={1} />
              <input maxLength={1} />
              <input maxLength={1} />
            </div>
            <button type="submit" className="verification-btn">Verify Account</button>
          </form>

          <div className="verification-resend">Resend code in <span>59:00</span></div>
        </div>
      </div>
      <footer className="verification-footer">
        <div className="verification-footer-left">Privacy Policy</div>
        <div className="verification-footer-right">Copyright 2024</div>
      </footer>
    </div>
  );
};

export default AdminVerification;
