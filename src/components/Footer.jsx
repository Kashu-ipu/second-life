import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

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
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-col">
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
            <p className="footer-tagline">
              A circular economy initiative empowering people to repair, reuse, resell, and responsibly recycle everyday items.
            </p>
          </div>

          <div className="footer-nav-col">
            <div>
              <h4 className="footer-col-title">Navigation</h4>
              <ul className="footer-col-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/assess">Assess Item</Link></li>
                <li><a href="#how-it-works" onClick={(e) => handleNavAnchor(e, 'how-it-works')}>How It Works</a></li>
                <li><a href="#impact" onClick={(e) => handleNavAnchor(e, 'impact')}>Our Impact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Pathways</h4>
              <ul className="footer-col-links">
                <li><Link to="/assess">1. Reuse & Donate</Link></li>
                <li><Link to="/assess">2. Repair</Link></li>
                <li><Link to="/assess">3. Resell / Upcycle</Link></li>
                <li><Link to="/assess">4. Responsible Recycle</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Second Life. Hackathon Prototype Foundation.</span>
          <span>Designed with sustainability in mind.</span>
        </div>
      </div>
    </footer>
  );
}
