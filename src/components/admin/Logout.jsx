import React from 'react';
import '../../styles/admin/Logout.css';

export default function Logout(){
  function handleSignOut(){
    // perform any local cleanup and redirect to admin login route
    // keep this simple and use a location change so SPA routing will pick it up on refresh
    window.location.href = '/admin-login';
  }

  return (
    <div className="logout-root">
      <div className="logout-card card">
        <div className="logout-icon"> <i className="fa-solid fa-right-from-bracket" /></div>
        <h3>Sign out of FreightPower Admin?</h3>
        <p className="muted">You will be returned to the admin sign-in screen. If you want to remain signed in on this device, choose Cancel.</p>
        <div className="logout-actions">
          <button className="btn small ghost-cd">Cancel</button>
          <button className="btn small-cd" style={{background: "red"}}>Sign Out</button>
        </div>
      </div>
    </div>
  )
}
