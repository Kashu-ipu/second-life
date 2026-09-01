import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NearbyOpportunitiesModal from '../components/NearbyOpportunitiesModal';

export default function OpportunitiesPage() {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('second_life_latest_assessment');
      if (saved) {
        setAssessment(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to read saved assessment', e);
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;

  if (!assessment) {
    return (
      <div className="page-opportunities" style={{ padding: '60px 0', minHeight: '65vh' }}>
        <div className="container">
          <div className="requests-empty-state" style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
            <div className="empty-state-icon">🔍</div>
            <div className="hero-pill" style={{ marginBottom: '12px', display: 'inline-flex' }}>
              <span className="hero-pill-dot"></span>
              <span>Circular Network</span>
            </div>
            <h2>Discover Local Circular Opportunities</h2>
            <p style={{ marginTop: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Second Life matches unwanted items with verified local repair cafes, donation centers, material recyclers, and resale boutiques based on specific material and condition viability.
            </p>
            <p style={{ marginTop: '10px', fontWeight: 600, color: 'var(--primary-dark, #1B4332)' }}>
              Assess an item first to generate customized opportunity compatibility scores and recommendations.
            </p>
            <div style={{ marginTop: '28px', display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => navigate('/assess')}
                className="btn-primary-action"
              >
                Assess an Item Now →
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-opportunities">
      <NearbyOpportunitiesModal
        itemDetails={{
          item: assessment.item || 'Assessed Item',
          category: assessment.category || 'Other',
          condition: assessment.condition || 'Repairable',
          suggestedPath: assessment.analysis?.suggestedPath || assessment.suggestedPath || 'Repair'
        }}
        onClose={() => navigate('/result', { state: { assessment } })}
      />
    </div>
  );
}
