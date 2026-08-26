import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { DEFAULT_MOCK_RESULT, PRESET_SAMPLES } from '../data/mockData';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNearbyModal, setShowNearbyModal] = useState(false);

  // Read assessment state or fallback to default sample (Wooden Chair)
  const assessment = location.state?.assessment;
  const itemData = assessment?.analysis || DEFAULT_MOCK_RESULT;
  const itemImage = assessment?.image || PRESET_SAMPLES[0].image;
  const itemName = assessment?.item || DEFAULT_MOCK_RESULT.item;
  const categoryName = assessment?.category || 'Furniture';
  const conditionName = assessment?.condition || DEFAULT_MOCK_RESULT.condition;

  // 4 Standardized Circular Pathways
  const circularPathways = [
    {
      id: 'reuse',
      name: 'Reuse / Donate',
      number: '01',
      description: 'Pass the item to a local charity, community thrift, or neighbor who can use it immediately.',
      viability: 'Viable Option',
      isRecommended: itemData.suggestedPath.toLowerCase().includes('donate') || itemData.suggestedPath.toLowerCase().includes('reuse') && !itemData.suggestedPath.toLowerCase().includes('repair')
    },
    {
      id: 'repair',
      name: 'Repair',
      number: '02',
      description: 'Fix minor structural or cosmetic flaws with simple tools or at a local repair café.',
      viability: 'Recommended Match',
      isRecommended: itemData.suggestedPath.toLowerCase().includes('repair')
    },
    {
      id: 'resell',
      name: 'Resell / Upcycle',
      number: '03',
      description: 'Monetize on secondhand marketplaces or transform into creative renewed furniture.',
      viability: 'Secondary Option',
      isRecommended: itemData.suggestedPath.toLowerCase().includes('resell') || itemData.suggestedPath.toLowerCase().includes('upcycle')
    },
    {
      id: 'recycle',
      name: 'Responsible Recycle',
      number: '04',
      description: 'Separate raw materials (timber, metals) for certified municipal material reclamation.',
      viability: 'Alternative',
      isRecommended: itemData.suggestedPath.toLowerCase().includes('recycle')
    }
  ];

  return (
    <div className="page-result">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="result-breadcrumb">
          <Link to="/assess" className="breadcrumb-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Back to Assessment</span>
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Analysis Report</span>
        </div>

        {/* Top Summary Card */}
        <div className="result-hero-card">
          <div className="result-hero-grid">
            <div className="result-hero-img-wrap">
              <img src={itemImage} alt={itemName} />
              <span className="img-badge">Verified Analysis</span>
            </div>

            <div className="result-hero-details">
              <div className="hero-pill" style={{ marginBottom: '12px' }}>
                <span className="hero-pill-dot"></span>
                <span>Assessment Intelligence</span>
              </div>

              <h1 className="result-item-title">{itemName}</h1>

              <div className="result-meta-tags">
                <span className="meta-tag">
                  <strong>Category:</strong> {categoryName}
                </span>
                <span className="meta-tag">
                  <strong>Condition:</strong> {conditionName}
                </span>
                {itemData.carbonSaved && (
                  <span className="meta-tag meta-tag-carbon">
                    <strong>Carbon Impact:</strong> {itemData.carbonSaved}
                  </span>
                )}
              </div>

              {/* Highlighted Recommended Pathway */}
              <div className="recommended-path-banner">
                <div className="path-banner-tag">Recommended Pathway</div>
                <div className="path-banner-value">{itemData.suggestedPath.toUpperCase()}</div>
                <p className="path-banner-explanation">
                  Based on the item’s condition and potential usability, repairing this item can extend its lifecycle and prevent unnecessary waste.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Circular Pathways Decision System */}
        <div className="pathways-section">
          <div className="section-header" style={{ marginBottom: '28px', textAlign: 'left' }}>
            <span className="section-tag">Evaluation Breakdown</span>
            <h2 className="section-title" style={{ fontSize: '1.6rem' }}>4 Circular Pathways Assessment</h2>
            <p className="section-subtitle">
              Comprehensive evaluation of every circular route available for this item.
            </p>
          </div>

          <div className="pathways-grid">
            {circularPathways.map((pathway) => (
              <div 
                key={pathway.id} 
                className={`pathway-card ${pathway.isRecommended ? 'is-recommended' : ''}`}
              >
                <div className="pathway-card-top">
                  <span className="pathway-step-num">{pathway.number}</span>
                  {pathway.isRecommended && (
                    <span className="recommended-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Best Match
                    </span>
                  )}
                </div>

                <h3 className="pathway-card-title">{pathway.name}</h3>
                <p className="pathway-card-desc">{pathway.description}</p>

                <div className="pathway-card-footer">
                  <span className={`viability-status ${pathway.isRecommended ? 'is-high' : ''}`}>
                    {pathway.viability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Next Steps */}
        {itemData.nextSteps && (
          <div className="next-steps-card">
            <h3 className="next-steps-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
              <span>Suggested Next Steps to Complete This Life</span>
            </h3>
            <ul className="next-steps-list">
              {itemData.nextSteps.map((step, idx) => (
                <li key={idx} className="next-step-item">
                  <span className="next-step-check">✓</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="result-bottom-cta-wrap">
          <button 
            type="button" 
            onClick={() => setShowNearbyModal(true)} 
            className="btn-find-nearby"
          >
            <span>Find Nearby Options</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>

          <button 
            type="button" 
            onClick={() => navigate('/assess')} 
            className="btn-assess-another"
          >
            Assess Another Item
          </button>
        </div>

        {/* Nearby Options Modal Preview */}
        {showNearbyModal && (
          <div className="modal-backdrop" onClick={() => setShowNearbyModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-group">
                  <h3>Nearby Circular Opportunities</h3>
                  <p>Matching partners for <strong>{itemData.suggestedPath}</strong></p>
                </div>
                <button 
                  type="button" 
                  className="modal-close-btn" 
                  onClick={() => setShowNearbyModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="nearby-list">
                <div className="nearby-item">
                  <div className="nearby-icon">🛠️</div>
                  <div className="nearby-details">
                    <div className="nearby-name">Community Repair Café & Woodshop</div>
                    <div className="nearby-address">45 Green Street • 1.2 miles away</div>
                    <div className="nearby-hours">Open Sat 10am - 3pm • Free DIY tooling assistance</div>
                  </div>
                  <span className="nearby-badge">Repair Partner</span>
                </div>

                <div className="nearby-item">
                  <div className="nearby-icon">📦</div>
                  <div className="nearby-details">
                    <div className="nearby-name">EcoHome Community Donation Center</div>
                    <div className="nearby-address">128 Market Ave • 2.4 miles away</div>
                    <div className="nearby-hours">Drop-off hours: Mon-Fri 9am - 5pm</div>
                  </div>
                  <span className="nearby-badge">Donation Hub</span>
                </div>

                <div className="nearby-item">
                  <div className="nearby-icon">♻️</div>
                  <div className="nearby-details">
                    <div className="nearby-name">City Circular Material Recovery</div>
                    <div className="nearby-address">800 Harbor Blvd • 4.1 miles away</div>
                    <div className="nearby-hours">Wood & metal recycling drop-off</div>
                  </div>
                  <span className="nearby-badge">Material Reclamation</span>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-primary-action" 
                  style={{ width: '100%' }}
                  onClick={() => setShowNearbyModal(false)}
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
