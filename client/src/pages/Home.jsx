import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import QuickNav from "../components/QuickNav";
import Footer from "../components/Footer";
import "./App.css";

export default function Home() {
  return (
    <div className="homepage">
      <Navbar />
      <Hero />
      <QuickNav />
      <Footer />
    </div>
  );
}