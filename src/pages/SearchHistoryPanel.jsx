import React from "react";
import "../dashboards/user/UserDashboard.css";

export default function SearchHistoryPanel({ history = [], onClose }) {
  return (
    <div className="overlay-panel">
      <h3>📜 Search History</h3>
      {searchHistory.length === 0 ? (
        <p>No searches yet.</p>
      ) : (
        <ul>
          {history.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
