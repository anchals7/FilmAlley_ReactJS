import React from 'react';
import RecommendationsList from '../components/recommendations/RecommendationsList';

function Recommendations() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="page-heading mb-8">Recommended for You</h1>
      <RecommendationsList />
    </div>
  );
}

export default Recommendations; 