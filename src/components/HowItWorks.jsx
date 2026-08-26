import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/mockData';

export default function HowItWorks() {
  const getStepIcon = (iconName) => {
    switch (iconName) {
      case 'upload':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        );
      case 'analyze':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        );
      case 'path':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
        );
      case 'connect':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Simple 4-Step Process</span>
          <h2 className="section-title">How Second Life Works</h2>
          <p className="section-subtitle">
            Turning unwanted items into value and keeping resources in circular rotation.
          </p>
        </div>

        <div className="steps-grid">
          {HOW_IT_WORKS_STEPS.map((stepItem, index) => (
            <div key={index} className="step-card">
              <div className="step-header">
                <div className="step-number">{stepItem.step}</div>
                <div className="step-icon-wrap">
                  {getStepIcon(stepItem.icon)}
                </div>
              </div>
              <h3 className="step-title">{stepItem.title}</h3>
              <p className="step-description">{stepItem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
