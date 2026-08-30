import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { PRESET_SAMPLES } from '../data/mockData';
import { evaluateItemPathway, PATHWAYS } from '../utils/recommendationEngine';
import NearbyOpportunitiesModal from '../components/NearbyOpportunitiesModal';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showOpportunitiesModal, setShowOpportunitiesModal] = useState(false);

  // Read assessment state or generate deterministic fallback for sample Chair
  const assessment = location.state?.assessment;
  const fallbackAnalysis = evaluateItemPathway({
    item: 'Wooden Chair',
    category: 'Furniture',
    condition: 'Repairable'
  });

  const itemData = assessment?.analysis || fallbackAnalysis;
  const itemImage = assessment?.image || PRESET_SAMPLES[0].image;
  const itemName = assessment?.item || 'Wooden Chair';
  const categoryName = assessment?.category || 'Furniture';
  const conditionName = assessment?.condition || 'Repairable';

  // Standard 4 pathways configuration with dynamic scores & notes from engine
  const pathwayMetadata = [
    {
      id: 'reuse',
      name: PATHWAYS.REUSE,
      number: '01',
      defaultDesc: 'Pass the item to a local charity, community thrift, or neighbor who can use it immediately.'
    },
    {
      id: 'repair',
      name: PATHWAYS.REPAIR,
      number: '02',
      defaultDesc: 'Fix minor structural or cosmetic flaws with simple tools or at a local repair café.'
    },
    {
      id: 'resell',
      name: 'Resell / Upcycle',
      number: '03',
      defaultDesc: 'Monetize on secondhand marketplaces or transform into creative renewed furniture.'
    },
    {
      id: 'recycle',
      name: PATHWAYS.RECYCLE,
      number: '04',
      defaultDesc: 'Separate raw materials (timber, metals) for certified municipal material reclamation.'
    }
  ];

  // Map each pathway to its engine score and explanation
  const circularPathways = pathwayMetadata.map((meta) => {
    const isRecommended =
      (itemData.suggestedPath || '').toLowerCase() === meta.name.toLowerCase() ||
      (meta.name === 'Resell / Upcycle' && (itemData.suggestedPath || '').toLowerCase().includes('resell'));

    const scoreKeyMap = {
      reuse: itemData.scores?.reuseDonate,
      repair: itemData.scores?.repair,
      resell: itemData.scores?.resellUpcycle,
      recycle: itemData.scores?.recycle
    };

    const score = scoreKeyMap[meta.id] ?? (isRecommended ? 85 : 35);
    const rankedInfo = itemData.rankedPathways?.find((p) => p.pathway.toLowerCase().includes(meta.id));
    const customReason = rankedInfo?.reasons?.[0];

    return {
      id: meta.id,
      name: meta.name,
      number: meta.number,
      score,
      description: customReason || meta.defaultDesc,
      viability: rankedInfo?.viability || (isRecommended ? 'Recommended Match' : score >= 50 ? 'Strong Alternative' : 'Secondary Option'),
      isRecommended
    };
  });

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
              <img src={itemImage} alt={itemName} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/second-life-hero.png'; }} />
              <span className="img-badge">Evaluated Item</span>
            </div>

            <div className="result-hero-details">
              <div className="hero-pill" style={{ marginBottom: '12px' }}>
                <span className="hero-pill-dot"></span>
                <span>Deterministic Circular Engine</span>
              </div>

              <h1 className="result-item-title">{itemName}</h1>

              <div className="result-meta-tags">
                <span className="meta-tag">
                  <strong>Category:</strong> {categoryName}
                </span>
                <span className="meta-tag">
                  <strong>Condition:</strong> {conditionName}
                </span>
                {itemData.confidence && (
                  <span className="meta-tag" title={itemData.confidenceReason || 'Score margin calculation'}>
                    <strong>Confidence:</strong> {itemData.confidence}
                  </span>
                )}
                {itemData.carbonSaved && (
                  <span className="meta-tag meta-tag-carbon">
                    <strong>Carbon Impact:</strong> {itemData.carbonSaved}
                  </span>
                )}
              </div>

                {/* Highlighted Recommended Pathway */}
                <div className="recommended-path-banner">
                  <div className="path-banner-tag">
                    Recommended Pathway {itemData.confidence ? ' • ' + itemData.confidence + ' Confidence' : ''}
                  </div>
                  <div className="path-banner-value">{itemData.suggestedPath.toUpperCase()}</div>
                  <p className="path-banner-explanation">
                    {itemData.reason}
                  </p>
                </div>
                {/* Impact Summary Section */}
                {itemData.impact && (
                  <div className="impact-section" style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <h3 className="section-title" style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Environmental Impact</h3>
                    <div className="impact-stats" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div className="impact-stat"><strong>Circularity Score:</strong> {itemData.impact.circularityScore}/100</div>
                      <div className="impact-stat"><strong>Waste Diversion:</strong> {itemData.impact.wasteDiversion}</div>
                      <div className="impact-stat"><strong>Lifecycle Extension:</strong> {itemData.impact.lifecycleExtension}</div>
                    </div>
                    <p style={{ marginTop: '8px', fontStyle: 'italic' }}>{itemData.impact.impactExplanation}</p>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* 4 Circular Pathways Decision System */}
            <div className="pathways-section">
              <div className="section-header" style={{ marginBottom: '28px', textAlign: 'left' }}>
                <span className="section-tag">Pathway Scoring Breakdown</span>
                <h2 className="section-title" style={{ fontSize: '1.6rem' }}>4 Circular Pathways Assessment</h2>
                <p className="section-subtitle">
                  Deterministic 0–100 circular score calculated from item category, condition, and material viability.
                </p>
              </div>
            {circularPathways.map((pathway) => (
              <div
                key={pathway.id}
                className={`pathway-card ${pathway.isRecommended ? 'is-recommended' : ''}`}
              >
                <div className="pathway-card-top">
                  <span className="pathway-step-num">{pathway.number}</span>
                  {pathway.isRecommended ? (
                    <span className="recommended-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Top Match ({pathway.score}/100)
                    </span>
                  ) : (
                    <span className="pathway-score-badge" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Score: {pathway.score}/100
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

        {/* Explainability / Assessment Logic Factors */}
        {itemData.explanation && itemData.explanation.length > 0 && (
          <div className="next-steps-card" style={{ marginBottom: '24px' }}>
            <h3 className="next-steps-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Why This Pathway Was Recommended</span>
            </h3>
            <ul className="next-steps-list">
              {itemData.explanation.map((factor, idx) => (
                <li key={idx} className="next-step-item">
                  <span className="next-step-check">✓</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

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
            onClick={() => setShowOpportunitiesModal(true)}
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

        {/* Location-Aware Nearby Opportunities & Connect Modal */}
        {showOpportunitiesModal && (
          <NearbyOpportunitiesModal
            itemDetails={{
              item: itemName,
              category: categoryName,
              condition: conditionName,
              suggestedPath: itemData.suggestedPath
            }}
            onClose={() => setShowOpportunitiesModal(false)}
          />
        )}
      </div>
    </div>
  );
}
