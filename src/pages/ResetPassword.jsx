import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css"; // optional styling

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); // token from reset link
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // If token exists in URL, show reset form directly
  const hasToken = Boolean(token);

  // ✅ Step 1: Request reset link
  const handleRequestReset = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/request-reset", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending reset link");
    }
    setLoading(false);
  };

  // ✅ Step 2: Reset password
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return setMessage("Passwords do not match");
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", { token, newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    }
    setLoading(false);
  };

  return (
    <div className="reset-page">
      {!hasToken && (
        <>
          <h2>Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleRequestReset} disabled={loading || !email}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </>
      )}

      {hasToken && (
        <>
          <h2>Reset Your Password</h2>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleResetPassword} disabled={loading || !newPassword || !confirmPassword}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}
