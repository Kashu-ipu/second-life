/**
 * Second Life — Deterministic Opportunity Matching Engine (Day 4)
 * 
 * Matches and ranks circular opportunities based on:
 * 1. Recommended Pathway Compatibility (40 pts)
 * 2. Item Category Support (25 pts)
 * 3. Item Condition Compatibility (15 pts)
 * 4. Location / Area Compatibility (10 pts)
 * 5. Partner Availability Status (10 pts)
 * 
 * Total Match Score: 0 - 100
 */

import { PROTOTYPE_OPPORTUNITIES } from '../data/mockData.js';

/**
 * Normalizes pathway names for robust comparison across formats.
 */
export function normalizePathway(pathway = '') {
  const p = (pathway || '').toLowerCase();
  if (p.includes('repair')) return 'Repair';
  if (p.includes('donate') || p.includes('reuse')) return 'Reuse / Donate';
  if (p.includes('resell') || p.includes('upcycle')) return 'Resell / Upcycle';
  if (p.includes('recycle')) return 'Responsible Recycle';
  return 'Repair';
}

/**
 * Evaluates match score and generates explainability factors for a single opportunity.
 * 
 * @param {Object} opportunity - Opportunity partner item from mockData
 * @param {Object} criteria - User & assessment criteria
 * @param {string} criteria.item - Name of item
 * @param {string} criteria.category - Category (Furniture, Clothing, Electronics, etc.)
 * @param {string} criteria.condition - Condition (Excellent, Good, Repairable, Damaged)
 * @param {string} criteria.suggestedPath - Primary recommended pathway from assessment
 * @param {string} criteria.userLocation - User selected city/location or device location
 * @returns {Object} { matchScore, scoreBreakdown, matchExplanation, matchBadge, isTopMatch }
 */
export function evaluateOpportunityMatch(opportunity, criteria = {}) {
  const targetPathway = normalizePathway(criteria.suggestedPath || 'Repair');
  const targetCategory = (criteria.category || 'Other').trim();
  const targetCondition = (criteria.condition || 'Repairable').trim();
  const userLoc = (criteria.userLocation || '').toLowerCase().trim();

  const oppPathway = normalizePathway(opportunity.pathway || '');
  const oppSupportedPathways = (opportunity.supportedPathways || [oppPathway]).map(normalizePathway);
  const oppCategories = (opportunity.supportedCategories || []).map((c) => c.toLowerCase());
  const oppConditions = (opportunity.supportedConditions || ['Excellent', 'Good', 'Repairable', 'Damaged']).map((c) => c.toLowerCase());
  const oppCity = (opportunity.city || '').toLowerCase();
  const oppAvailability = opportunity.availabilityStatus || (
    opportunity.availability?.toLowerCase().includes('active') || opportunity.availability?.toLowerCase().includes('daily') || opportunity.availability?.toLowerCase().includes('open')
      ? 'Available'
      : opportunity.availability?.toLowerCase().includes('appointment') || opportunity.availability?.toLowerCase().includes('drop-off')
      ? 'Limited'
      : 'Available'
  );

  let pathwayScore = 0;
  let categoryScore = 0;
  let conditionScore = 0;
  let locationScore = 0;
  let availabilityScore = 0;
  const matchExplanation = [];

  // 1. Recommended Pathway Match (40 pts)
  if (oppSupportedPathways.includes(targetPathway)) {
    pathwayScore = 40;
    matchExplanation.push(`Specialized for ${targetPathway} pathway`);
  } else if (
    (targetPathway === 'Resell / Upcycle' && oppSupportedPathways.includes('Repair')) ||
    (targetPathway === 'Repair' && oppSupportedPathways.includes('Resell / Upcycle')) ||
    (targetPathway === 'Reuse / Donate' && oppSupportedPathways.includes('Resell / Upcycle'))
  ) {
    pathwayScore = 18;
    matchExplanation.push(`Compatible secondary circular pathway (${oppPathway})`);
  } else {
    pathwayScore = 0;
  }

  // 2. Item Category Match (25 pts)
  const isDirectCategoryMatch = oppCategories.includes(targetCategory.toLowerCase());
  const isGeneralist = oppCategories.includes('other') || oppCategories.includes('all') || oppCategories.length >= 4;

  if (isDirectCategoryMatch) {
    categoryScore = 25;
    matchExplanation.push(`Directly accepts ${targetCategory} items`);
  } else if (isGeneralist) {
    categoryScore = 15;
    matchExplanation.push(`Accepts general household & ${targetCategory} goods`);
  } else {
    categoryScore = 0;
  }

  // 3. Condition Compatibility (15 pts)
  const isConditionExplicitlySupported = oppConditions.includes(targetCondition.toLowerCase());

  if (isConditionExplicitlySupported) {
    conditionScore = 15;
    matchExplanation.push(`Equipped for ${targetCondition} condition`);
  } else {
    // Heuristic fallbacks if condition is not explicitly listed
    if (targetCondition === 'Excellent' || targetCondition === 'Good') {
      if (oppPathway === 'Reuse / Donate' || oppPathway === 'Resell / Upcycle') conditionScore = 15;
      else if (oppPathway === 'Repair') conditionScore = 8;
      else conditionScore = 5;
    } else if (targetCondition === 'Repairable') {
      if (oppPathway === 'Repair' || oppPathway === 'Resell / Upcycle') conditionScore = 15;
      else if (oppPathway === 'Reuse / Donate') conditionScore = 6;
      else conditionScore = 8;
    } else if (targetCondition === 'Damaged') {
      if (oppPathway === 'Responsible Recycle') conditionScore = 15;
      else if (oppPathway === 'Repair' || oppPathway === 'Resell / Upcycle') conditionScore = 10;
      else conditionScore = 0;
    }
    if (conditionScore >= 10) {
      matchExplanation.push(`Suitable for ${targetCondition} condition items`);
    }
  }

  // 4. Location Compatibility (10 pts)
  if (!userLoc || userLoc.includes('current') || userLoc.includes('device')) {
    // Default / Detected location
    if (oppCity === 'delhi') {
      locationScore = 10;
      matchExplanation.push(`Located in detected local area (${opportunity.city})`);
    } else {
      locationScore = 5;
    }
  } else if (userLoc.includes(oppCity) || (oppCity === 'delhi' && userLoc.includes('ncr'))) {
    locationScore = 10;
    matchExplanation.push(`Located in your area (${opportunity.city})`);
  } else if (
    (userLoc.includes('delhi') || userLoc.includes('ncr')) && oppCity === 'delhi' ||
    (userLoc.includes('mumbai') && oppCity === 'mumbai') ||
    (userLoc.includes('bengaluru') || userLoc.includes('bangalore')) && oppCity === 'bengaluru'
  ) {
    locationScore = 10;
    matchExplanation.push(`Located in your city (${opportunity.city})`);
  } else {
    // Different or generic location
    locationScore = 3;
  }

  // 5. Partner Availability (10 pts)
  if (oppAvailability === 'Available') {
    availabilityScore = 10;
    matchExplanation.push('Active & accepting items');
  } else if (oppAvailability === 'Limited') {
    availabilityScore = 7;
    matchExplanation.push('Available by appointment / scheduled drop-off');
  } else {
    availabilityScore = 0;
  }

  const totalScore = Math.min(100, Math.max(0, pathwayScore + categoryScore + conditionScore + locationScore + availabilityScore));

  let matchBadge = 'Secondary Option';
  let isTopMatch = false;
  if (totalScore >= 80) {
    matchBadge = 'Top Match';
    isTopMatch = true;
  } else if (totalScore >= 60) {
    matchBadge = 'Good Match';
  } else if (totalScore >= 40) {
    matchBadge = 'Alternative Option';
  } else {
    matchBadge = 'Low Match';
  }

  return {
    matchScore: totalScore,
    scoreBreakdown: {
      pathway: pathwayScore,
      category: categoryScore,
      condition: conditionScore,
      location: locationScore,
      availability: availabilityScore
    },
    matchExplanation,
    matchBadge,
    isTopMatch
  };
}

/**
 * Matches, scores, filters, and dynamically ranks opportunities for an assessed item.
 * 
 * @param {Object} criteria
 * @param {string} criteria.item - Name of item
 * @param {string} criteria.category - Category of item
 * @param {string} criteria.condition - Condition of item
 * @param {string} criteria.suggestedPath - Primary recommended pathway
 * @param {string} criteria.userLocation - Location string
 * @param {Array} [opportunitiesList] - Optional custom list, defaults to PROTOTYPE_OPPORTUNITIES
 * @param {Object} [options]
 * @param {number} [options.minScore] - Minimum score threshold (defaults to 30)
 * @returns {Array} Ranked list of matched opportunities with attached match data
 */
export function rankMatchedOpportunities(criteria = {}, opportunitiesList = PROTOTYPE_OPPORTUNITIES, options = {}) {
  const minScore = options.minScore !== undefined ? options.minScore : 30;

  const scoredList = opportunitiesList.map((opp) => {
    const matchAnalysis = evaluateOpportunityMatch(opp, criteria);
    return {
      ...opp,
      matchScore: matchAnalysis.matchScore,
      scoreBreakdown: matchAnalysis.scoreBreakdown,
      matchExplanation: matchAnalysis.matchExplanation,
      matchBadge: matchAnalysis.matchBadge,
      isTopMatch: matchAnalysis.isTopMatch
    };
  });

  // Filter out completely incompatible opportunities (score < minScore)
  const filtered = scoredList.filter((item) => item.matchScore >= minScore);

  // If filtered is empty or too restrictive, return scoredList sorted anyway to avoid empty screen unless strictly none match
  const results = filtered.length > 0 ? filtered : scoredList.filter((item) => item.matchScore >= 15);

  // Sort descending by matchScore. Secondary sort by availability and distance.
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    // Secondary tie-breaker: pathway score
    if ((b.scoreBreakdown?.pathway || 0) !== (a.scoreBreakdown?.pathway || 0)) {
      return (b.scoreBreakdown?.pathway || 0) - (a.scoreBreakdown?.pathway || 0);
    }
    return 0;
  });

  return results;
}
