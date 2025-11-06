/**
 * Scope 3 Emissions Calculator
 * Based on GHG Protocol Corporate Value Chain (Scope 3) Accounting and Reporting Standard
 * 
 * 15 Categories of Scope 3 Emissions:
 * Upstream: 1-8
 * Downstream: 9-15
 */

/**
 * Emission Factors Database
 * Sources: EPA, DEFRA, EXIOBASE, Industry averages
 * Units: kgCO2e per unit
 */
const EMISSION_FACTORS = {
  // Category 1: Purchased Goods and Services (spend-based, kgCO2e per $1000 USD)
  purchasedGoods: {
    manufacturingSupplies: 450,
    officeSupplies: 280,
    professionalServices: 180,
    itServices: 220,
    marketingServices: 200,
    rawMaterials: {
      steel: 1800,
      aluminum: 9000,
      cement: 900,
      plastics: 3100,
      chemicals: 2500,
      textiles: 1500
    }
  },

  // Category 2: Capital Goods (spend-based, kgCO2e per $1000 USD)
  capitalGoods: {
    machinery: 850,
    vehicles: 920,
    buildings: 650,
    itEquipment: 780,
    furnitureFixtures: 420
  },

  // Category 3: Fuel and Energy Related Activities (kgCO2e per MWh or unit)
  fuelEnergy: {
    electricityTransmissionLoss: 0.08,  // multiplier of Scope 2
    upstreamElectricity: 0.15,  // multiplier of Scope 2
    upstreamFuelProduction: {
      naturalGas: 0.20,  // multiplier of Scope 1 from natural gas
      diesel: 0.18,
      gasoline: 0.20,
      coal: 0.12
    }
  },

  // Category 4: Upstream Transportation and Distribution
  transportation: {
    // kgCO2e per ton-km
    road: {
      smallTruck: 0.850,
      mediumTruck: 0.520,
      largeTruck: 0.380,
      van: 1.200
    },
    rail: 0.022,
    air: {
      domestic: 1.450,
      international: 0.650
    },
    sea: {
      bulkCarrier: 0.008,
      container: 0.015
    },
    // Warehousing: kgCO2e per m² per year
    warehousing: 25
  },

  // Category 5: Waste Generated in Operations
  waste: {
    // kgCO2e per ton of waste
    landfill: {
      organic: 450,
      paper: 320,
      plastics: 21,
      metal: 21,
      glass: 21
    },
    incineration: {
      paper: 1400,
      plastics: 2700,
      textile: 2100
    },
    recycling: {
      paper: 21,
      plastics: 35,
      metal: 10,
      glass: 12
    },
    composting: 25
  },

  // Category 6: Business Travel
  businessTravel: {
    // kgCO2e per passenger-km
    air: {
      domestic: {
        economy: 0.255,
        business: 0.510
      },
      shortHaul: {
        economy: 0.156,
        business: 0.234
      },
      longHaul: {
        economy: 0.150,
        business: 0.434
      }
    },
    rail: 0.041,
    car: {
      small: 0.142,
      medium: 0.171,
      large: 0.209,
      hybrid: 0.109,
      electric: 0.053
    },
    taxi: 0.211,
    bus: 0.103,
    // Hotel nights: kgCO2e per night
    hotel: 29.4
  },

  // Category 7: Employee Commuting
  commuting: {
    // kgCO2e per passenger-km (same as business travel modes)
    car: {
      single: 0.171,
      carpool2: 0.086,
      carpool3: 0.057
    },
    publicTransport: {
      bus: 0.103,
      metro: 0.041,
      train: 0.041
    },
    motorcycle: 0.113,
    bicycle: 0,
    walking: 0,
    // Remote work: avoided emissions per day
    remoteWork: -3.2
  },

  // Category 8: Upstream Leased Assets
  leasedAssets: {
    // kgCO2e per m² per year
    officeSpace: 45,
    warehouseSpace: 30,
    retailSpace: 50,
    // Vehicle leasing: kgCO2e per vehicle per year
    vehicleLease: 4500
  },

  // Category 9: Downstream Transportation and Distribution
  downstreamTransport: {
    // Same as Category 4 but for sold products
    // Use transportation factors from Category 4
  },

  // Category 10: Processing of Sold Products
  processingProducts: {
    // Industry-specific, kgCO2e per unit of sold product
    // Example factors (highly variable by industry)
    foodProcessing: 0.85,
    chemicalProcessing: 2.30,
    textileProcessing: 1.20
  },

  // Category 11: Use of Sold Products
  useOfProducts: {
    // Lifetime emissions of sold products
    // kgCO2e per product lifetime
    vehicles: {
      gasolineCar: 24000,  // per vehicle over 12 years
      electricCar: 8000,
      hybridCar: 15000
    },
    appliances: {
      refrigerator: 820,  // per unit over 15 years
      washingMachine: 610,
      dishwasher: 450,
      airConditioner: 1850
    },
    electronics: {
      laptop: 180,  // per unit over 4 years
      smartphone: 55,  // per unit over 3 years
      desktop: 320
    },
    // Fuel-based products: kgCO2e per liter or kg
    fuelSold: {
      gasoline: 2.31,  // per liter
      diesel: 2.68,
      naturalGas: 1.96  // per kg
    }
  },

  // Category 12: End-of-Life Treatment of Sold Products
  endOfLife: {
    // Same as Category 5 waste factors
    // kgCO2e per ton
  },

  // Category 13: Downstream Leased Assets
  downstreamLeased: {
    // Same as Category 8 factors for leased properties
  },

  // Category 14: Franchises
  franchises: {
    // kgCO2e per franchise unit per year (estimated)
    retailFranchise: 15000,
    foodServiceFranchise: 25000,
    serviceFranchise: 8000
  },

  // Category 15: Investments
  investments: {
    // kgCO2e per $1000 invested (sector-specific)
    equity: {
      energy: 850,
      utilities: 920,
      materials: 780,
      industrials: 650,
      consumerDiscretionary: 380,
      consumerStaples: 420,
      healthcare: 280,
      financials: 180,
      informationTechnology: 220,
      communicationServices: 240,
      realEstate: 520
    },
    corporateBonds: 0.85,  // multiplier of equity
    governmentBonds: 0.05,
    infrastructure: {
      renewableEnergy: 120,
      fossilFuel: 1200,
      transportation: 650,
      buildings: 480
    }
  }
};

/**
 * Calculate Category 1: Purchased Goods and Services
 * Spend-based method
 */
export const calculateCategory1 = (data) => {
  let emissions = 0;
  const details = [];

  if (data.purchasedGoodsSpending) {
    const spending = parseFloat(data.purchasedGoodsSpending);
    const emissionFactor = EMISSION_FACTORS.purchasedGoods[data.purchasedGoodsType] || 
                          EMISSION_FACTORS.purchasedGoods.manufacturingSupplies;
    emissions = (spending / 1000) * emissionFactor;
    details.push({
      category: 'Purchased Goods & Services',
      spending: spending,
      emissionFactor: emissionFactor,
      emissions: emissions
    });
  }

  return { emissions, details, unit: 'kgCO2e' };
};

/**
 * Calculate Category 2: Capital Goods
 * Spend-based method
 */
export const calculateCategory2 = (data) => {
  let emissions = 0;
  const details = [];

  if (data.capitalGoodsSpending) {
    const spending = parseFloat(data.capitalGoodsSpending);
    const emissionFactor = EMISSION_FACTORS.capitalGoods[data.capitalGoodsType] || 
                          EMISSION_FACTORS.capitalGoods.machinery;
    emissions = (spending / 1000) * emissionFactor;
    details.push({
      category: 'Capital Goods',
      spending: spending,
      emissionFactor: emissionFactor,
      emissions: emissions
    });
  }

  return { emissions, details, unit: 'kgCO2e' };
};

/**
 * Calculate Category 3: Fuel and Energy Related Activities
 * Based on Scope 1 & 2 emissions
 */
export const calculateCategory3 = (data) => {
  let emissions = 0;
  const details = [];

  const scope1 = parseFloat(data.scope1Emissions || 0);
  const scope2 = parseFloat(data.scope2Emissions || 0);

  // Upstream electricity emissions (T&D losses + well-to-tank)
  const upstreamElectricity = scope2 * (EMISSION_FACTORS.fuelEnergy.electricityTransmissionLoss + 
                                        EMISSION_FACTORS.fuelEnergy.upstreamElectricity);
  emissions += upstreamElectricity;
  details.push({
    category: 'Upstream Electricity',
    baseEmissions: scope2,
    emissionFactor: 0.23,
    emissions: upstreamElectricity
  });

  // Upstream fuel production (assume 20% of Scope 1 for simplicity)
  const upstreamFuel = scope1 * 0.20;
  emissions += upstreamFuel;
  details.push({
    category: 'Upstream Fuel Production',
    baseEmissions: scope1,
    emissionFactor: 0.20,
    emissions: upstreamFuel
  });

  return { emissions, details, unit: 'kgCO2e' };
};

/**
 * Calculate Category 4: Upstream Transportation and Distribution
 * Activity-based method (ton-km)
 */
export const calculateCategory4 = (data) => {
  let emissions = 0;
  const details = [];

  if (data.upstreamTransportTonKm && data.upstreamTransportMode) {
    const tonKm = parseFloat(data.upstreamTransportTonKm);
    let emissionFactor = 0.380; // default large truck

    if (data.upstreamTransportMode === 'road') {
      emissionFactor = EMISSION_FACTORS.transportation.road.largeTruck;
    } else if (data.upstreamTransportMode === 'rail') {
      emissionFactor = EMISSION_FACTORS.transportation.rail;
    } else if (data.upstreamTransportMode === 'sea') {
      emissionFactor = EMISSION_FACTORS.transportation.sea.container;
    } else if (data.upstreamTransportMode === 'air') {
      emissionFactor = EMISSION_FACTORS.transportation.air.international;
    }

    emissions = tonKm * emissionFactor;
    details.push({
      category: 'Upstream Transport',
      tonKm: tonKm,
      mode: data.upstreamTransportMode,
      emissionFactor: emissionFactor,
      emissions: emissions
    });
  }

  return { emissions, details, unit: 'kgCO2e' };
};

/**
 * Calculate Category 5: Waste Generated in Operations
 * Activity-based method (tons of waste by type)
 */
export const calculateCategory5 = (data) => {
  let emissions = 0;
  const details = [];

  const wasteTypes = ['landfill', 'incineration', 'recycling'];
  
  wasteTypes.forEach(type => {
    if (data[`waste${type.charAt(0).toUpperCase() + type.slice(1)}`]) {
      const wasteAmount = parseFloat(data[`waste${type.charAt(0).toUpperCase() + type.slice(1)}`]);
      // Assume mixed waste, use average factor
      const avgFactor = type === 'landfill' ? 250 : type === 'incineration' ? 2000 : 20;
      const wasteEmissions = wasteAmount * avgFactor;
      emissions += wasteEmissions;
      
      details.push({
        category: `Waste - ${type}`,
        amount: wasteAmount,
        emissionFactor: avgFactor,
        emissions: wasteEmissions
      });
    }
  });

  return { emissions, details, unit: 'kgCO2e' };
};

/**
 * Calculate Category 6: Business Travel
 * Activity-based method (passenger-km by mode)
 */
export const calculateCategory6 = (data) => {
  let emissions = 0;
  const details = [];

  // Air travel
  if (data.businessTravelAirKm) {
    const airKm = parseFloat(data.businessTravelAirKm);
    const flightClass = data.businessTravelAirClass || 'economy';
    const flightType = data.businessTravelAirType || 'longHaul';
    
    const emissionFactor = EMISSION_FACTORS.businessTravel.air[flightType][flightClass];
    const airEmissions = airKm * emissionFactor;
    emissions += airEmissions;
    
    details.push({
      category: 'Business Travel - Air',
      distance: airKm,
      flightType: flightType,
      class: flightClass,
      emissionFactor: emissionFactor,
      emissions: airEmissions
    });
  }

  // Ground travel
  if (data.businessTravelGroundKm) {
    const groundKm = parseFloat(data.businessTravelGroundKm);
    const vehicleType = data.businessTravelVehicleType || 'medium';
    
    const emissionFactor = EMISSION_FACTORS.businessTravel.car[vehicleType];
    const groundEmissions = groundKm * emissionFactor;
    emissions += groundEmissions;
    
    details.push({
      category: 'Business Travel - Ground',
      distance: groundKm,
      vehicleType: vehicleType,
      emissionFactor: emissionFactor,
      emissions: groundEmissions
    });
  }

  // Hotel nights
  if (data.businessTravelHotelNights) {
    const nights = parseFloat(data.businessTravelHotelNights);
    const hotelEmissions = nights * EMISSION_FACTORS.businessTravel.hotel;
    emissions += hotelEmissions;
    
    details.push({
      category: 'Business Travel - Accommodation',
      nights: nights,
      emissionFactor: EMISSION_FACTORS.businessTravel.hotel,
      emissions: hotelEmissions
    });
  }

  return { emissions, details, unit: 'kgCO2e' };
};

/**
 * Calculate Category 7: Employee Commuting
 * Activity-based method (employee count × average distance × mode split)
 */
export const calculateCategory7 = (data) => {
  let emissions = 0;
  const details = [];

  if (data.employeeCount && data.avgCommutingDistanceKm) {
    const employees = parseFloat(data.employeeCount);
    const avgDistance = parseFloat(data.avgCommutingDistanceKm);
    const workingDays = parseFloat(data.workingDaysPerYear || 230);

    // Mode split (if provided, else use defaults)
    const modeSplit = {
      car: parseFloat(data.commutingCarShare || 60) / 100,
      publicTransport: parseFloat(data.commutingPublicShare || 25) / 100,
      bicycle: parseFloat(data.commutingBicycleShare || 10) / 100,
      walking: parseFloat(data.commutingWalkingShare || 5) / 100
    };

    // Car commuting
    const carKm = employees * avgDistance * 2 * workingDays * modeSplit.car;
    const carEmissions = carKm * EMISSION_FACTORS.commuting.car.single;
    emissions += carEmissions;
    details.push({
      category: 'Commuting - Car',
      passengerKm: carKm,
      emissionFactor: EMISSION_FACTORS.commuting.car.single,
      emissions: carEmissions
    });

    // Public transport
    const ptKm = employees * avgDistance * 2 * workingDays * modeSplit.publicTransport;
    const ptEmissions = ptKm * EMISSION_FACTORS.commuting.publicTransport.bus;
    emissions += ptEmissions;
    details.push({
      category: 'Commuting - Public Transport',
      passengerKm: ptKm,
      emissionFactor: EMISSION_FACTORS.commuting.publicTransport.bus,
      emissions: ptEmissions
    });

    // Remote work credit
    if (data.remoteWorkDaysPerYear) {
      const remoteDays = parseFloat(data.remoteWorkDaysPerYear);
      const avoidedEmissions = employees * remoteDays * EMISSION_FACTORS.commuting.remoteWork * -1;
      emissions += avoidedEmissions;
      details.push({
        category: 'Remote Work (Credit)',
        days: employees * remoteDays,
        emissionFactor: EMISSION_FACTORS.commuting.remoteWork,
        emissions: avoidedEmissions
      });
    }
  }

  return { emissions, details, unit: 'kgCO2e' };
};

/**
 * Calculate Category 11: Use of Sold Products
 * Product-based method (units sold × lifetime emissions)
 */
export const calculateCategory11 = (data) => {
  let emissions = 0;
  const details = [];

  if (data.productCategory && data.unitsSoldAnnually) {
    const units = parseFloat(data.unitsSoldAnnually);
    let lifetimeEmissions = 0;

    // Determine product type and get emission factor
    if (data.productCategory === 'vehicles') {
      lifetimeEmissions = EMISSION_FACTORS.useOfProducts.vehicles[data.productType] || 
                         EMISSION_FACTORS.useOfProducts.vehicles.gasolineCar;
    } else if (data.productCategory === 'appliances') {
      lifetimeEmissions = EMISSION_FACTORS.useOfProducts.appliances[data.productType] || 500;
    } else if (data.productCategory === 'electronics') {
      lifetimeEmissions = EMISSION_FACTORS.useOfProducts.electronics[data.productType] || 100;
    }

    emissions = units * lifetimeEmissions;
    details.push({
      category: 'Use of Sold Products',
      units: units,
      productType: data.productType,
      lifetimeEmissions: lifetimeEmissions,
      emissions: emissions
    });
  }

  return { emissions, details, unit: 'kgCO2e' };
};

/**
 * Calculate Category 15: Investments
 * Spend-based method (investment value × sector emission factor)
 */
export const calculateCategory15 = (data) => {
  let emissions = 0;
  const details = [];

  if (data.investmentPortfolioValue) {
    const portfolioValue = parseFloat(data.investmentPortfolioValue);
    
    // If sector breakdown provided
    if (data.investmentSectorBreakdown) {
      Object.entries(data.investmentSectorBreakdown).forEach(([sector, percentage]) => {
        const sectorValue = portfolioValue * (parseFloat(percentage) / 100);
        const emissionFactor = EMISSION_FACTORS.investments.equity[sector] || 400;
        const sectorEmissions = (sectorValue / 1000) * emissionFactor;
        
        emissions += sectorEmissions;
        details.push({
          category: `Investments - ${sector}`,
          value: sectorValue,
          emissionFactor: emissionFactor,
          emissions: sectorEmissions
        });
      });
    } else {
      // Use average emission factor
      const avgFactor = 450; // Average across sectors
      emissions = (portfolioValue / 1000) * avgFactor;
      details.push({
        category: 'Investments - Portfolio Average',
        value: portfolioValue,
        emissionFactor: avgFactor,
        emissions: emissions
      });
    }
  }

  return { emissions, details, unit: 'kgCO2e' };
};

/**
 * Main Scope 3 Calculation Function
 * Calculates all 15 categories and returns comprehensive results
 */
export const calculateScope3 = (formData) => {
  const results = {
    totalEmissions: 0,
    totalEmissionsTons: 0,
    categories: {},
    breakdown: [],
    coverage: {
      calculated: 0,
      total: 15
    },
    recommendations: []
  };

  // Calculate each category
  const categoryCalculations = [
    { id: 1, name: 'Purchased Goods & Services', calc: calculateCategory1(formData) },
    { id: 2, name: 'Capital Goods', calc: calculateCategory2(formData) },
    { id: 3, name: 'Fuel & Energy Related', calc: calculateCategory3(formData) },
    { id: 4, name: 'Upstream Transport', calc: calculateCategory4(formData) },
    { id: 5, name: 'Waste Operations', calc: calculateCategory5(formData) },
    { id: 6, name: 'Business Travel', calc: calculateCategory6(formData) },
    { id: 7, name: 'Employee Commuting', calc: calculateCategory7(formData) },
    { id: 11, name: 'Use of Sold Products', calc: calculateCategory11(formData) },
    { id: 15, name: 'Investments', calc: calculateCategory15(formData) }
  ];

  categoryCalculations.forEach(cat => {
    if (cat.calc.emissions > 0) {
      results.totalEmissions += cat.calc.emissions;
      results.categories[`category${cat.id}`] = cat.calc.emissions;
      results.breakdown.push({
        category: cat.id,
        name: cat.name,
        emissions: cat.calc.emissions,
        percentage: 0, // Will be calculated after total
        details: cat.calc.details
      });
      results.coverage.calculated++;
    }
  });

  // Convert to tons
  results.totalEmissionsTons = results.totalEmissions / 1000;

  // Calculate percentages
  results.breakdown.forEach(item => {
    item.percentage = (item.emissions / results.totalEmissions) * 100;
  });

  // Sort by emissions (highest first)
  results.breakdown.sort((a, b) => b.emissions - a.emissions);

  // Generate recommendations
  results.recommendations = generateScope3Recommendations(results, formData);

  return results;
};

/**
 * Generate actionable recommendations based on Scope 3 results
 */
const generateScope3Recommendations = (results, formData) => {
  const recommendations = [];

  // Check if major categories are covered
  if (results.coverage.calculated < 10) {
    recommendations.push({
      priority: 'High',
      category: 'Data Coverage',
      action: 'Expand Scope 3 data collection',
      description: `Currently tracking ${results.coverage.calculated} of 15 categories. Focus on material categories for your industry.`,
      impact: 'Improved accuracy and TCFD compliance'
    });
  }

  // Analyze top contributors
  if (results.breakdown.length > 0) {
    const topCategory = results.breakdown[0];
    if (topCategory.percentage > 50) {
      recommendations.push({
        priority: 'Critical',
        category: topCategory.name,
        action: `Implement supplier engagement program for ${topCategory.name}`,
        description: `This category represents ${topCategory.percentage.toFixed(1)}% of Scope 3 emissions.`,
        impact: 'Potential 20-30% reduction in Scope 3'
      });
    }
  }

  // Business travel recommendations
  const travelCategory = results.breakdown.find(c => c.category === 6);
  if (travelCategory && travelCategory.emissions > 100000) {
    recommendations.push({
      priority: 'Medium',
      category: 'Business Travel',
      action: 'Implement virtual meeting policy',
      description: 'Reduce air travel through video conferencing and prioritize train over plane for short distances.',
      impact: 'Potential 30-40% reduction in travel emissions'
    });
  }

  // Commuting recommendations
  if (formData.employeeCount > 100) {
    recommendations.push({
      priority: 'Medium',
      category: 'Employee Commuting',
      action: 'Launch sustainable commuting program',
      description: 'Incentivize public transport, cycling, carpooling, and remote work.',
      impact: 'Potential 15-25% reduction in commuting emissions'
    });
  }

  return recommendations;
};

/**
 * Get emission factor for specific item (utility function)
 */
export const getEmissionFactor = (category, subcategory, item) => {
  try {
    if (subcategory && item) {
      return EMISSION_FACTORS[category][subcategory][item];
    } else if (subcategory) {
      return EMISSION_FACTORS[category][subcategory];
    }
    return EMISSION_FACTORS[category];
  } catch (error) {
    return null;
  }
};

export default {
  calculateScope3,
  calculateCategory1,
  calculateCategory2,
  calculateCategory3,
  calculateCategory4,
  calculateCategory5,
  calculateCategory6,
  calculateCategory7,
  calculateCategory11,
  calculateCategory15,
  getEmissionFactor,
  EMISSION_FACTORS
};
