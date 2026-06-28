import React, { useState } from "react";
import "../dashboards/user/UserDashboard.css";

export default function SettingsPanel({
  settings = {},
  onClose,
  setSearchHistory,
  setFavoritesOpen
}) {
  const [theme, setTheme] = useState(settings.theme || "Light");
  const [emailAlerts, setEmailAlerts] = useState(settings.emailAlerts || false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  // Apply theme change immediately
  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme.toLowerCase());
  };

  // Toggle email alerts
  const handleEmailAlerts = async (e) => {
    const enabled = e.target.checked;
    setEmailAlerts(enabled);
    await fetch("/api/user/settings/email-alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled })
    });
  };

  // Change password flow
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const current = e.target.current.value;
    const newPass = e.target.newPass.value;
    const confirm = e.target.confirm.value;

    if (newPass !== confirm) {
      alert("New passwords do not match!");
      return;
    }

    await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current, newPass })
    });
    alert("Password updated successfully!");
    setShowPasswordModal(false);
  };

  // Clear history flow
  const handleClearHistory = async () => {
  await fetch("/api/user/history/clear", { method: "DELETE" });
  setSearchHistory([]); // empties frontend state
};

  // Manage favorites
  const handleManageFavorites = () => {
    if (setFavoritesOpen) setFavoritesOpen(true); // open Favorites overlay
  };

  // Open help with recovery option
  const handleOpenHelp = () => {
    setShowRecoveryModal(true);
  };

  // Recovery form submit
  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    const contact = e.target.contact.value;
    await fetch("/api/user/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact })
    });
    alert("Recovery link sent!");
    setShowRecoveryModal(false);
  };

  return (
    <div className="overlay-panel">
      <h3>⚙️ Settings</h3>

      <h4>🎨 Appearance</h4>
      <label>
        Theme:
        <select value={theme} onChange={handleThemeChange}>
          <option>Light</option>
          <option>Dark</option>
        </select>
      </label>

      <h4>🔔 Notifications</h4>
      <label>
        Email Alerts:
        <input
          type="checkbox"
          checked={emailAlerts}
          onChange={handleEmailAlerts}
        />
      </label>

      <h4>👤 Account</h4>
      <button onClick={() => setShowPasswordModal(true)}>Change Password</button>

      <h4>🔒 Privacy</h4>
      <button onClick={handleClearHistory}>Clear Search History</button>

      <h4>⭐ Favorites</h4>
      <button onClick={handleManageFavorites}>Manage Favorites</button>

      <h4>❓ Help</h4>
      <button onClick={handleOpenHelp}>Open Help Center</button>

      <button onClick={onClose}>Close</button>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="overlay-panel">
          <h3>🔒 Change Password</h3>
          <form onSubmit={handlePasswordSubmit}>
            <input type="password" name="current" placeholder="Current Password" required />
            <input type="password" name="newPass" placeholder="New Password" required />
            <input type="password" name="confirm" placeholder="Confirm New Password" required />
            <button type="submit">Update</button>
            <button type="button" onClick={() => setShowPasswordModal(false)}>Cancel</button>
          </form>
        </div>
      )}

      {/* Recovery Modal */}
      {showRecoveryModal && (
        <div className="overlay-panel">
          <h3>🔑 Account Recovery</h3>
          <form onSubmit={handleRecoverySubmit}>
            <input type="text" name="contact" placeholder="Email or Phone" required />
            <button type="submit">Send Recovery Link</button>
            <button type="button" onClick={() => setShowRecoveryModal(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}
