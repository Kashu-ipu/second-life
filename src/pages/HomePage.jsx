import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import ImpactTeaser from '../components/ImpactTeaser';

export default function HomePage() {
  return (
    <div className="page-home">
      <Hero />
      <HowItWorks />
      <ImpactTeaser />
    </div>
  );
}
