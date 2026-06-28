import React from "react";
import "../dashboards/user/UserDashboard.css";

export default function DownloadsPanel({ files = [], onClose }) {
  return (
    <div className="overlay-panel">
      <h3>⬇️ Downloads</h3>
      {files.length === 0 ? (
        <p>No downloads available.</p>
      ) : (
        <ul>
          {files.map((f, i) => (
            <li key={i}>
              <a href={f.url} download>{f.name}</a>
            </li>
          ))}
        </ul>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
