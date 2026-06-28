import React from "react";
import "./ShareMenu.css";

export default function ShareMenu({ onClose }) {
  const pageUrl = window.location.href;

  const handleAction = (platform) => {
    switch (platform) {
      case "WhatsApp":
        window.open(`https://wa.me/?text=${encodeURIComponent(pageUrl)}`, "_blank");
        break;
      case "Telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}`, "_blank");
        break;
      case "Facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, "_blank");
        break;
      case "Copy Link":
        navigator.clipboard.writeText(pageUrl).then(() => alert("Link copied!"));
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-box" onClick={(e) => e.stopPropagation()}>
        <h3>Share</h3>
        <button className="whatsapp" onClick={() => handleAction("WhatsApp")}>
          <span className="icon">📱</span> WhatsApp
        </button>
        <button className="telegram" onClick={() => handleAction("Telegram")}>
          <span className="icon">✈️</span> Telegram
        </button>
        <button className="facebook" onClick={() => handleAction("Facebook")}>
          <span className="icon">📘</span> Facebook
        </button>
        <button className="copy" onClick={() => handleAction("Copy Link")}>
          <span className="icon">🔗</span> Copy Link
        </button>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
