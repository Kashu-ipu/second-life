import React, { useState } from 'react';
import { PROTOTYPE_OPPORTUNITIES } from '../data/mockData';
import ConnectModal from './ConnectModal';

export default function NearbyOpportunitiesModal({ itemDetails, onClose }) {
  const [step, setStep] = useState('location'); // 'location' | 'results'
  const [userLocation, setUserLocation] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [selectedPartnerForConnect, setSelectedPartnerForConnect] = useState(null);

  // Normalize pathway name for matching
  const getNormalizedPathway = (suggestedPath = '') => {
    const s = suggestedPath.toLowerCase();
    if (s.includes('repair')) return 'Repair';
    if (s.includes('donate') || s.includes('reuse')) return 'Reuse / Donate';
    if (s.includes('resell') || s.includes('upcycle')) return 'Resell / Upcycle';
    if (s.includes('recycle')) return 'Responsible Recycle';
    return 'Repair';
  };

  const currentPathway = getNormalizedPathway(itemDetails.suggestedPath);
  const itemCategory = itemDetails.category || 'Furniture';

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

  // Filter dynamic opportunities based on pathway, category, and city
  const filterOpportunities = () => {
    const normalizedInputCity = userLocation.toLowerCase();

    // 1. Direct pathway & category matches
    let matches = PROTOTYPE_OPPORTUNITIES.filter((opp) => {
      const pathwayMatch = opp.pathway.toLowerCase() === currentPathway.toLowerCase();
      const categoryMatch = opp.supportedCategories.some(
        (cat) => cat.toLowerCase() === itemCategory.toLowerCase() || cat.toLowerCase() === 'other'
      );
      return pathwayMatch && categoryMatch;
    });

    // 2. If user specified a known city (e.g. Mumbai, Bengaluru, Delhi), prioritize or filter by city
    if (normalizedInputCity.includes('mumbai')) {
      const cityMatches = matches.filter((opp) => opp.city.toLowerCase() === 'mumbai');
      if (cityMatches.length > 0) matches = cityMatches;
    } else if (normalizedInputCity.includes('bengaluru') || normalizedInputCity.includes('bangalore')) {
      const cityMatches = matches.filter((opp) => opp.city.toLowerCase() === 'bengaluru');
      if (cityMatches.length > 0) matches = cityMatches;
    } else if (normalizedInputCity.includes('delhi') || normalizedInputCity.includes('ncr') || normalizedInputCity.includes('current')) {
      const cityMatches = matches.filter((opp) => opp.city.toLowerCase() === 'delhi');
      if (cityMatches.length > 0) matches = cityMatches;
    }

    // Fallback: If strict category matching yielded fewer than 2 results, broaden to all pathway partners
    if (matches.length === 0) {
      matches = PROTOTYPE_OPPORTUNITIES.filter(
        (opp) => opp.pathway.toLowerCase() === currentPathway.toLowerCase()
      );
    }

    return matches;
  };

  const filteredResults = filterOpportunities();

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card opportunities-modal-card" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header">
            <div className="modal-title-group">
              <h3>
                {step === 'location' ? 'Find Circular Opportunities Near You' : 'Relevant Circular Opportunities'}
              </h3>
              <p>
                {step === 'location'
                  ? 'Use your location to discover relevant repair, donation, resale, or recycling options.'
                  : `Showing prototype matches for ${currentPathway} in ${userLocation || 'your area'}`}
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
                <span className="prototype-badge">Prototype Notice</span>
                <p>
                  For Day 1, no external maps or geocoding APIs are loaded. Prototype opportunities are matched using local demo partner listings.
                </p>
              </div>
            </div>
          ) : (
            /* STEP 2: Dynamic Filtered Opportunities List */
            <div className="modal-body-padding">
              {/* Location Context Bar */}
              <div className="opportunity-context-bar">
                <div className="context-info">
                  <span className="context-label">Location:</span>
                  <strong className="context-val">{userLocation}</strong>
                  <span className="context-sep">•</span>
                  <span className="context-label">Recommended Path:</span>
                  <span className="context-badge">{currentPathway}</span>
                  <span className="context-sep">•</span>
                  <span className="context-val" style={{ color: 'var(--text-muted)' }}>
                    {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'} found
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
              {filteredResults.length > 0 ? (
                <div className="opportunity-cards-list">
                  {filteredResults.map((opp) => (
                    <div key={opp.id} className="opportunity-card-item">
                      <div className="opp-header">
                        <div className="opp-title-area">
                          <h4 className="opp-name">{opp.name}</h4>
                          <span className="opp-badge">{opp.badge}</span>
                        </div>
                        <span className="opp-distance">{opp.sampleDistance} approx.</span>
                      </div>

                      <p className="opp-desc">{opp.description}</p>

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
                        <span className="opp-tag-label">Accepts:</span>
                        {opp.supportedCategories.map((cat, idx) => (
                          <span key={idx} className="category-pill-tag">
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
                  <h4>No specific {currentPathway} partners found in {userLocation}</h4>
                  <p>
                    We currently do not have localized prototype partners for this item category in this area. You can try selecting another city or explore other circular pathways.
                  </p>
                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setUserLocation('Delhi NCR');
                        setStep('results');
                      }}
                      className="btn-secondary"
                    >
                      View Delhi Partners
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
                <span className="prototype-badge">Prototype Listing</span>
                <p>
                  Distances shown are illustrative demo estimates. Prototype listings do not represent real-time booking integrations.
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
