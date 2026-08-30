import React from 'react';
import { useNavigate } from 'react-router-dom';
import NearbyOpportunitiesModal from '../components/NearbyOpportunitiesModal';

export default function OpportunitiesPage() {
  const navigate = useNavigate();

  return (
    <div className="page-opportunities">
      <NearbyOpportunitiesModal
        itemDetails={{
          item: 'Household item',
          category: 'Other',
          suggestedPath: 'Repair',
        }}
        onClose={() => navigate('/')}
      />
    </div>
  );
}
