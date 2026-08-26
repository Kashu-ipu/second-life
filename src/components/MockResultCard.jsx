import React from 'react';

export default function MockResultCard({ result, onReset }) {
  if (!result) return null;

  return (
    <div className="result-card-wrap">
      <div className="result-card">
        {/* Result Header */}
        <div className="result-header">
          <div className="result-title-group">
            <h3>Circular Analysis Result</h3>
          </div>
          <div className="result-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span>Evaluation Complete</span>
          </div>
        </div>

        {/* Result Content */}
        <div className="result-body">
          {/* Primary Suggested Path Box */}
          <div className="result-primary-path">
            <div className="path-label">Recommended Next Life</div>
            <div className="path-value">{result.suggestedPath}</div>
          </div>

          <div className="result-detail-grid">
            <div className="result-detail-item">
              <span className="result-detail-title">Identified Item</span>
              <span className="result-detail-text" style={{ fontWeight: 600, color: 'var(--forest-dark)' }}>
                {result.item}
              </span>
            </div>

            <div className="result-detail-item">
              <span className="result-detail-title">Assessment Reason</span>
              <p className="result-detail-text">{result.reason}</p>
            </div>

            {result.condition && (
              <div className="result-detail-item">
                <span className="result-detail-title">Condition & Materials</span>
                <p className="result-detail-text">
                  {result.condition} • {result.material} • <strong style={{ color: 'var(--forest-primary)' }}>Est. {result.carbonSaved} diverted</strong>
                </p>
              </div>
            )}
          </div>

          {/* 4 Circular Pathways Matrix */}
          {result.pathwayMatrix && (
            <div className="pathway-matrix">
              <div className="matrix-title">Circular Pathways Overview</div>
              <div className="matrix-grid">
                {result.pathwayMatrix.map((matrixItem, index) => (
                  <div 
                    key={index} 
                    className={`matrix-item ${matrixItem.isRecommended ? 'is-recommended' : ''}`}
                  >
                    <div className="matrix-item-name">{matrixItem.path}</div>
                    <div className="matrix-item-status">{matrixItem.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="result-actions">
            <button onClick={onReset} className="btn-secondary">
              Upload Another Item
            </button>
            <button 
              onClick={() => alert(`Connecting to local ${result.suggestedPath} partners... (Prototype Mock)`)} 
              className="btn-primary-action"
            >
              Take Action on This Item →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
