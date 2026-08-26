// Mock dataset for Second Life prototype

export const PRESET_SAMPLES = [
  {
    id: 'chair',
    name: 'Wooden Chair',
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
    analysis: {
      item: 'Solid Oak Dining Chair',
      suggestedPath: 'Repair & Reuse',
      reason: 'Minor visible damage on leg joinery and surface wear. The structural oak timber is robust, making restoration far more sustainable than disposal.',
      condition: 'Good (Minor wear)',
      material: 'Solid Wood / Oak',
      carbonSaved: '~14.2 kg CO₂e',
      nextSteps: [
        'Tighten joinery screws and apply wood glue',
        'Lightly sand surface and re-oil or polish',
        'Keep for home use or list for sale on local circular marketplace'
      ],
      pathwayMatrix: [
        { path: 'Reuse', status: 'High Viability', isRecommended: true },
        { path: 'Repair', status: 'Recommended (Simple fix)', isRecommended: true },
        { path: 'Resell', status: 'Est. value: $35 - $50', isRecommended: false },
        { path: 'Recycle', status: 'Secondary option (Wood recycling)', isRecommended: false }
      ]
    }
  },
  {
    id: 'jacket',
    name: 'Denim Jacket',
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    analysis: {
      item: 'Vintage Denim Trucker Jacket',
      suggestedPath: 'Resell or Donate',
      reason: 'High fabric integrity with classic aesthetic appeal. High resale or charity thrift demand with zero repairs required.',
      condition: 'Excellent Vintage',
      material: '100% Cotton Denim',
      carbonSaved: '~8.5 kg CO₂e',
      nextSteps: [
        'Wash with eco-friendly detergent and line dry',
        'List on vintage/resale platforms or drop at partnered community thrift'
      ],
      pathwayMatrix: [
        { path: 'Reuse', status: 'Ready to wear', isRecommended: true },
        { path: 'Repair', status: 'Not needed', isRecommended: false },
        { path: 'Resell', status: 'Est. value: $25 - $40', isRecommended: true },
        { path: 'Recycle', status: 'Not recommended (High utility)', isRecommended: false }
      ]
    }
  },
  {
    id: 'lamp',
    name: 'Ceramic Lamp',
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    analysis: {
      item: 'Ceramic Table Lamp Base',
      suggestedPath: 'Upcycle / Reuse',
      reason: 'Glazed ceramic body is intact. Fitting a new energy-efficient LED socket or lampshade gives this decorative piece a full second life.',
      condition: 'Very Good',
      material: 'Stoneware Ceramic / Brass',
      carbonSaved: '~5.1 kg CO₂e',
      nextSteps: [
        'Replace lampshade with standard fitting',
        'Install warm LED bulb for energy efficiency'
      ],
      pathwayMatrix: [
        { path: 'Reuse', status: 'High aesthetic value', isRecommended: true },
        { path: 'Repair', status: 'Minor socket refit', isRecommended: false },
        { path: 'Resell', status: 'Est. value: $20', isRecommended: false },
        { path: 'Recycle', status: 'Difficult (Ceramics non-curbside)', isRecommended: false }
      ]
    }
  }
];

export const DEFAULT_MOCK_RESULT = {
  item: 'Wooden Chair',
  suggestedPath: 'Repair & Reuse',
  reason: 'Minor visible damage. The item may be restored instead of discarded.',
  condition: 'Fair to Good',
  material: 'Wood / Timber',
  carbonSaved: '~12.8 kg CO₂e',
  nextSteps: [
    'Apply basic wood glue to loose joinery',
    'Sand down minor scuffs and apply natural wax or oil',
    'Donate to a community centre or enjoy renewed at home'
  ],
  pathwayMatrix: [
    { path: 'Reuse / Donate', status: 'Viable with minor touchup', isRecommended: true },
    { path: 'Repair', status: 'Recommended (Easy DIY)', isRecommended: true },
    { path: 'Resell', status: 'Est. value: $20 - $35', isRecommended: false },
    { path: 'Recycle', status: 'Municipal timber drop-off', isRecommended: false }
  ]
};

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Upload Item',
    description: 'Take a quick photo or drag & drop an image of any unwanted household, wardrobe, or electronic item.',
    icon: 'upload'
  },
  {
    step: '02',
    title: 'Analyze Viability',
    description: 'The platform evaluates material composition, condition, and repair difficulty to determine next potential.',
    icon: 'analyze'
  },
  {
    step: '03',
    title: 'Find Best Path',
    description: 'Receive an intelligent recommendation: Donate, Repair, Resell, Upcycle, or Responsibly Recycle.',
    icon: 'path'
  },
  {
    step: '04',
    title: 'Connect & Act',
    description: 'Connect with local repair cafes, drop-off bins, verified charities, or circular resale marketplaces.',
    icon: 'connect'
  }
];
