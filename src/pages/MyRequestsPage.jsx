import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const getNextActionsForPathway = (pathway = '') => {
  const p = pathway.toLowerCase();
  if (p.includes('reuse') || p.includes('donate')) {
    return [
      { id: 'schedule_dropoff', label: 'Schedule Drop-off' },
      { id: 'view_contact', label: 'View Contact Details' }
    ];
  }
  if (p.includes('repair')) {
    return [
      { id: 'request_pickup', label: 'Request Pickup' },
      { id: 'schedule_dropoff', label: 'Schedule Drop-off' },
      { id: 'view_contact', label: 'View Contact Details' }
    ];
  }
  if (p.includes('resell') || p.includes('upcycle')) {
    return [
      { id: 'view_contact', label: 'View Contact Details' },
      { id: 'arrange_handover', label: 'Arrange Item Handover' }
    ];
  }
  if (p.includes('recycle')) {
    return [
      { id: 'schedule_dropoff', label: 'Schedule Drop-off' },
      { id: 'request_pickup', label: 'Request Pickup' }
    ];
  }
  return [
    { id: 'view_contact', label: 'View Contact Details' },
    { id: 'schedule_dropoff', label: 'Schedule Drop-off' }
  ];
};

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [activeActionState, setActiveActionState] = useState({});
  const [formInputs, setFormInputs] = useState({});

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('second_life_requests') || '[]');
      const sanitized = stored.map((req) => ({
        ...req,
        status: req.status || 'Pending',
        pathway: req.pathway || 'Other',
        selectedNextAction: req.selectedNextAction || null
      }));
      setRequests(sanitized);
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

  const handleCancelRequest = (id) => {
    const updated = requests.map((r) => {
      if (r.id === id) {
        return { ...r, status: 'Cancelled' };
      }
      return r;
    });
    setRequests(updated);
    localStorage.setItem('second_life_requests', JSON.stringify(updated));
  };

  const handleSimulateAccept = (id) => {
    const updated = requests.map((r) => {
      if (r.id === id) {
        return { ...r, status: 'Accepted' };
      }
      return r;
    });
    setRequests(updated);
    localStorage.setItem('second_life_requests', JSON.stringify(updated));
  };

  const handleConfirmNextAction = (id, actionType, label, detail) => {
    const updated = requests.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          selectedNextAction: { actionType, label, detail }
        };
      }
      return r;
    });
    setRequests(updated);
    localStorage.setItem('second_life_requests', JSON.stringify(updated));
    setActiveActionState((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleChangeNextAction = (id) => {
    const updated = requests.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          selectedNextAction: null
        };
      }
      return r;
    });
    setRequests(updated);
    localStorage.setItem('second_life_requests', JSON.stringify(updated));
  };

  const handleSelectActionOption = (reqId, actionId) => {
    setActiveActionState((prev) => ({
      ...prev,
      [reqId]: actionId
    }));
  };

  const handleFormInputChange = (reqId, field, value) => {
    setFormInputs((prev) => ({
      ...prev,
      [reqId]: {
        ...prev[reqId],
        [field]: value
      }
    }));
  };

  const handleCancelForm = (reqId) => {
    setActiveActionState((prev) => {
      const copy = { ...prev };
      delete copy[reqId];
      return copy;
    });
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
              <div key={req.id} className={`request-card ${req.status === 'Cancelled' ? 'is-cancelled' : ''}`}>
                <div className="request-card-header">
                  <div className="request-partner-info">
                    <span className="request-partner-badge">{req.partnerBadge || 'Partner'}</span>
                    <h3 className="request-partner-name">{req.partnerName}</h3>
                    <span className="request-partner-address">{req.partnerAddress}</span>
                  </div>

                  <div className={`request-status-pill status-${(req.status || 'Pending').toLowerCase()}`}>
                    <span className="status-dot"></span>
                    <span>{req.status || 'Pending'}</span>
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

                {/* PART 4 — PARTNER RESPONSE SIMULATION */}
                {req.status === 'Pending' && (
                  <div className="prototype-simulation-box">
                    <span className="prototype-simulation-badge">Prototype Response Simulation</span>
                    <p className="prototype-simulation-text">
                      As this is a frontend-only hackathon prototype, you can simulate how the circular partner would respond.
                    </p>
                    <button
                      type="button"
                      className="btn-simulate-accept"
                      onClick={() => handleSimulateAccept(req.id)}
                    >
                      Simulate Accept Request (Demo)
                    </button>
                  </div>
                )}

                {/* PART 5 — CONTEXTUAL NEXT ACTION */}
                {req.status === 'Accepted' && (
                  <div className="next-action-box">
                    <span className="next-action-badge">Next Action (Prototype)</span>
                    
                    {!req.selectedNextAction ? (
                      <>
                        <p className="next-action-text">
                          This partner accepted your request! Select a prototype demonstration action below to proceed:
                        </p>
                        <div className="next-action-options">
                          {getNextActionsForPathway(req.pathway).map((action) => (
                            <button
                              key={action.id}
                              type="button"
                              className={`btn-next-action ${activeActionState[req.id] === action.id ? 'active' : ''}`}
                              onClick={() => handleSelectActionOption(req.id, action.id)}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                        
                        {/* Inline Interactive Forms based on activeActionState */}
                        {activeActionState[req.id] === 'schedule_dropoff' && (
                          <div className="action-interactive-form">
                            <h4 className="action-form-title">Schedule Drop-off (Demo Selection)</h4>
                            <div className="form-group" style={{ marginBottom: '10px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>
                                Select Date
                              </label>
                              <input
                                type="date"
                                className="form-input"
                                style={{ padding: '6px', fontSize: '0.85rem', width: '100%', border: '1px solid #D5E2D8', borderRadius: '4px' }}
                                value={formInputs[req.id]?.date || ''}
                                onChange={(e) => handleFormInputChange(req.id, 'date', e.target.value)}
                                required
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>
                                Select Time
                              </label>
                              <input
                                type="time"
                                className="form-input"
                                style={{ padding: '6px', fontSize: '0.85rem', width: '100%', border: '1px solid #D5E2D8', borderRadius: '4px' }}
                                value={formInputs[req.id]?.time || ''}
                                onChange={(e) => handleFormInputChange(req.id, 'time', e.target.value)}
                                required
                              />
                            </div>
                            <div className="action-form-row">
                              <button
                                type="button"
                                className="btn-confirm-action"
                                onClick={() => {
                                  const dateVal = formInputs[req.id]?.date;
                                  const timeVal = formInputs[req.id]?.time;
                                  if (!dateVal || !timeVal) {
                                    alert('Please select both a date and time.');
                                    return;
                                  }
                                  const formattedDate = new Date(dateVal).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  });
                                  const detailStr = `Drop-off scheduled for ${formattedDate} at ${timeVal} (Prototype Demo)`;
                                  handleConfirmNextAction(req.id, 'schedule_dropoff', 'Schedule Drop-off', detailStr);
                                }}
                              >
                                Confirm Drop-off (Demo)
                              </button>
                              <button
                                type="button"
                                className="btn-cancel-action"
                                onClick={() => handleCancelForm(req.id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {activeActionState[req.id] === 'request_pickup' && (
                          <div className="action-interactive-form">
                            <h4 className="action-form-title">Request Pickup (Demo Selection)</h4>
                            <div className="form-group" style={{ marginBottom: '10px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>
                                Pickup Address
                              </label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. 123 Circular Way, Delhi"
                                style={{ padding: '6px', fontSize: '0.85rem', width: '100%', border: '1px solid #D5E2D8', borderRadius: '4px' }}
                                value={formInputs[req.id]?.address || ''}
                                onChange={(e) => handleFormInputChange(req.id, 'address', e.target.value)}
                                required
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>
                                Select Date
                              </label>
                              <input
                                type="date"
                                className="form-input"
                                style={{ padding: '6px', fontSize: '0.85rem', width: '100%', border: '1px solid #D5E2D8', borderRadius: '4px' }}
                                value={formInputs[req.id]?.date || ''}
                                onChange={(e) => handleFormInputChange(req.id, 'date', e.target.value)}
                                required
                              />
                            </div>
                            <div className="action-form-row">
                              <button
                                type="button"
                                className="btn-confirm-action"
                                onClick={() => {
                                  const addressVal = formInputs[req.id]?.address;
                                  const dateVal = formInputs[req.id]?.date;
                                  if (!addressVal || !addressVal.trim() || !dateVal) {
                                    alert('Please provide a pickup address and date.');
                                    return;
                                  }
                                  const formattedDate = new Date(dateVal).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  });
                                  const detailStr = `Pickup requested at ${addressVal.trim()} for ${formattedDate} (Prototype Demo)`;
                                  handleConfirmNextAction(req.id, 'request_pickup', 'Request Pickup', detailStr);
                                }}
                              >
                                Confirm Pickup (Demo)
                              </button>
                              <button
                                type="button"
                                className="btn-cancel-action"
                                onClick={() => handleCancelForm(req.id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {activeActionState[req.id] === 'view_contact' && (
                          <div className="action-interactive-form">
                            <h4 className="action-form-title">Contact Details (Demo View)</h4>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.6' }}>
                              <p>📞 <strong>Phone:</strong> +91 98765 43210</p>
                              <p>✉️ <strong>Email:</strong> contact@{req.partnerName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'partner'}.org</p>
                              <p>📍 <strong>Address:</strong> {req.partnerAddress || 'Partner Address'}</p>
                            </div>
                            <div className="action-form-row">
                              <button
                                type="button"
                                className="btn-confirm-action"
                                onClick={() => {
                                  const detailStr = `Contact details viewed: Phone: +91 98765 43210 | Email: contact@${req.partnerName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'partner'}.org (Prototype Demo)`;
                                  handleConfirmNextAction(req.id, 'view_contact', 'View Contact Details', detailStr);
                                }}
                              >
                                Confirm Details Viewed
                              </button>
                              <button
                                type="button"
                                className="btn-cancel-action"
                                onClick={() => handleCancelForm(req.id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {activeActionState[req.id] === 'arrange_handover' && (
                          <div className="action-interactive-form">
                            <h4 className="action-form-title">Arrange Handover (Demo Selection)</h4>
                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>
                                Handover Terms & Location
                              </label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Meet at Hauz Khas market on Saturday at 2 PM"
                                style={{ padding: '6px', fontSize: '0.85rem', width: '100%', border: '1px solid #D5E2D8', borderRadius: '4px' }}
                                value={formInputs[req.id]?.notes || ''}
                                onChange={(e) => handleFormInputChange(req.id, 'notes', e.target.value)}
                                required
                              />
                            </div>
                            <div className="action-form-row">
                              <button
                                type="button"
                                className="btn-confirm-action"
                                onClick={() => {
                                  const notesVal = formInputs[req.id]?.notes;
                                  if (!notesVal || !notesVal.trim()) {
                                    alert('Please provide handover terms or notes.');
                                    return;
                                  }
                                  const detailStr = `Handover arranged: ${notesVal.trim()} (Prototype Demo)`;
                                  handleConfirmNextAction(req.id, 'arrange_handover', 'Arrange Item Handover', detailStr);
                                }}
                              >
                                Confirm Handover (Demo)
                              </button>
                              <button
                                type="button"
                                className="btn-cancel-action"
                                onClick={() => handleCancelForm(req.id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="confirmed-action-display">
                        <div className="confirmed-action-title">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Next Action: {req.selectedNextAction.label} (Demo)</span>
                        </div>
                        <div className="confirmed-action-details">
                          {req.selectedNextAction.detail}
                        </div>
                        <button
                          type="button"
                          className="btn-change-action"
                          onClick={() => handleChangeNextAction(req.id)}
                        >
                          Change Action Option
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="request-card-footer">
                  <span className="prototype-footnote">
                    🔒 Prototype Log (Stored in browser localStorage)
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {req.status === 'Pending' && (
                      <button
                        type="button"
                        onClick={() => handleCancelRequest(req.id)}
                        className="btn-cancel-request"
                        title="Cancel this request"
                      >
                        Cancel Request
                      </button>
                    )}
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
