/**
 * Second Life — Deterministic & Explainable Circular Pathway Recommendation Engine
 * 
 * Evaluates item assessment inputs (Category, Condition, Item Details) across 4 circular pathways:
 * 1. Reuse / Donate
 * 2. Repair
 * 3. Resell / Upcycle
 * 4. Responsible Recycle
 */

export const PATHWAYS = {
  REUSE: 'Reuse / Donate',
  REPAIR: 'Repair',
  RESELL: 'Resell / Upcycle',
  RECYCLE: 'Responsible Recycle'
};

/**
 * Evaluates an item and returns deterministic scores, ranked pathways, explanations, and confidence.
 * 
 * @param {Object} input
 * @param {string} input.item - Item name/description
 * @param {string} input.category - Category (Furniture, Clothing, Electronics, Home Decor, Kitchenware, Other)
 * @param {string} input.condition - Condition (Excellent, Good, Repairable, Damaged)
 * @returns {Object} Full recommendation and scoring breakdown
 */
export function evaluateItemPathway({ item = 'Item', category = 'Other', condition = 'Repairable' }) {
  const normalizedCategory = (category || 'Other').trim();
  const normalizedCondition = (condition || 'Repairable').trim();
  const itemName = (item || 'Item').trim();

  // 1. Base Scores by Condition
  let scores = {
    [PATHWAYS.REUSE]: 20,
    [PATHWAYS.REPAIR]: 20,
    [PATHWAYS.RESELL]: 20,
    [PATHWAYS.RECYCLE]: 20
  };

  const conditionReasons = [];
  const categoryReasons = [];
  const pathwayNotes = {
    [PATHWAYS.REUSE]: [],
    [PATHWAYS.REPAIR]: [],
    [PATHWAYS.RESELL]: [],
    [PATHWAYS.RECYCLE]: []
  };

  // --- CONDITION WEIGHT ADJUSTMENTS ---
  switch (normalizedCondition) {
    case 'Excellent':
      scores[PATHWAYS.REUSE] += 48;
      scores[PATHWAYS.RESELL] += 46;
      scores[PATHWAYS.REPAIR] -= 5;
      scores[PATHWAYS.RECYCLE] -= 10;
      conditionReasons.push('Reported in pristine/like-new condition with full functional and aesthetic value intact.');
      pathwayNotes[PATHWAYS.REUSE].push('Ready for direct adoption or high-impact donation without any intervention.');
      pathwayNotes[PATHWAYS.RESELL].push('High secondhand market appeal commanding maximum resale return.');
      pathwayNotes[PATHWAYS.REPAIR].push('No maintenance or repairs required.');
      pathwayNotes[PATHWAYS.RECYCLE].push('Recycling is unnecessary for fully functional, like-new goods.');
      break;

    case 'Good':
      scores[PATHWAYS.REUSE] += 40;
      scores[PATHWAYS.RESELL] += 36;
      scores[PATHWAYS.REPAIR] += 12;
      scores[PATHWAYS.RECYCLE] -= 5;
      conditionReasons.push('Functional with minor cosmetic wear, maintaining high utility for a new owner.');
      pathwayNotes[PATHWAYS.REUSE].push('Ideal for community thrift, donation hubs, or direct reuse.');
      pathwayNotes[PATHWAYS.RESELL].push('Good resale viability on local secondhand marketplaces.');
      pathwayNotes[PATHWAYS.REPAIR].push('Optional minor detailing or cleaning can further enhance value.');
      pathwayNotes[PATHWAYS.RECYCLE].push(' premature recycling would waste remaining functional lifecycle.');
      break;

    case 'Repairable':
      scores[PATHWAYS.REPAIR] += 50;
      scores[PATHWAYS.REUSE] += 12;
      scores[PATHWAYS.RESELL] += 10;
      scores[PATHWAYS.RECYCLE] += 8;
      conditionReasons.push('Has localized fixable defects or wear; structural materials remain sound and worth restoring.');
      pathwayNotes[PATHWAYS.REPAIR].push('Primary pathway: DIY fix or local repair café can easily restore full functionality.');
      pathwayNotes[PATHWAYS.REUSE].push('Viable for reuse once straightforward repairs are completed.');
      pathwayNotes[PATHWAYS.RESELL].push('Refurbishing the item can recover significant secondary market value.');
      pathwayNotes[PATHWAYS.RECYCLE].push('Recycling is an alternative only if repair proves uneconomical.');
      break;

    case 'Damaged':
      scores[PATHWAYS.RECYCLE] += 52;
      scores[PATHWAYS.RESELL] += 18; // Creative upcycling / scrap value
      scores[PATHWAYS.REPAIR] += 5;
      scores[PATHWAYS.REUSE] -= 15;
      conditionReasons.push('Severe structural or operational damage makes direct reuse impractical without major overhaul.');
      pathwayNotes[PATHWAYS.RECYCLE].push('Primary pathway: Material segregation and certified recycling prevent landfill disposal.');
      pathwayNotes[PATHWAYS.RESELL].push('Potential for creative upcycling, scrap crafting, or salvage parts.');
      pathwayNotes[PATHWAYS.REPAIR].push('Extensive repairs may exceed replacement cost unless sentimentally valuable.');
      pathwayNotes[PATHWAYS.REUSE].push('Not suitable for direct donation in damaged condition.');
      break;

    default:
      scores[PATHWAYS.REUSE] += 20;
      scores[PATHWAYS.REPAIR] += 25;
      break;
  }

  // --- CATEGORY-SPECIFIC ADJUSTMENTS ---
  switch (normalizedCategory) {
    case 'Furniture':
      if (normalizedCondition === 'Repairable' || normalizedCondition === 'Good') {
        scores[PATHWAYS.REPAIR] += 15;
        scores[PATHWAYS.REUSE] += 10;
        categoryReasons.push('Furniture timber and hardware possess high structural longevity, making restoration exceptionally viable.');
      } else if (normalizedCondition === 'Damaged') {
        scores[PATHWAYS.RECYCLE] += 10;
        scores[PATHWAYS.RESELL] += 12; // Upcycling timber
        categoryReasons.push('Large furniture volume provides reclaimable timber and metal scrap for circular reprocessing.');
      } else {
        scores[PATHWAYS.REUSE] += 14;
        scores[PATHWAYS.RESELL] += 12;
        categoryReasons.push('High community demand for quality pre-loved furniture.');
      }
      break;

    case 'Clothing':
    case 'Clothing & Apparel':
      if (normalizedCondition === 'Excellent' || normalizedCondition === 'Good') {
        scores[PATHWAYS.REUSE] += 18;
        scores[PATHWAYS.RESELL] += 15;
        categoryReasons.push('Textiles in good condition have immediate utility in charitable clothing drives and vintage resale.');
      } else {
        scores[PATHWAYS.RECYCLE] += 18;
        scores[PATHWAYS.RESELL] += 10; // Upcycling to rags/crafts
        scores[PATHWAYS.REPAIR] -= 5;
        categoryReasons.push('Worn or torn textiles are best diverted to fiber recycling or creative upcycled patchcraft.');
      }
      break;

    case 'Electronics':
    case 'Electronics & Appliances':
      if (normalizedCondition === 'Damaged') {
        scores[PATHWAYS.RECYCLE] += 25; // Critical E-waste recovery
        scores[PATHWAYS.REPAIR] -= 5;
        categoryReasons.push('Damaged electronics contain hazardous components and valuable metals requiring certified e-waste reclamation.');
      } else if (normalizedCondition === 'Repairable') {
        scores[PATHWAYS.REPAIR] += 20;
        scores[PATHWAYS.RECYCLE] += 10;
        categoryReasons.push('Right-to-repair principles favor replacing modular electronic components or wiring over replacement.');
      } else {
        scores[PATHWAYS.RESELL] += 15;
        scores[PATHWAYS.REUSE] += 10;
        categoryReasons.push('Working electronics retain strong demand on secondary gadget markets.');
      }
      break;

    case 'Home Decor':
    case 'Home & Decor':
      scores[PATHWAYS.RESELL] += 16; // Aesthetic upcycling/resale
      if (normalizedCondition === 'Damaged') {
        scores[PATHWAYS.RESELL] += 15; // Upcycle
        categoryReasons.push('Decorative goods and ceramics often serve as prime materials for creative DIY upcycling projects.');
      } else {
        scores[PATHWAYS.REUSE] += 12;
        categoryReasons.push('Aesthetic homewares easily find renewed purpose in new living spaces.');
      }
      break;

    case 'Kitchenware':
    case 'Kitchenware & Cookware':
      if (normalizedCondition === 'Damaged') {
        scores[PATHWAYS.RECYCLE] += 22; // Metal recycling
        categoryReasons.push('Metal and cookware items have high scrap meltability and high value in circular foundry recycling.');
      } else {
        scores[PATHWAYS.REUSE] += 16;
        categoryReasons.push('Functional cookware and kitchen utensils provide vital utility to community kitchens and shelters.');
      }
      break;

    default:
      // General household adjustments
      scores[PATHWAYS.REUSE] += 5;
      scores[PATHWAYS.REPAIR] += 5;
      break;
  }

  // --- CLAMP SCORES TO [0, 100] ---
  const clampedScores = {};
  for (const path of Object.values(PATHWAYS)) {
    clampedScores[path] = Math.max(0, Math.min(100, Math.round(scores[path])));
  }

  // --- RANK PATHWAYS ---
  const pathwayEntries = Object.entries(clampedScores).map(([pathway, score]) => ({
    pathway,
    score,
    notes: pathwayNotes[pathway] || []
  }));

  // Deterministic sort: Primary by score (desc), Secondary by priority order
  const priorityOrder = [PATHWAYS.REPAIR, PATHWAYS.REUSE, PATHWAYS.RESELL, PATHWAYS.RECYCLE];
  pathwayEntries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return priorityOrder.indexOf(a.pathway) - priorityOrder.indexOf(b.pathway);
  });

  const recommendedPathway = pathwayEntries[0].pathway;
  const topScore = pathwayEntries[0].score;
  const secondScore = pathwayEntries[1]?.score || 0;
  const scoreDiff = topScore - secondScore;

  // --- CONFIDENCE LEVEL CALCULATION ---
  let confidence = 'High';
  let confidenceExplanation = '';
  if (scoreDiff >= 18) {
    confidence = 'High';
    confidenceExplanation = `Clear primary match (+${scoreDiff} pts over secondary option).`;
  } else if (scoreDiff >= 8) {
    confidence = 'Medium';
    confidenceExplanation = `Distinct preference (+${scoreDiff} pts score margin).`;
  } else {
    confidence = 'Low';
    confidenceExplanation = `Close evaluation (+${scoreDiff} pts margin); multiple pathways viable.`;
  }

  // --- DYNAMIC REASON GENERATION ---
  let primaryReason = '';
  if (recommendedPathway === PATHWAYS.REPAIR) {
    primaryReason = `Based on the ${normalizedCondition.toLowerCase()} condition and ${normalizedCategory.toLowerCase()} material profile, repairing this ${itemName} restores its full functional lifecycle while avoiding premature waste.`;
  } else if (recommendedPathway === PATHWAYS.REUSE) {
    primaryReason = `Given the ${normalizedCondition.toLowerCase()} condition, this ${itemName} is immediately usable and delivers maximum social and environmental benefit through direct donation or reuse.`;
  } else if (recommendedPathway === PATHWAYS.RESELL) {
    primaryReason = `With strong circular market demand and ${normalizedCondition.toLowerCase()} condition, this ${itemName} is best suited for secondhand resale or creative upcycling.`;
  } else {
    primaryReason = `Due to ${normalizedCondition.toLowerCase()} condition in the ${normalizedCategory.toLowerCase()} category, certified responsible material recycling ensures zero landfill waste and resource reclamation.`;
  }

  // --- CARBON & MATERIAL ESTIMATES ---
  let carbonEstimate = '~10.5 kg CO₂e';
  let materialType = 'Mixed Household Materials';
  let nextSteps = [];

  if (normalizedCategory === 'Furniture') {
    materialType = 'Timber, Joinery & Metal Fasteners';
    carbonEstimate = normalizedCondition === 'Repairable' ? '~14.2 kg CO₂e' : '~12.0 kg CO₂e';
    nextSteps = [
      recommendedPathway === PATHWAYS.REPAIR
        ? 'Tighten loose joinery or apply wood glue to structural points'
        : 'Wipe clean and photograph for local circular listing',
      'Check local repair cafes or drop-off centers for community reuse',
      'Ensure materials remain dry and protected during transfer'
    ];
  } else if (normalizedCategory === 'Clothing' || normalizedCategory === 'Clothing & Apparel') {
    materialType = 'Woven Textiles & Fibers';
    carbonEstimate = '~8.5 kg CO₂e';
    nextSteps = [
      'Clean according to garment care label instructions',
      recommendedPathway === PATHWAYS.RECYCLE
        ? 'Drop into a designated textile reclamation bin'
        : 'Package cleanly for donation or vintage resale listing',
      'Avoid plastic wrapping where breathable bags are available'
    ];
  } else if (normalizedCategory === 'Electronics' || normalizedCategory === 'Electronics & Appliances') {
    materialType = 'Circuitry, Metals & Polymer Casing';
    carbonEstimate = '~19.4 kg CO₂e';
    nextSteps = [
      'Safely disconnect any power source and clear personal data',
      recommendedPathway === PATHWAYS.RECYCLE
        ? 'Deliver to an authorized e-waste collection center'
        : 'Consult a local repair guild technician for circuit testing',
      'Do not place in standard municipal curbside bins'
    ];
  } else if (normalizedCategory === 'Kitchenware') {
    materialType = 'Cast Alloys, Stainless Steel or Ceramics';
    carbonEstimate = '~6.8 kg CO₂e';
    nextSteps = [
      'Clean thoroughly with warm eco-friendly detergent',
      'Separate metal and non-metal lids if recycling',
      'Connect with local community kitchen donation hubs'
    ];
  } else {
    materialType = 'Composite Homeware Materials';
    carbonEstimate = '~5.5 kg CO₂e';
    nextSteps = [
      'Assess all connection joints and clean surfaces',
      'Match with a verified circular partner in your locality',
      'Log drop-off inquiry in your Second Life session'
    ];
  }

  // Map to ranked output contract
  const rankedPathways = pathwayEntries.map((entry, index) => {
    let viability = 'Viable Option';
    if (index === 0) viability = 'Recommended Match';
    else if (entry.score >= 50) viability = 'Strong Alternative';
    else if (entry.score >= 30) viability = 'Secondary Option';
    else viability = 'Low Viability';

    return {
      pathway: entry.pathway,
      score: entry.score,
      viability,
      isRecommended: index === 0,
      reasons: entry.notes
    };
  });

  return {
    item: itemName,
    category: normalizedCategory,
    condition: normalizedCondition,
    suggestedPath: recommendedPathway,
    scores: {
      reuseDonate: clampedScores[PATHWAYS.REUSE],
      repair: clampedScores[PATHWAYS.REPAIR],
      resellUpcycle: clampedScores[PATHWAYS.RESELL],
      recycle: clampedScores[PATHWAYS.RECYCLE]
    },
    rankedPathways,
    reason: primaryReason,
    explanation: [...conditionReasons, ...categoryReasons],
    confidence,
    confidenceReason: confidenceExplanation,
    carbonSaved: carbonEstimate,
    material: materialType,
    nextSteps
  };
}
