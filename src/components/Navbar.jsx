import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('second_life_requests') || '[]');
        setRequestCount(stored.length);
      } catch {
        setRequestCount(0);
      }
    };

    updateCount();
    // Poll or update on focus
    window.addEventListener('focus', updateCount);
    return () => window.removeEventListener('focus', updateCount);
  }, [location.pathname]);

  const handleNavAnchor = (e, targetId) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${targetId}`);
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12" />
              <path d="M12 6v6l4 2" />
              <path d="M7 2v5h5" />
            </svg>
          </div>
          <span>Second Life</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${location.pathname === '/' && !location.hash ? 'is-active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <a 
                href="#how-it-works" 
                onClick={(e) => handleNavAnchor(e, 'how-it-works')} 
                className="nav-link"
              >
                How It Works
              </a>
            </li>
            <li>
              <a 
                href="#impact" 
                onClick={(e) => handleNavAnchor(e, 'impact')} 
                className="nav-link"
              >
                Impact
              </a>
            </li>
            <li>
              <Link to="/requests" className={`nav-link ${location.pathname === '/requests' ? 'is-active' : ''}`}>
                <span>My Requests</span>
                {requestCount > 0 && (
                  <span className="nav-badge-count">{requestCount}</span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/assess" className="nav-cta">
                Try Now
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
