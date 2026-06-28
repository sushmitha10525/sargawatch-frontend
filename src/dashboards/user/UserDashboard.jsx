import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDashboard.css";
import ShareMenu from "../../pages/ShareMenu";
import * as turf from "@turf/turf";

// ✅ Leaflet imports
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// ✅ Panels
import DownloadsPanel from "../../pages/DownloadsPanel";
import FavoritesPanel from "../../pages/FavoritesPanel";
import HelpPanel from "../../pages/HelpPanel";
import SettingsPanel from "../../pages/SettingsPanel";
import SearchHistoryPanel from "../../pages/SearchHistoryPanel";

export default function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Values passed from login page
  const { email, role, fullName, profilePic, address, doorNo, pincode, phone, gender } =
    location.state || {};

  // UI states
  const [activeTimeline, setActiveTimeline] = useState("6h");
  const [forecastMode, setForecastMode] = useState("past");
  const [rating, setRating] = useState(0);
  const [experience, setExperience] = useState("");
  const [photo, setPhoto] = useState(null);
  const [selectedDownload, setSelectedDownload] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [savedItems, setSavedItems] = useState([]);

  // ✅ Panels open/close
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  // ✅ Backend data state
  const [riskLevel, setRiskLevel] = useState("Loading...");
  const [advisoryMessage, setAdvisoryMessage] = useState("Fetching advisory...");

  // ✅ Map state
  const [points, setPoints] = useState([]);
  const [bloomArea, setBloomArea] = useState(820); // default

  // ✅ Fetch protected data from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/user/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRiskLevel(res.data.riskLevel || "Unknown");
        setAdvisoryMessage(res.data.advisory || "No advisory available.");
      })
      .catch((err) => {
        setRiskLevel("Error");
        setAdvisoryMessage(err.response?.data?.error || "Failed to fetch data.");
      });
  }, []);

  const alertState =
    riskLevel === "Low" ? "safe" : riskLevel === "Medium" ? "warning" : "emergency";

  // ✅ Helper: derive nickname from email
  const getNicknameFromEmail = (email) => {
    if (!email) return "User";
    return email.split("@")[0];
  };

  // Feedback form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Submitted!\nRating: ${rating} stars\nExperience: ${experience}\nPhoto: ${
        photo ? photo.name : "None"
      }`
    );
  };

  // Menu actions
  const handleCastSave = () => {
    const newItem = {
      text: `Saved bloom report at ${new Date().toLocaleTimeString()}`,
      date: new Date().toLocaleDateString(),
    };
    const updatedItems = [...savedItems, newItem];
    setSavedItems(updatedItems);
    navigate("/saved", { state: { savedItems: updatedItems } });
  };

  const handleShare = () => setShareOpen(true);
  const handleHistory = () => setHistoryOpen(true);
  const handleDownloads = () => setDownloadsOpen(true);
  const handleFavorites = () => setFavoritesOpen(true);
  const handleHelp = () => setHelpOpen(true);
  const handleSettings = () => setSettingsOpen(true);
  const handleExit = () => {
    setSavedItems([]);
    navigate("/login");
  };
  {settingsOpen && (
  <SettingsPanel
    settings={{ theme: "Light", emailAlerts: true }}
    onClose={() => setSettingsOpen(false)}
    setSearchHistory={setSearchHistory}
    setFavoritesOpen={setFavoritesOpen}
  />
)}


  return (
    <div className="dashboard-grid">
      {/* Header */}
      <header className="header">
        <div className="logo-title">
          <div className="title-logo-inline">
            <h1 className="main-title">SARGAWATCH</h1>
            <img src="sargawatch-logo.png" alt="SARGAWATCH" className="logo" />
          </div>
          <p className="subtitle">Coastal Bloom Monitor</p>
        </div>

        <div className="nav-boxes">
          <button className="active">Dashboard</button>
          <button className={`alert-btn ${alertState}`}>
            <span className="bell-icon">🔔</span> Alerts
          </button>
          <button>Compare</button>
          <button>Reports</button>

          {/* Three-dotted menu */}
          <div className="menu-container">
            <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>⋮</button>
            {menuOpen && (
              <ul className="menu-dropdown">
                <li
                  className="menu-profile"
                  onClick={() =>
                    navigate("/profile", {
                      state: {
                        email,
                        nickname: getNicknameFromEmail(email),
                        role,
                        fullName,
                        profilePic,
                        address,
                        doorNo,
                        pincode,
                        phone,
                        gender,
                      },
                    })
                  }
                >
                  👤 {getNicknameFromEmail(email)}
                </li>
                <li onClick={handleCastSave}>💾 Cast Save</li>
                <li onClick={handleShare}>📤 Share</li>
                <li onClick={handleHistory}>📜 History</li>
                <li onClick={handleDownloads}>⬇️ Downloads</li>
                <li onClick={handleFavorites}>⭐ Favorites</li>
                <li onClick={handleHelp}>❓ Help</li>
                <li onClick={handleSettings}>⚙️ Settings</li>
                <li onClick={handleExit}>🚪 Exit</li>
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* Modules Grid */}
      <div className="modules-grid">
        {/* Map */}
        <div className="card map-card">
          <h2>Draw Custom Area: {points.length > 0 ? "Selected Area" : "Goa Coast"}</h2>
          <MapContainer
            center={[15.2993, 74.1240]}
            zoom={8}
            style={{ height: "250px", width: "100%" }}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; SARGAWATCH Coastal Bloom Monitor"
            />
            <FeatureGroup>
              <EditControl
                position="topright"
                draw={{
                  rectangle: true,
                  polygon: true,
                  circle: false,
                  marker: false,
                  polyline: false,
                }}
                onCreated={(e) => {
                  const layer = e.layer;
                  const geojson = layer.toGeoJSON();
                  const areaSqMeters = turf.area(geojson);
                  setPoints(
                    geojson.geometry.coordinates[0].map(([lng, lat]) => [lat, lng])
                  );
                  setBloomArea((areaSqMeters / 10000).toFixed(2));
                }}
              />
            </FeatureGroup>
          </MapContainer>
          <div className="info-boxes">
            <span className="info-box">Bloom Area: {bloomArea} ha</span>
            <span className="info-box">Confidence: 90%</span>
          </div>
          <div className="risk-bar">
            <div className={`risk-segment low ${riskLevel === "Low" ? "active" : ""}`}>Low</div>
            <div className={`risk-segment medium ${riskLevel === "Medium" ? "active" : ""}`}>Medium</div>
            <div className={`risk-segment high ${riskLevel === "High" ? "active" : ""}`}>High</div>
          </div>
          <p className="advisory">{advisoryMessage}</p>
        </div>

        {/* Impact */}
        <div className="card impact-card">
          <h2>Tourism Impact Estimator</h2>
          <p>Est. Tourism Loss: ₹12.8 Lakh / Week</p>
          <p>Cleanup Urgency: High</p>
                  <p>Economic Loss: ₹26 Lakh Estimated Cost</p>
        </div>

        {/* Notification */}
        <div className="card notification-card">
          <h2>Notification Center</h2>
          <ul>
            <li>High Bloom Alert — 10 mins ago</li>
            <li>Weekly Report Ready — 1 hour ago</li>
            <li>Safe Beach: Radhanagar — 4 hours ago</li>
          </ul>
          <h3>Data Download</h3>
          <div className="download-buttons">
            <button
              className={`download-btn ${selectedDownload === "raw" ? "active" : ""}`}
              onClick={() => setSelectedDownload("raw")}
            >
              Raw Images
            </button>
            <button
              className={`download-btn ${selectedDownload === "processed" ? "active" : ""}`}
              onClick={() => setSelectedDownload("processed")}
            >
              Processed
            </button>
            <button
              className={`download-btn ${selectedDownload === "csv" ? "active" : ""}`}
              onClick={() => setSelectedDownload("csv")}
            >
              CSV
            </button>
          </div>
        </div>

        {/* History */}
        <div className="card history-card">
          <h3>24-Hour Bloom History</h3>
          <div className="timeline-buttons">
            {["1h", "6h", "12h", "24h", "Now"].map((t) => (
              <button
                key={t}
                className={activeTimeline === t ? "active" : ""}
                onClick={() => setActiveTimeline(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <p>Time: {activeTimeline} ago • Bloom Area: 950 ha</p>
        </div>

        {/* Heatmap */}
        <div className="card">
          <h3>Severity Heatmap</h3>
          <div className="heatmap">[Heatmap]</div>
        </div>

        {/* Comparison */}
        <div className="card">
          <h3>Caribbean vs Indian Ocean</h3>
          <p>[Bar Graphs]</p>
        </div>

        {/* Forecast + Feedback */}
        <div className="card feedback-card">
          <h3>Bloom Forecast</h3>
          <div className="forecast-toggle">
            <button
              className={forecastMode === "past" ? "active" : ""}
              onClick={() => setForecastMode("past")}
            >
              Past 7 Days
            </button>
            <button
              className={forecastMode === "next" ? "active" : ""}
              onClick={() => setForecastMode("next")}
            >
              Next 7 Days
            </button>
          </div>
          <div className="forecast-map">[Forecast Map: {forecastMode}]</div>

          <h3>User Feedback</h3>
          <form onSubmit={handleSubmit}>
            <label>Rate Bloom Severity:</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${rating >= star ? "active" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Describe what you observed..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />

            {/* Upload photo */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />

            {/* Submit button */}
            <button type="submit">Submit Report</button>
          </form>

          {/* Show saved Cast items if any */}
          {savedItems.length > 0 && (
            <div className="saved-items">
              <h4>Cast Saved Reports</h4>
              <ul>
                {savedItems.map((item, index) => (
                  <li key={index}>
                    {item.text} — {item.date}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Forecast & statistics by SDC Labs</p>
      </footer>

      {/* ✅ Overlays */}
      {shareOpen && <ShareMenu onClose={() => setShareOpen(false)} />}
      {downloadsOpen && <DownloadsPanel onClose={() => setDownloadsOpen(false)} />}
      {favoritesOpen && <FavoritesPanel onClose={() => setFavoritesOpen(false)} />}
      {helpOpen && <HelpPanel onClose={() => setHelpOpen(false)} />}
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      {historyOpen && <SearchHistoryPanel onClose={() => setHistoryOpen(false)} />}
    </div>
    
  );
}
