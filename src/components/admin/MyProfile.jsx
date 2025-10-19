import React, { useState } from 'react';
import '../../styles/admin/MyProfile.css';

export default function MyProfile() {
	return (
		<div className="my-profile-root">
			<header className="fp-header">
				<div className="fp-header-titles">
					<h2>My Profile</h2>
					<p className="fp-subtitle">Role: Compliance & Operations Sub-Admin · Last updated: Oct 15 2025 at 09:22 AM</p>
				</div>
			</header>

			<div className="profile-top-grid">
				<div className="card profile-card">
					<div className="card-header"><h3> Personal Details</h3></div>
                    <div className="profile-avatar-big">
							<div className="avatar-frame">
								<img src="https://randomuser.me/api/portraits/women/65.jpg" alt="avatar" />
							</div>
							<div className="upload-text">Click to upload new photo</div>
						</div>
					<div className="profile-card-body">

						<div className="profile-fields">
							<label>Full Name</label>
							<input defaultValue="Laiba Ahmar" />

							<label>Role</label>
							<input defaultValue="Compliance & Operations" />

							<label>Email Address</label>
							<input defaultValue="laiba.ahmar@freightpower.ai" />

							<label>Phone Number</label>
							<input defaultValue="+1 (555) 123-4567" />

							<label>Department / Team</label>
							<select><option>Compliance Operator</option></select>

							<label>Time Zone</label>
							<select><option>Central Time (CT)</option></select>

							<label>Language</label>
							<select><option>English (EN)</option></select>

							<label>Location</label>
							<div className="location-row">
								<input defaultValue="Minneapolis, MN" />
							</div>
						</div>
					</div>
				</div>

				<div className="card prefs-card">
					<div className="card-header"><h3>Account & Preferences</h3></div>
					<div className="prefs-body">

						<div className="pref-section" style={{marginBottom: "20px"}}>
							<h4>Quick Actions</h4>
							<button className="btn small ghost-cd">Change Profile Photo</button>
						</div>

						<div className="pref-section">
							<h4>Privacy Settings</h4>
								{/** Preference toggles made interactive with local state */}
								<PrefToggles />
						</div>
					</div>
				</div>
			</div>

			<div className="card login-activity">
				<div className="card-header">
					<h3>Login Activity</h3>
					<div className="actions"><button className="btn small-cd" style={{background: 'red'}}>Sign Out All Devices</button></div>
				</div>

				<div className="login-table">
					<table>
						<thead>
							<tr>
								<th>Device</th>
								<th>Location</th>
								<th>Last Access</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>MacBook Pro</td>
								<td>Minneapolis, MN</td>
								<td>Today 9:12 AM</td>
								<td><span className="int-status-badge active">Active</span></td>
							</tr>
							<tr>
								<td>iPhone 15</td>
								<td>Mobile</td>
								<td>Yesterday 6:45 PM</td>
								<td><span className="int-status-badge active">Active</span></td>
							</tr>
							<tr>
								<td>Windows PC</td>
								<td>Office Network</td>
								<td>Oct 12 2025</td>
								<td><span className="int-status-badge revoked">Signed Out</span></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
            <div style={{justifyContent: "flex-end", display:'flex', gap: '10px', marginTop: '20px'}}>
                <button className="btn small-cd">Save Changes</button>
                <button className="btn small ghost-cd">Cancel</button>
            </div>
		</div>
	);
}

function PrefToggles(){
	const [showEmail, setShowEmail] = useState(true);
	const [twoFactor, setTwoFactor] = useState(false);
	const [autoSignIn, setAutoSignIn] = useState(true);

	return (
		<>
			<div className="pref-row">
				<div className="pref-left">
					<span>Show email to internal team only</span>
					<div className="muted">Your email will be visible to team members</div>
				</div>
				<button
					aria-pressed={showEmail}
					onClick={() => setShowEmail(s => !s)}
					className={`pref-toggle ${showEmail ? 'on' : ''}`}
				/>
			</div>

			<div className="pref-row">
				<div className="pref-left">
					<span>Enable two-factor login via email</span>
					<div className="muted">Extra security for your account</div>
				</div>
				<button
					aria-pressed={twoFactor}
					onClick={() => setTwoFactor(s => !s)}
					className={`pref-toggle ${twoFactor ? 'on' : ''}`}
				/>
			</div>

			<div className="pref-row">
				<div className="pref-left">
					<span>Enable auto-sign-in from trusted devices</span>
					<div className="muted">Stay logged in on recognized devices</div>
				</div>
				<button
					aria-pressed={autoSignIn}
					onClick={() => setAutoSignIn(s => !s)}
					className={`pref-toggle ${autoSignIn ? 'on' : ''}`}
				/>
			</div>
		</>
	)
}

