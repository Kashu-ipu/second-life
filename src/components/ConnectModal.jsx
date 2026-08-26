import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConnectModal({ partner, itemDetails, onClose }) {
  const navigate = useNavigate();
  const [isSent, setIsSent] = useState(false);

  const initialMessage = `Hi, I have a ${itemDetails.item} in ${itemDetails.condition} condition. Second Life recommended your organization/service as a relevant option. I would like to know if you currently accept or support this type of item.`;

  const [message, setMessage] = useState(initialMessage);

  const handleSendRequest = (e) => {
    e.preventDefault();

    const newRequest = {
      id: 'req_' + Date.now(),
      partnerName: partner.name,
      partnerBadge: partner.badge || 'Circular Partner',
      partnerAddress: partner.address || partner.city,
      item: itemDetails.item,
      category: itemDetails.category || 'Household Item',
      condition: itemDetails.condition,
      pathway: itemDetails.suggestedPath || partner.pathway,
      message: message.trim(),
      status: 'Pending',
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };

    try {
      const existing = JSON.parse(localStorage.getItem('second_life_requests') || '[]');
      const updated = [newRequest, ...existing];
      localStorage.setItem('second_life_requests', JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving request to localStorage:', err);
    }

    setIsSent(true);
  };

  const handleViewRequests = () => {
    onClose();
    navigate('/requests');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card connect-modal-card" onClick={(e) => e.stopPropagation()}>
        {!isSent ? (
          <div>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>Connect with Partner</h3>
                <p>Inquire about supporting or dropping off your item</p>
              </div>
              <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="connect-modal-body">
              {/* Partner & Item Summary Strip */}
              <div className="connect-summary-strip">
                <div className="connect-summary-col">
                  <span className="connect-summary-label">Partner Organization</span>
                  <strong className="connect-summary-value">{partner.name}</strong>
                  <span className="connect-summary-sub">{partner.badge} • {partner.city}</span>
                </div>

                <div className="connect-summary-col">
                  <span className="connect-summary-label">Your Item</span>
                  <strong className="connect-summary-value">{itemDetails.item}</strong>
                  <span className="connect-summary-sub">
                    Condition: <strong>{itemDetails.condition}</strong> • Pathway: <strong>{itemDetails.suggestedPath}</strong>
                  </span>
                </div>
              </div>

              {/* Message Input */}
              <div className="form-group" style={{ marginTop: '20px' }}>
                <label className="form-label" htmlFor="connectMessage">
                  Inquiry Message (Editable)
                </label>
                <textarea
                  id="connectMessage"
                  className="form-textarea"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <span className="form-help-text">
                  You can personalize your message before sending your inquiry.
                </span>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action">
                  <span>Send Request</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="connect-success-view">
            <div className="success-icon-wrap">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h3 className="success-title">Request Sent</h3>

            <p className="success-description">
              Your inquiry to <strong>{partner.name}</strong> regarding your <strong>{itemDetails.item}</strong> has been logged in your local prototype session.
            </p>

            <div className="prototype-disclaimer-box">
              <span className="prototype-badge">Prototype Interaction</span>
              <p>
                In the production platform, this will notify the partner via their circular hub dashboard or email. For today's demo, your inquiry is safely recorded in your local requests log.
              </p>
            </div>

            <div className="success-actions">
              <button type="button" onClick={handleViewRequests} className="btn-primary-action">
                View My Requests →
              </button>
              <button type="button" onClick={onClose} className="btn-secondary">
                Back to Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
