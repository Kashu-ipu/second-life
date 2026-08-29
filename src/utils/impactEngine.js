// src/utils/impactEngine.js
/**
 * Simple deterministic environmental impact model.
 * Generates a Circularity Score (0-100) and qualitative impact descriptors
 * based on the recommendation pathway and item characteristics.
 */

export function calculateImpact({ suggestedPath, category, condition, characteristics = {} }) {
  // Base score derived from pathway importance
  const pathwayBase = {
    'Reuse / Donate': 20,
    'Repair': 25,
    'Resell / Upcycle': 15,
    'Responsible Recycle': 0
  }[suggestedPath] || 0;

  // Extract characteristic scores (0-10 each) with defaults
  const usabilityScore = (() => {
    const val = characteristics.usability || characteristics.structuralCondition || '';
    switch (val) {
      case 'Excellent':
      case 'Good':
        return 10;
      case 'Repairable':
      case 'Fair':
        return 6;
      case 'Damaged':
      case 'Poor':
        return 2;
      default:
        return 4; // generic default
    }
  })();

  const repairabilityScore = (() => {
    const val = characteristics.repairability || '';
    switch (val) {
      case 'High':
        return 10;
      case 'Medium':
        return 6;
      case 'Low':
        return 2;
      default:
        return 4;
    }
  })();

  const reusePotentialScore = (() => {
    const val = characteristics.reusePotential || '';
    switch (val) {
      case 'High':
        return 10;
      case 'Medium':
        return 6;
      case 'Low':
        return 2;
      default:
        return 4;
    }
  })();

  // Material influence on recycling potential (adds to recycling score but also to circularity)
  const materialBonus = (() => {
    const mat = characteristics.material || '';
    if (mat === 'Metal' || mat === 'Glass' || mat === 'Plastic') return 5;
    if (mat === 'Wood' || mat === 'Fabric') return 3;
    return 0;
  })();

  // Compute circularity score (bounded 0-100)
  let circularityScore = 50 + pathwayBase + usabilityScore + repairabilityScore + reusePotentialScore + materialBonus;
  if (circularityScore > 100) circularityScore = 100;
  if (circularityScore < 0) circularityScore = 0;

  // Qualitative labels based on thresholds
  const wasteDiversion = (() => {
    switch (suggestedPath) {
      case 'Reuse / Donate':
      case 'Repair':
        return 'High';
      case 'Resell / Upcycle':
        return 'Medium';
      case 'Responsible Recycle':
        return 'Low';
      default:
        return 'Medium';
    }
  })();

  const lifecycleExtension = (() => {
    if (suggestedPath === 'Repair') return 'Significant';
    if (suggestedPath === 'Reuse / Donate') return 'High';
    if (suggestedPath === 'Resell / Upcycle') return 'Moderate';
    return 'Minimal';
  })();

  const impactExplanation = `Choosing ${suggestedPath.toLowerCase()} leverages the item's ${condition.toLowerCase()} condition` +
    (characteristics.repairability ? ` and ${characteristics.repairability.toLowerCase()} repairability` : '') +
    (characteristics.reusePotential ? ` with ${characteristics.reusePotential.toLowerCase()} reuse potential` : '') +
    `. This yields a ${wasteDiversion.toLowerCase()} waste diversion potential and a ${lifecycleExtension.toLowerCase()} extension of its lifecycle.`;

  return {
    circularityScore,
    wasteDiversion,
    lifecycleExtension,
    impactExplanation
  };
}
