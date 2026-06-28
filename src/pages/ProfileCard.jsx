import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./ProfilePage.css";

export default function ProfilePage() {
  const location = useLocation();
  const { email, role, fullName, nickname, profilePic, phone, gender } = location.state || {};

  const [address, setAddress] = useState("");
  const [doorNo, setDoorNo] = useState("");
  const [pincode, setPincode] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    alert(`Saved!\nAddress: ${address}\nDoor No: ${doorNo}\nPincode: ${pincode}`);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={profilePic || "/images/default-avatar.png"}
          alt="Profile"
          className="profile-pic"
        />
        {/* ✅ Nickname is the main identity */}
        <h2>{nickname}</h2>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Role:</strong> {role}</p>
        <p><strong>Name:</strong> {fullName}</p>
        <p><strong>Phone:</strong> {phone ? phone : "❌ Not linked"}</p>
        <p><strong>Gender:</strong> {gender}</p>
      </div>

      {/* Editable fields */}
      <form className="profile-form" onSubmit={handleSave}>
        <label>Permanent Address:</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter permanent address"
        />

        <label>Door No:</label>
        <input
          type="text"
          value={doorNo}
          onChange={(e) => setDoorNo(e.target.value)}
          placeholder="Enter door number"
        />

        <label>Pincode:</label>
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter pincode"
        />

        <button type="submit">Save Information</button>
      </form>
    </div>
  );
}
