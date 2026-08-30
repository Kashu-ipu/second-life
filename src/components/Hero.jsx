import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-copy">
          <div className="hero-pill">
          <span className="hero-pill-dot"></span>
          <span>Circular Economy Platform</span>
        </div>

        <h1 className="hero-title">
          Every Item Deserves a <span className="hero-title-highlight">Second Life.</span>
        </h1>

        <p className="hero-subtitle">
          Upload an item and discover whether it can be reused, repaired, resold or responsibly recycled.
        </p>

          <div className="hero-actions">
          <button onClick={() => navigate('/assess')} className="hero-cta-btn">
            <span>Give Your Item a Second Life</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
          <button onClick={() => navigate('/opportunities')} className="hero-secondary-btn">
            Explore Opportunities
          </button>
          </div>
        </div>

        <div className="hero-artwork">
          <div className="hero-artwork-note">A better next step for every item</div>
          <img src="/second-life-hero.png" alt="People giving a household item a second life" />
          <div className="hero-artwork-caption"><span className="hero-caption-leaf">↗</span> Keep useful things in motion</div>
        </div>

        <div className="hero-pathways-strip">
          <div className="hero-pathway-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <span>1. Reuse / Donate</span>
          </div>

          <div className="hero-pathway-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span>2. Repair</span>
          </div>

          <div className="hero-pathway-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 18V6" />
            </svg>
            <span>3. Resell</span>
          </div>

          <div className="hero-pathway-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
              <path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0 0-1.8L17.5 10" />
              <path d="m14 2 2.8 5.6" />
              <path d="M6.2 8.7 8.5 4" />
            </svg>
            <span>4. Recycle</span>
          </div>
        </div>
      </div>
    </section>
  );
}
