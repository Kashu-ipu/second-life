import React, { useState } from 'react';
import { rankMatchedOpportunities, normalizePathway } from '../utils/opportunityMatchingEngine';
import ConnectModal from './ConnectModal';

export default function NearbyOpportunitiesModal({ itemDetails, onClose }) {
  const [step, setStep] = useState('location'); // 'location' | 'results'
  const [userLocation, setUserLocation] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [selectedPartnerForConnect, setSelectedPartnerForConnect] = useState(null);

  const currentPathway = normalizePathway(itemDetails.suggestedPath);
  const itemCategory = itemDetails.category || 'Household Item';
  const itemCondition = itemDetails.condition || 'Repairable';

  // Geolocation Handler
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setGeoError('');

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser. Please enter your city or PIN code manually.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setUserLocation('Current Device Location (Delhi NCR Region)');
        setStep('results');
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Location permission was denied. Please enter your city or PIN code below.';
        if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Please enter your city manually.';
        }
        setGeoError(errorMsg);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  // Manual Location Submission
  const handleManualLocationSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setUserLocation(manualInput.trim());
    setStep('results');
  };

  // Rank opportunities dynamically using Day 4 Matching Engine
  const matchedResults = rankMatchedOpportunities({
    item: itemDetails.item,
    category: itemCategory,
    condition: itemCondition,
    suggestedPath: itemDetails.suggestedPath,
    userLocation
  });

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card opportunities-modal-card" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header">
            <div className="modal-title-group">
              <h3>
                {step === 'location' ? 'Find Circular Opportunities Near You' : 'Intelligent Opportunity Matches'}
              </h3>
              <p>
                {step === 'location'
                  ? 'Use your location to discover and rank compatible repair, donation, resale, or recycling partners.'
                  : `Ranked by compatibility for ${itemDetails.item || 'your item'} (${currentPathway}) in ${userLocation || 'your area'}`}
              </p>
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>

          {/* STEP 1: Location Selection */}
          {step === 'location' ? (
            <div className="modal-body-padding">
              <div className="location-options-wrap">
                {/* Option 1: Browser Geolocation */}
                <div className="location-method-box">
                  <div className="method-header">
                    <div className="method-icon-circle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="method-title">Use My Current Location</h4>
                      <p className="method-desc">Automatically request browser permission to detect your area</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="btn-location-action"
                  >
                    {isLocating ? (
                      <>
                        <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                        <span>Detecting Location...</span>
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <circle cx="12" cy="12" r="10" />
                          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                        </svg>
                        <span>Use Current Location</span>
                      </>
                    )}
                  </button>

                  {geoError && (
                    <div className="location-error-banner">
                      <span>⚠️ {geoError}</span>
                    </div>
                  )}
                </div>

                <div className="form-section-divider" style={{ margin: '20px 0' }}>
                  <span>OR ENTER MANUALLY</span>
                </div>

                {/* Option 2: Manual City / PIN Input */}
                <form onSubmit={handleManualLocationSubmit} className="manual-location-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="manualLocation">
                      City, Town, or PIN / Postal Code
                    </label>
                    <div className="location-input-group">
                      <input
                        id="manualLocation"
                        type="text"
                        className="form-input"
                        placeholder="e.g. Delhi, Mumbai, Bengaluru, 110001"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        required
                      />
                      <button type="submit" className="btn-primary-action" style={{ whiteSpace: 'nowrap' }}>
                        Find Options →
                      </button>
                    </div>
                  </div>

                  {/* Quick City Presets */}
                  <div className="quick-city-presets">
                    <span className="preset-label">Quick select:</span>
                    {['Delhi NCR', 'Mumbai', 'Bengaluru'].map((city) => (
                      <button
                        key={city}
                        type="button"
                        className="sample-pill"
                        onClick={() => {
                          setUserLocation(city);
                          setStep('results');
                        }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </form>
              </div>

              <div className="prototype-note-banner">
                <span className="prototype-badge">Transparent Matching</span>
                <p>
                  Opportunities are dynamically scored based on recommended pathway, item category compatibility, condition viability, location proximity, and partner availability.
                </p>
              </div>
            </div>
          ) : (
            /* STEP 2: Dynamically Ranked Opportunities List */
            <div className="modal-body-padding">
              {/* Location Context Bar */}
              <div className="opportunity-context-bar">
                <div className="context-info">
                  <span className="context-label">Location:</span>
                  <strong className="context-val">{userLocation || 'Selected Area'}</strong>
                  <span className="context-sep">•</span>
                  <span className="context-label">Pathway:</span>
                  <span className="context-badge">{currentPathway}</span>
                  <span className="context-sep">•</span>
                  <span className="context-label">Item:</span>
                  <span className="context-val">{itemDetails.item} ({itemCategory})</span>
                  <span className="context-sep">•</span>
                  <span className="context-val" style={{ color: 'var(--text-muted)' }}>
                    {matchedResults.length} {matchedResults.length === 1 ? 'match' : 'ranked matches'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('location')}
                  className="btn-change-location"
                >
                  Change Location
                </button>
              </div>

              {/* Opportunities List */}
              {matchedResults.length > 0 ? (
                <div className="opportunity-cards-list">
                  {matchedResults.map((opp, index) => (
                    <div
                      key={opp.id}
                      className={`opportunity-card-item ${opp.isTopMatch || index === 0 ? 'is-top-opportunity' : ''}`}
                    >
                      <div className="opp-header">
                        <div className="opp-title-area">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <h4 className="opp-name">{opp.name}</h4>
                            <span className="opp-badge">{opp.badge || opp.serviceType}</span>
                          </div>
                          <span className="opp-service-type" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {opp.serviceType} • {opp.pathway}
                          </span>
                        </div>

                        {/* Match Score Indicator */}
                        <div className="opp-score-badge-wrap" style={{ textAlign: 'right' }}>
                          <div
                            className={`opp-match-score-pill ${
                              opp.matchScore >= 80 ? 'is-high-match' : opp.matchScore >= 60 ? 'is-med-match' : 'is-low-match'
                            }`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              background: opp.matchScore >= 80 ? 'rgba(45, 106, 79, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                              color: opp.matchScore >= 80 ? 'var(--primary-dark, #1B4332)' : '#B45309'
                            }}
                          >
                            <span>★ {opp.matchScore}% Match</span>
                            <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>({opp.matchBadge})</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {opp.sampleDistance} approx.
                          </div>
                        </div>
                      </div>

                      <p className="opp-desc">{opp.description}</p>

                      {/* Explainability Bullets: Why this is a good match */}
                      {opp.matchExplanation && opp.matchExplanation.length > 0 && (
                        <div
                          className="opp-explanation-box"
                          style={{
                            background: 'var(--bg-secondary, #F3EFE6)',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            margin: '10px 0',
                            fontSize: '0.82rem'
                          }}
                        >
                          <div style={{ fontWeight: 600, color: 'var(--text-main, #1C1917)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>Matching Factors:</span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
                            {opp.matchExplanation.map((reason, idx) => (
                              <span key={idx} style={{ color: 'var(--primary-dark, #1B4332)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ color: '#2D6A4F', fontWeight: 700 }}>✓</span> {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="opp-meta-row">
                        <div className="opp-address">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{opp.address}</span>
                        </div>
                        <div className="opp-availability">
                          <span>🟢 {opp.availability}</span>
                        </div>
                      </div>

                      <div className="opp-tags-row">
                        <span className="opp-tag-label">Accepts Categories:</span>
                        {opp.supportedCategories.map((cat, idx) => (
                          <span
                            key={idx}
                            className={`category-pill-tag ${
                              cat.toLowerCase() === itemCategory.toLowerCase() ? 'is-target-category' : ''
                            }`}
                            style={{
                              fontWeight: cat.toLowerCase() === itemCategory.toLowerCase() ? 700 : 400,
                              borderColor: cat.toLowerCase() === itemCategory.toLowerCase() ? 'var(--primary-light, #2D6A4F)' : undefined
                            }}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      <div className="opp-action-row">
                        <button
                          type="button"
                          onClick={() => setSelectedPartnerForConnect(opp)}
                          className="btn-connect-action"
                        >
                          <span>Connect & Act</span>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="opportunity-empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <h4>No strong matches found for your item and selected area</h4>
                  <p>
                    We currently do not have localized prototype partners for {itemCategory} ({currentPathway}) in {userLocation}. You can try selecting another city or explore other circular pathways.
                  </p>
                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setUserLocation('Delhi NCR');
                        setStep('results');
                      }}
                      className="btn-secondary"
                    >
                      View Delhi NCR Matches
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('location')}
                      className="btn-primary-action"
                    >
                      Change Location
                    </button>
                  </div>
                </div>
              )}

              <div className="prototype-note-banner" style={{ marginTop: '20px' }}>
                <span className="prototype-badge">Deterministic Matching Algorithm</span>
                <p>
                  Match score weights: Recommended Pathway (40 pts) + Category Support (25 pts) + Condition Compatibility (15 pts) + Area Proximity (10 pts) + Availability (10 pts).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Connect Modal when an opportunity is clicked */}
      {selectedPartnerForConnect && (
        <ConnectModal
          partner={selectedPartnerForConnect}
          itemDetails={itemDetails}
          onClose={() => setSelectedPartnerForConnect(null)}
        />
      )}
    </>
  );
}
