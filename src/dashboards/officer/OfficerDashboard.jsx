import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OfficerDashboard() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/auth/officer/login", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReports(res.data.reports || []))
      .catch((err) => setError(err.response?.data?.error || "Failed to fetch officer data"));
  }, []);

  return (
    <div>
      <h1>Officer Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {reports.length > 0 ? (
        <ul>
          {reports.map((report, idx) => (
            <li key={idx}>{report.title || "Unnamed Report"} — {report.status}</li>
          ))}
        </ul>
      ) : (
        <p>No reports assigned yet.</p>
      )}
    </div>
  );
}
