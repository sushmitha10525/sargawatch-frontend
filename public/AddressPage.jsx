import React, { useState } from "react";
import "./AddressPage.css";

export default function AddressPage() {
  const [address, setAddress] = useState("");
  const [doorNo, setDoorNo] = useState("");
  const [pincode, setPincode] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    alert(`Saved!\nAddress: ${address}\nDoor No: ${doorNo}\nPincode: ${pincode}`);
  };

  return (
    <div className="address-page">
      <h2>Address Information</h2>
      <form onSubmit={handleSave}>
        <label>Permanent Address:</label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} />

        <label>Door No:</label>
        <input type="text" value={doorNo} onChange={(e) => setDoorNo(e.target.value)} />

        <label>Pincode:</label>
        <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} />

        <button type="submit">Save Information</button>
      </form>
    </div>
  );
}
