import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FaLinkedin, FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // fixed import
import axios from "axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [nickname, setNickname] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getNicknameFromEmail = (email) => (email ? email.split("@")[0] : "User");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation: allow email OR phone number
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      return setError("Please enter a valid email or phone number.");
    }

    try {
      // ✅ Detect role from identifier
      let roleRoute = "user/login";
      if (identifier.toLowerCase().includes("admin")) roleRoute = "admin/login";
      else if (identifier.toLowerCase().includes("officer")) roleRoute = "officer/login";

      // ✅ API call via axios (proxy handles /api)
      const res = await axios.post(`/api/auth/${roleRoute}`, {
        email: identifier, // backend expects 'email'
        password,
      });

      // ✅ Store JWT + role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      setError("");
      setLoginAttempts(0);

      const nick = getNicknameFromEmail(identifier);

      // ✅ Navigate to correct dashboard
      if (res.data.role === "admin") {
        navigate("/admin-dashboard", { state: { identifier, role: res.data.role, nickname: nick } });
      } else if (res.data.role === "officer") {
        navigate("/officer-dashboard", { state: { identifier, role: res.data.role, nickname: nick } });
      } else {
        navigate("/user-dashboard", { state: { identifier, role: res.data.role, nickname: nick } });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      setLoginAttempts((prev) => prev + 1);
    }
  };

  // ✅ Google login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleEmail = res.data.email;
        setIdentifier(googleEmail);
        setNickname(getNicknameFromEmail(googleEmail));
        // Example usage of jwtDecode if needed:
        // const decoded = jwtDecode(tokenResponse.access_token);
        alert(`Google login successful: ${googleEmail}`);
      } catch {
        setError("Google login failed");
      }
    },
    onError: () => setError("Google login failed"),
  });

  // ✅ LinkedIn login
  const handleLinkedInLogin = () => {
    const clientId = "YOUR_REAL_LINKEDIN_CLIENT_ID";
    const redirectUri = `${window.location.origin}/linkedin`;
    const scope = "r_liteprofile r_emailaddress";
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scope}`;
    window.location.href = authUrl;
  };

  // ✅ Microsoft login
  const handleMicrosoftLogin = () => {
    const clientId = "YOUR_MICROSOFT_APP_ID";
    const redirectUri = `${window.location.origin}/microsoft`;
    const scope = "openid profile email";
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scope}`;
    window.location.href = authUrl;
  };

  const handleForgotPassword = () => navigate("/reset-password");

  return (
    <div className="login-page">
      {/* Title Section */}
      <div className="title-section">
        <div className="title-with-logo">
          <h1 className="main-title">SARGAWATCH</h1>
          <img
            src={`${import.meta.env.BASE_URL}sargawatch-logo.png`}
            alt="SARGAWATCH Logo"
            className="main-logo-inline"
          />
        </div>
        <p><em>Satellite-Based Sargassum Bloom Monitoring</em></p>
        <p className="subtitle"><em>Empowering ocean research through innovation</em></p>
      </div>

      {/* Login Box */}
      <div className="login-container">
        <div className="box-title-with-logo">
          <h2 className="box-title">SARGAWATCH</h2>
          <img
            src={`${import.meta.env.BASE_URL}sargawatch-logo.png`}
            alt="SARGAWATCH Logo"
            className="login-logo"
          />
        </div>

        <p className="login-subtitle"><strong>LOGIN TO SARGAWATCH</strong></p>

        <form onSubmit={handleSubmit}>
          {!nickname && (
            <>
              <div className="form-inline">
                <label>Email or Phone:</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="Enter email or phone number"
                />
              </div>

              <div className="form-inline password-field">
                <label>Password:</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
            </>
          )}

          {error && <p className="error-message">{error}</p>}
          <button type="submit">Log In</button>
        </form>

        {/* Extra Links */}
        <div className="extra-links">
          <button type="button" onClick={handleForgotPassword}>Forgot password?</button>
          <br />
          Don’t have an account? <a href="#">Sign Up</a>
        </div>

        {/* Reset Code Section */}
        {resetCodeSent && (
          <div className="reset-section">
            <p>Enter the 6-digit code sent to your email or phone:</p>
            <input
              type="text"
              placeholder="Reset code"
              onChange={(e) => {
                if (e.target.value === generatedCode) {
                  alert("Code verified. You can now set a new password.");
                  navigate("/reset-password");
                }
              }}
            />
          </div>
        )}

        {/* Social Login */}
        <div className="social-login">
          <p>──────── Or login with ────────</p>
          <div className="social-icons">
            <button className="social-btn google-btn" onClick={() => googleLogin()}>
              <img src={`${import.meta.env.BASE_URL}google.png`} alt="Google" />
            </button>
            <button className="social-btn linkedin-btn" onClick={handleLinkedInLogin}>
              <FaLinkedin />
            </button>
            <button className="social-btn microsoft-btn" onClick={handleMicrosoftLogin}>
              <img src={`${import.meta.env.BASE_URL}microsoft-icon.png`} alt="Microsoft" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
