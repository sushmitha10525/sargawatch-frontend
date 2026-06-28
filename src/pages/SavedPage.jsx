import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SavedPage.css";

export default function SavedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { savedItems = [] } = location.state || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Filtering logic
  const filteredItems = savedItems.filter((item) => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());

    const itemDate = new Date(item.date);
    const matchesMonth = filterMonth
      ? itemDate.getMonth() + 1 === parseInt(filterMonth)
      : true;
    const matchesYear = filterYear
      ? itemDate.getFullYear() === parseInt(filterYear)
      : true;
    const matchesDate = filterDate
      ? itemDate.getDate() === parseInt(filterDate)
      : true;

    return matchesSearch && matchesMonth && matchesYear && matchesDate;
  });

  return (
    <div className="saved-wrapper">
      <header className="saved-header">
        <h1>📌 Saved Locations</h1>
        <p className="subtitle">Your bookmarked bloom reports and areas</p>

        {/* Search + Filters */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by area name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="">Month</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="">Year</option>
            {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
            <option value="">Day</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="saved-main">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <img src="/images/empty-box.png" alt="Empty" className="empty-icon" />
            <h2>No saved reports yet</h2>
            <p className="hint">
              Bookmark bloom reports to build your personalized archive. 
              Future entries will show location, date, and time here.
            </p>
          </div>
        ) : (
          <div className="saved-grid">
            {filteredItems.map((item, index) => (
              <div key={index} className="saved-card">
                <div className="card-icon">🌍</div>
                <div className="card-content">
                  <h3>{item.text}</h3>
                  <p className="date">📅 {item.date} ⏰ {item.time}</p>
                </div>
                <button className="view-btn">View Details</button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="saved-footer">
        <button className="back-btn" onClick={() => navigate("/user-dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </footer>
    </div>
  );
}

