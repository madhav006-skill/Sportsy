import React from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../lib/auth.js";

function QuickNav() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleChatClick = () => {
    if (!user) {
      alert("Please log in first to access the chat");
      navigate("/signin");
    } else {
      navigate("/chat");
    }
  };

  return (
    <section className="quick-nav">
      <h2 className="quick-nav-title">Quick Navigation</h2>
      <div className="quick-buttons">
        <button onClick={handleHomeClick} className="quick-btn">
          <span className="quick-btn-icon">🏠</span>
          <span className="quick-btn-text">Home</span>
        </button>
        <button onClick={handleChatClick} className="quick-btn">
          <span className="quick-btn-icon">💬</span>
          <span className="quick-btn-text">Chat</span>
        </button>
      </div>
    </section>
  );
}

export default QuickNav;