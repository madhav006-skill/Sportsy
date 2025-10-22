import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookButton({ turfId, turfData }) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Pass full turf data via state so BookingPage can access it
    navigate(`/book/${turfId}`, { 
      state: { turf: turfData } 
    });
  };

  return (
    <button
      onClick={handleBookNow}
      className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
    >
      Book Now
    </button>
  );
}
