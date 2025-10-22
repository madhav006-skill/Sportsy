import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUserFromToken, logout as authLogout } from "../lib/auth.js";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const user = React.useMemo(() => getUserFromToken(), [location]);

  React.useEffect(() => {
    const onDocClick = (e) => {
      if (open && !e.target.closest(".navbar-profile")) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  const handleLogout = () => {
    authLogout();
    setOpen(false);
    navigate("/");
  };

  const handleChatClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("Please log in first to access the chat");
      navigate("/signin");
    }
  };

  return (
    <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          <span className="brand">SPORTSY</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/chat" onClick={handleChatClick}>Chat</Link></li>
          {user ? (
            <li className="navbar-profile relative">
              <button
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="profile-trigger"
              >
                <span className="profile-avatar">{(user.name || user.email || "U").slice(0,1).toUpperCase()}</span>
                <svg className={`profile-chevron ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.167l3.71-3.936a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
              </button>
              {open && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <div className="profile-label">Signed in as</div>
                    <div className="profile-name">{user.name || user.email || "User"}</div>
                    {user.email && <div className="profile-email">{user.email}</div>}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link
                to="/signin"
                className="signin-btn"
              >
                Sign In / Sign Up
              </Link>
            </li>
          )}
        </ul>
      </nav>
  );
}

export default Navbar;