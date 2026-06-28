import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      // ✅ Correct endpoint: /api/admin/dashboard
      .get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data.stats))
      .catch((err) => {
        console.error("Admin dashboard error:", err);
        setError(err.response?.data?.error || "Failed to fetch admin data");
      });
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {stats ? (
        <ul>
          <li>Total Users: {stats.totalUsers}</li>
          <li>Active Users: {stats.activeUsers}</li>
          <li>Suspended Users: {stats.suspendedUsers}</li>
          <li>Officers: {stats.officers}</li>
        </ul>
      ) : (
        <p>Loading stats...</p>
      )}
    </div>
  );
}
