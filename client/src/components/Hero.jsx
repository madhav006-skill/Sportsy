import React from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../lib/auth";

function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      navigate("/dashboard");
    } else {
      navigate("/signin");
    }
  };

  return (
    <section className="hero">
      <div className="hero-glow"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-word">Discover</span>
          <span className="hero-title-dot">.</span>
        </h1>
        <p className="hero-description">
          The world with Sportsy. Join us and get the opportunity to book turfs,
          organize matches, and earn points.
        </p>
        <div className="cta-buttons">
          <button className="readmore-btn">Read More</button>
          <button className="getstarted-btn" onClick={handleGetStarted}>Get Started</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;