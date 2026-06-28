import React, { useState } from "react";
import "../dashboards/user/UserDashboard.css";

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h5 onClick={() => setOpen(!open)}>{question}</h5>
      {open && <p>{answer}</p>}
    </div>
  );
}

export default function HelpPanel({ onClose }) {
  const faqs = [
    { q: "How do I draw a custom area?", a: "Use the map tools to draw polygons or rectangles." },
    { q: "How do I download bloom data?", a: "Go to Notification Center → Data Download." }
  ];

  return (
    <div className="overlay-panel">
      <h3>❓ Help Center</h3>
      {faqs.map((f, i) => <FAQItem key={i} question={f.q} answer={f.a} />)}

      <h4>Contact Support</h4>
      <form>
        <input type="text" placeholder="Subject" />
        <textarea placeholder="Describe your issue..." />
        <button type="submit">Send</button>
      </form>

      <h4>Quick Links</h4>
      <button onClick={() => window.open("/docs/user-guide.pdf")}>📘 User Guide</button>
      <a href="mailto:support@sargawatch.org">📧 Email Support</a>
      <a href="tel:+91-9876543210">📞 Call Support</a>

      <button onClick={onClose}>Close</button>
    </div>
  );
}
