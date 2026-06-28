import React from "react";
import "../dashboards/user/UserDashboard.css";

export default function FavoritesPanel({ favorites = [], onClose, onRemove }) {
  return (
    <div className="overlay-panel">
      <h3>⭐ Favorites</h3>

      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <ul>
          {favorites.map((f, i) => (
            <li key={i}>
              {f.text} — {f.date}
              {onRemove && (
                <button
                  style={{ marginLeft: "8px", fontSize: "0.7rem" }}
                  onClick={() => onRemove(i)}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
}

