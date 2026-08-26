import React from 'react';

export default function ImpactTeaser() {
  return (
    <section id="impact" className="impact-section">
      <div className="container">
        <div className="impact-banner">
          <div className="impact-text">
            <h2>Closing the Loop on Household Waste</h2>
            <p>
              Millions of functional items end up in landfills every year simply because owners lack actionable repair or donation pathways. Second Life bridges the gap between unwanted goods and circular regeneration.
            </p>
          </div>

          <div className="impact-stats-grid">
            <div className="stat-box">
              <div className="stat-number">84%</div>
              <div className="stat-label">of discarded furniture & goods can be easily repaired or repurposed</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">4 Pathways</div>
              <div className="stat-label">Reuse, Repair, Resell, or Responsibly Recycle tailored to every item</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
