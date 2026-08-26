import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('second_life_requests') || '[]');
      setRequests(stored);
    } catch (e) {
      console.error('Failed to load requests from localStorage', e);
      setRequests([]);
    }
  }, []);

  const handleClearRequests = () => {
    if (window.confirm('Are you sure you want to clear your local prototype requests?')) {
      localStorage.removeItem('second_life_requests');
      setRequests([]);
    }
  };

  const handleDeleteSingle = (id) => {
    const updated = requests.filter((r) => r.id !== id);
    setRequests(updated);
    localStorage.setItem('second_life_requests', JSON.stringify(updated));
  };

  return (
    <div className="page-requests">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="result-breadcrumb">
          <Link to="/" className="breadcrumb-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Back to Home</span>
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">My Requests</span>
        </div>

        {/* Page Header */}
        <div className="requests-header-row">
          <div>
            <div className="hero-pill" style={{ marginBottom: '8px' }}>
              <span className="hero-pill-dot"></span>
              <span>Connect & Act Layer</span>
            </div>
            <h1 className="requests-page-title">My Circular Requests</h1>
            <p className="requests-page-subtitle">
              Locally logged inquiries and partner connection requests from your current prototype session.
            </p>
          </div>

          {requests.length > 0 && (
            <button
              type="button"
              onClick={handleClearRequests}
              className="btn-clear-requests"
              title="Clear all session requests"
            >
              Clear Log
            </button>
          )}
        </div>

        {/* Requests List */}
        {requests.length > 0 ? (
          <div className="requests-grid">
            {requests.map((req) => (
              <div key={req.id} className="request-card">
                <div className="request-card-header">
                  <div className="request-partner-info">
                    <span className="request-partner-badge">{req.partnerBadge || 'Partner'}</span>
                    <h3 className="request-partner-name">{req.partnerName}</h3>
                    <span className="request-partner-address">{req.partnerAddress}</span>
                  </div>

                  <div className="request-status-pill">
                    <span className="status-dot"></span>
                    <span>{req.status}</span>
                  </div>
                </div>

                <div className="request-details-grid">
                  <div className="request-detail-col">
                    <span className="detail-label">Item</span>
                    <strong className="detail-value">{req.item}</strong>
                  </div>

                  <div className="request-detail-col">
                    <span className="detail-label">Condition</span>
                    <span className="detail-value">{req.condition}</span>
                  </div>

                  <div className="request-detail-col">
                    <span className="detail-label">Pathway</span>
                    <span className="detail-badge">{req.pathway}</span>
                  </div>

                  <div className="request-detail-col">
                    <span className="detail-label">Date & Time</span>
                    <span className="detail-value" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {req.timestamp}
                    </span>
                  </div>
                </div>

                {req.message && (
                  <div className="request-message-box">
                    <span className="message-box-label">Inquiry Message:</span>
                    <p className="message-box-text">"{req.message}"</p>
                  </div>
                )}

                <div className="request-card-footer">
                  <span className="prototype-footnote">
                    🔒 Prototype Log (Stored in browser localStorage)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSingle(req.id)}
                    className="btn-delete-request"
                    title="Remove this request"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="requests-empty-state">
            <div className="empty-state-icon">📬</div>
            <h3>No Requests Sent Yet</h3>
            <p>
              When you assess an item and click "Connect & Act" with a nearby repair lab, donation hub, or recycler, your connection inquiries will appear here.
            </p>
            <div style={{ marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => navigate('/assess')}
                className="btn-primary-action"
              >
                Assess an Item Now →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
