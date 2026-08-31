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

// Prototype Circular Opportunities (Realistic demo listings across pathways, item types, and locations)
export const PROTOTYPE_OPPORTUNITIES = [
  {
    id: 'opp_1',
    name: 'GreenWood Repair Café & Makerspace',
    pathway: 'Repair',
    supportedPathways: ['Repair', 'Resell / Upcycle'],
    supportedCategories: ['Furniture', 'Home Decor', 'Other'],
    supportedConditions: ['Repairable', 'Good', 'Damaged'],
    serviceType: 'Community Repair Lab',
    description: 'Community-run DIY woodworking and furniture restoration lab with free tooling assistance.',
    city: 'Delhi',
    sampleDistance: '1.4 km',
    availability: 'Active (Open Wed-Sun, 10 AM - 5 PM)',
    availabilityStatus: 'Available',
    badge: 'Community Repair Lab',
    address: 'Sector 14 Community Center, Delhi NCR'
  },
  {
    id: 'opp_2',
    name: 'TimberCare Local Restorations',
    pathway: 'Repair',
    supportedPathways: ['Repair'],
    supportedCategories: ['Furniture', 'Kitchenware'],
    supportedConditions: ['Repairable', 'Good'],
    serviceType: 'Artisan Workshop',
    description: 'Professional carpentry and structural reinforcement service specialized in vintage wooden pieces.',
    city: 'Delhi',
    sampleDistance: '2.8 km',
    availability: 'Accepting Drop-offs',
    availabilityStatus: 'Available',
    badge: 'Pro Artisan',
    address: '42 Craftsmen Colony, South Delhi'
  },
  {
    id: 'opp_3',
    name: 'CircuitFix Electronics & Appliance Guild',
    pathway: 'Repair',
    supportedPathways: ['Repair'],
    supportedCategories: ['Electronics', 'Home Decor'],
    supportedConditions: ['Repairable', 'Good'],
    serviceType: 'Right-to-Repair Co-op',
    description: 'Volunteer technicians repairing small appliances, lamps, audio gear, and household gadgets.',
    city: 'Delhi',
    sampleDistance: '3.1 km',
    availability: 'By Appointment (Wed & Sat)',
    availabilityStatus: 'Limited',
    badge: 'Right-to-Repair Co-op',
    address: 'Hub 9 Innovation Park, Okhla, Delhi'
  },
  {
    id: 'opp_4',
    name: 'EcoThreads Stitch & Upcycle Studio',
    pathway: 'Repair',
    supportedPathways: ['Repair', 'Resell / Upcycle'],
    supportedCategories: ['Clothing'],
    supportedConditions: ['Repairable', 'Good', 'Excellent'],
    serviceType: 'Textile Mending Hub',
    description: 'Textile mending, sashiko patching, and zipper replacement studio giving garments extended lives.',
    city: 'Delhi',
    sampleDistance: '1.9 km',
    availability: 'Open Mon-Sat',
    availabilityStatus: 'Available',
    badge: 'Textile Mending Hub',
    address: 'Hauz Khas Village Lane 3, Delhi'
  },
  {
    id: 'opp_5',
    name: 'HopeHaven Community Thrift & Donation Hub',
    pathway: 'Reuse / Donate',
    supportedPathways: ['Reuse / Donate'],
    supportedCategories: ['Clothing', 'Furniture', 'Home Decor', 'Kitchenware', 'Other'],
    supportedConditions: ['Excellent', 'Good'],
    serviceType: 'Donation Center',
    description: 'Verified non-profit collecting good-condition home goods to support sheltered families.',
    city: 'Delhi',
    sampleDistance: '2.2 km',
    availability: 'Drop-off Bin Open 24/7',
    availabilityStatus: 'Available',
    badge: 'Verified Non-Profit',
    address: 'Block C Community Grounds, Delhi'
  },
  {
    id: 'opp_6',
    name: 'Goonj Urban-to-Rural Care Depot',
    pathway: 'Reuse / Donate',
    supportedPathways: ['Reuse / Donate'],
    supportedCategories: ['Clothing', 'Home Decor', 'Kitchenware', 'Other'],
    supportedConditions: ['Excellent', 'Good'],
    serviceType: 'Community Partner',
    description: 'Nationwide circular initiative channelizing surplus urban household goods to rural community programs.',
    city: 'Delhi',
    sampleDistance: '4.5 km',
    availability: 'Active (Daily 9 AM - 6 PM)',
    availabilityStatus: 'Available',
    badge: 'Community Partner',
    address: 'Madanpur Khadar Processing Facility, Delhi'
  },
  {
    id: 'opp_7',
    name: 'SecondChance Vintage Resale Collective',
    pathway: 'Resell / Upcycle',
    supportedPathways: ['Resell / Upcycle'],
    supportedCategories: ['Clothing', 'Home Decor', 'Furniture'],
    supportedConditions: ['Excellent', 'Good'],
    serviceType: 'Curated Resale',
    description: 'Curated circular boutique buying and consigning aesthetic vintage apparel and mid-century decor.',
    city: 'Delhi',
    sampleDistance: '3.6 km',
    availability: 'Accepting Consignments',
    availabilityStatus: 'Available',
    badge: 'Curated Resale',
    address: '22 Shahpur Jat Fashion District, Delhi'
  },
  {
    id: 'opp_8',
    name: 'ReCraft Studio & Upcycled Homegoods',
    pathway: 'Resell / Upcycle',
    supportedPathways: ['Resell / Upcycle', 'Repair'],
    supportedCategories: ['Furniture', 'Home Decor', 'Other'],
    supportedConditions: ['Repairable', 'Good', 'Damaged'],
    serviceType: 'Upcycling Design Lab',
    description: 'Design cooperative transforming unrepairable items into artistic lighting and renewed furniture.',
    city: 'Delhi',
    sampleDistance: '5.1 km',
    availability: 'Active (Tue-Sun)',
    availabilityStatus: 'Available',
    badge: 'Upcycling Design Lab',
    address: 'Plot 104 Design Block, Noida / Delhi NCR'
  },
  {
    id: 'opp_9',
    name: 'City Circular Timber & Metal Reclamation Center',
    pathway: 'Responsible Recycle',
    supportedPathways: ['Responsible Recycle'],
    supportedCategories: ['Furniture', 'Kitchenware', 'Other'],
    supportedConditions: ['Damaged', 'Repairable'],
    serviceType: 'Municipal Material Recovery',
    description: 'Certified municipal material recovery facility segregating untreated wood, steel, and aluminum.',
    city: 'Delhi',
    sampleDistance: '6.2 km',
    availability: 'Open Mon-Fri 8 AM - 4 PM',
    availabilityStatus: 'Available',
    badge: 'Municipal Facility',
    address: 'Green Zone Industrial Area, Delhi'
  },
  {
    id: 'opp_10',
    name: 'E-Waste Zero Landfill Drop Station',
    pathway: 'Responsible Recycle',
    supportedPathways: ['Responsible Recycle'],
    supportedCategories: ['Electronics'],
    supportedConditions: ['Damaged', 'Repairable'],
    serviceType: 'Authorized Recycler',
    description: 'Authorized pollution control board certified recycling point for circuit boards, wiring, and metals.',
    city: 'Delhi',
    sampleDistance: '4.0 km',
    availability: 'Safe Disposal Hub (Daily)',
    availabilityStatus: 'Available',
    badge: 'Authorized Recycler',
    address: 'Nehru Place Eco Pavilion, Delhi'
  },
  {
    id: 'opp_11',
    name: 'Bengaluru Fix-It Collective',
    pathway: 'Repair',
    supportedPathways: ['Repair', 'Resell / Upcycle'],
    supportedCategories: ['Furniture', 'Electronics', 'Home Decor'],
    supportedConditions: ['Repairable', 'Good'],
    serviceType: 'Community Repair Lab',
    description: 'Community repair network connecting skilled craftspeople and enthusiasts to save household items.',
    city: 'Bengaluru',
    sampleDistance: '2.1 km',
    availability: 'Weekends 10 AM - 3 PM',
    availabilityStatus: 'Limited',
    badge: 'Community Repair Lab',
    address: 'Indiranagar 100 Feet Rd, Bengaluru'
  },
  {
    id: 'opp_12',
    name: 'Bangalore Care Foundation Drop-off',
    pathway: 'Reuse / Donate',
    supportedPathways: ['Reuse / Donate'],
    supportedCategories: ['Clothing', 'Kitchenware', 'Furniture', 'Home Decor'],
    supportedConditions: ['Excellent', 'Good'],
    serviceType: 'Donation Center',
    description: 'Direct distribution network providing clean garments and housewares to community programs.',
    city: 'Bengaluru',
    sampleDistance: '3.3 km',
    availability: 'Daily 9 AM - 7 PM',
    availabilityStatus: 'Available',
    badge: 'Verified Non-Profit',
    address: 'Koramangala 4th Block, Bengaluru'
  },
  {
    id: 'opp_13',
    name: 'Mumbai Marine Circular Reclamation',
    pathway: 'Responsible Recycle',
    supportedPathways: ['Responsible Recycle'],
    supportedCategories: ['Furniture', 'Electronics', 'Kitchenware', 'Other'],
    supportedConditions: ['Damaged', 'Repairable'],
    serviceType: 'Certified Recycler',
    description: 'High-standard circular recovery converting rigid plastics, glass, and wood into recycled raw materials.',
    city: 'Mumbai',
    sampleDistance: '4.8 km',
    availability: 'Open Mon-Sat 9 AM - 5 PM',
    availabilityStatus: 'Available',
    badge: 'Certified Recycler',
    address: 'Andheri East Industrial Zone, Mumbai'
  },
  {
    id: 'opp_14',
    name: 'Bombay Upcycle & Thrift Lounge',
    pathway: 'Resell / Upcycle',
    supportedPathways: ['Resell / Upcycle', 'Reuse / Donate'],
    supportedCategories: ['Clothing', 'Home Decor', 'Furniture'],
    supportedConditions: ['Excellent', 'Good'],
    serviceType: 'Curated Resale',
    description: 'Secondhand lifestyle marketplace facilitating peer-to-peer item adoption and upcycling.',
    city: 'Mumbai',
    sampleDistance: '1.8 km',
    availability: 'Active (Daily 11 AM - 8 PM)',
    availabilityStatus: 'Available',
    badge: 'Curated Resale',
    address: 'Bandra West Linking Road, Mumbai'
  },
  {
    id: 'opp_15',
    name: 'ReWear Textile Circular Hub',
    pathway: 'Responsible Recycle',
    supportedPathways: ['Responsible Recycle'],
    supportedCategories: ['Clothing'],
    supportedConditions: ['Damaged', 'Repairable'],
    serviceType: 'Textile Recycler',
    description: 'Specialized fabric fiber recovery converting worn out, torn, or unwearable textiles into acoustic insulation.',
    city: 'Delhi',
    sampleDistance: '5.4 km',
    availability: 'Open Mon-Fri',
    availabilityStatus: 'Available',
    badge: 'Textile Recycler',
    address: 'Udyog Vihar Phase 4, Delhi NCR'
  }
];
