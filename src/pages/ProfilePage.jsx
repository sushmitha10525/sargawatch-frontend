import React from "react";
import { useLocation } from "react-router-dom";
import "./ProfilePage.css";

export default function ProfilePage() {
  const location = useLocation();
  const { email, role, fullName, profilePic, address, doorNo, pincode, phone, gender } = location.state || {};

  // Helper: derive nickname from email
  const getNicknameFromEmail = (email) => {
    if (!email) return "Nickname";
    const base = email.split("@")[0]; // take everything before @
    // shorten if it starts with "ssush" → "sush"
    if (base.startsWith("ssush")) return "sush";
    return base;
  };

  const nickname = getNicknameFromEmail(email);

  return (
    <div className="profile-page">
      <h2 className="profile-title">Login Information</h2>
      <div className="profile-card">
        <img
          src={profilePic || "/images/default-avatar.png"}
          alt="Profile"
          className="profile-pic"
        />
        <h3>{fullName || nickname}</h3> {/* ✅ show full name if available, else nickname */}
        <p>Nickname: {nickname}</p>
        <p>Email: {email}</p>
        <p>Role: {role}</p>
        <p>Permanent Address: {address}</p>
        <p>Door No: {doorNo}</p>
        <p>Pincode: {pincode}</p>
        <p>Phone: {phone}</p>
        <p>Gender: {gender}</p>
      </div>
    </div>
  );
}
