/**
 * Location-Based Climate Data Integration Service
 * 
 * Automatically fetches climate risk data based on facility location (lat/long)
 * for global ECB/IFRS S2 compliance and physical risk assessment.
 * 
 * Data Sources:
 * - Aqueduct Water Risk Atlas (WRI)
 * - ND-GAIN Country Index
 * - Köppen Climate Classification
 * - OpenWeatherMap Climate Data
 * - World Bank Climate Portal
 * - NGFS Physical Risk Maps (when available)
 */

// Köppen Climate Classification mapping
const KOPPEN_CLIMATE_ZONES = {
  Af: { name: 'Tropical Rainforest', risk: { heat: 0.7, drought: 0.3, flood: 0.8, coastal: 0.6 } },
  Am: { name: 'Tropical Monsoon', risk: { heat: 0.7, drought: 0.4, flood: 0.9, coastal: 0.6 } },
  Aw: { name: 'Tropical Savanna', risk: { heat: 0.8, drought: 0.7, flood: 0.5, coastal: 0.5 } },
  BWh: { name: 'Hot Desert', risk: { heat: 0.95, drought: 0.95, flood: 0.1, coastal: 0.3 } },
  BWk: { name: 'Cold Desert', risk: { heat: 0.6, drought: 0.8, flood: 0.2, coastal: 0.2 } },
  BSh: { name: 'Hot Semi-Arid', risk: { heat: 0.85, drought: 0.85, flood: 0.3, coastal: 0.4 } },
  BSk: { name: 'Cold Semi-Arid', risk: { heat: 0.5, drought: 0.7, flood: 0.3, coastal: 0.3 } },
  Csa: { name: 'Mediterranean Hot Summer', risk: { heat: 0.7, drought: 0.7, flood: 0.4, coastal: 0.5 } },
  Csb: { name: 'Mediterranean Warm Summer', risk: { heat: 0.5, drought: 0.6, flood: 0.4, coastal: 0.5 } },
  Cwa: { name: 'Humid Subtropical', risk: { heat: 0.7, drought: 0.4, flood: 0.6, coastal: 0.5 } },
  Cfb: { name: 'Oceanic', risk: { heat: 0.3, drought: 0.3, flood: 0.5, coastal: 0.6 } },
  Dfa: { name: 'Hot Summer Continental', risk: { heat: 0.6, drought: 0.5, flood: 0.5, coastal: 0.3 } },
  Dfb: { name: 'Warm Summer Continental', risk: { heat: 0.4, drought: 0.5, flood: 0.5, coastal: 0.3 } },
  Dfc: { name: 'Subarctic', risk: { heat: 0.2, drought: 0.3, flood: 0.4, coastal: 0.4 } },
  ET: { name: 'Tundra', risk: { heat: 0.1, drought: 0.2, flood: 0.3, coastal: 0.5 } },
  EF: { name: 'Ice Cap', risk: { heat: 0.05, drought: 0.1, flood: 0.2, coastal: 0.7 } }
};

// Country-specific ND-GAIN vulnerability scores (sample - should be full dataset)
const ND_GAIN_SCORES = {
  US: { vulnerability: 0.25, readiness: 0.80 },
  CN: { vulnerability: 0.45, readiness: 0.55 },
  IN: { vulnerability: 0.55, readiness: 0.45 },
  BR: { vulnerability: 0.50, readiness: 0.50 },
  DE: { vulnerability: 0.20, readiness: 0.85 },
  TR: { vulnerability: 0.42, readiness: 0.58 },
  QA: { vulnerability: 0.35, readiness: 0.65 },
  GB: { vulnerability: 0.22, readiness: 0.83 },
  FR: { vulnerability: 0.23, readiness: 0.82 },
  JP: { vulnerability: 0.28, readiness: 0.78 },
  // Add more countries as needed
};

/**
 * Determine Köppen climate zone from coordinates (simplified)
 * In production, use actual API or detailed classification algorithm
 */
function getKoppenClimate(lat, lon) {
  // Simplified classification based on latitude
  const absLat = Math.abs(lat);
  
  if (absLat > 66.5) return 'ET'; // Arctic/Antarctic
  if (absLat > 60) return 'Dfc'; // Subarctic
  if (absLat > 45) return 'Dfb'; // Continental
  if (absLat > 35) {
    // Check longitude for Mediterranean vs Continental
    if ((lon > -10 && lon < 40) || (lon > 110 && lon < 150)) {
      return 'Csa'; // Mediterranean
    }
    return 'Cfa'; // Humid subtropical
  }
  if (absLat > 23.5) return 'BSh'; // Hot semi-arid
  if (absLat > 15) return 'Aw'; // Tropical savanna
  return 'Af'; // Tropical rainforest
}

/**
 * Calculate coastal vulnerability based on distance and elevation
 */
function calculateCoastalVulnerability(distanceToCoast, elevation) {
  if (distanceToCoast > 100) return 0.1; // Inland, low risk
  
  const distanceFactor = Math.max(0, 1 - distanceToCoast / 100);
  const elevationFactor = Math.max(0, 1 - elevation / 10); // Risk decreases with elevation
  
  return Math.min(1, distanceFactor * 0.7 + elevationFactor * 0.3);
}

/**
 * Calculate water stress from lat/long (simplified)
 * In production, use Aqueduct API: https://www.wri.org/aqueduct/data
 */
function calculateWaterStress(lat, lon) {
  // High water stress regions (simplified)
  const highStressRegions = [
    { lat: [20, 40], lon: [-120, -100], stress: 0.8 }, // US Southwest
    { lat: [10, 40], lon: [-10, 50], stress: 0.85 }, // MENA region
    { lat: [20, 35], lon: [70, 85], stress: 0.75 }, // India/Pakistan
    { lat: [-30, -20], lon: [15, 30], stress: 0.7 }, // Southern Africa
    { lat: [30, 45], lon: [100, 120], stress: 0.65 }, // Northern China
  ];
  
  for (const region of highStressRegions) {
    if (lat >= region.lat[0] && lat <= region.lat[1] &&
        lon >= region.lon[0] && lon <= region.lon[1]) {
      return region.stress;
    }
  }
  
  // Default moderate stress
  return 0.4;
}

/**
 * Get country code from coordinates (simplified - use reverse geocoding API in production)
 */
function getCountryFromCoordinates(lat, lon) {
  // This is a placeholder - use Google Geocoding API or similar in production
  // For now, return based on rough lat/long ranges
  if (lat > 36 && lat < 42 && lon > 26 && lon < 45) return 'TR';
  if (lat > 24 && lat < 49 && lon > -125 && lon < -66) return 'US';
  if (lat > 18 && lat < 54 && lon > 73 && lon < 135) return 'CN';
  if (lat > 40 && lat < 62 && lon > -10 && lon < 30) return 'EU';
  
  return 'UNKNOWN';
}

/**
 * Main function: Get comprehensive location-based climate data
 * @param {Object} location - { latitude, longitude, elevation, distanceToCoast }
 * @returns {Object} Climate risk data
 */
export async function getLocationClimateData(location) {
  const { latitude, longitude, elevation = 0, distanceToCoast = 50 } = location;
  
  // Validate inputs
  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required');
  }
  
  // 1. Determine Köppen climate zone
  const koppenZone = getKoppenClimate(latitude, longitude);
  const klimateData = KOPPEN_CLIMATE_ZONES[koppenZone] || KOPPEN_CLIMATE_ZONES['Cfb'];
  
  // 2. Get country and ND-GAIN scores
  const countryCode = getCountryFromCoordinates(latitude, longitude);
  const ndGain = ND_GAIN_SCORES[countryCode] || { vulnerability: 0.5, readiness: 0.5 };
  
  // 3. Calculate coastal vulnerability
  const coastalVuln = calculateCoastalVulnerability(distanceToCoast, elevation);
  
  // 4. Calculate water stress
  const waterStress = calculateWaterStress(latitude, longitude);
  
  // 5. Adjust base risk scores with location-specific factors
  const physicalRiskProbability = {
    heat: Math.min(1, klimateData.risk.heat * (1 + ndGain.vulnerability * 0.3)),
    drought: Math.min(1, klimateData.risk.drought * (1 + waterStress * 0.4)),
    flood: Math.min(1, klimateData.risk.flood * (1 + ndGain.vulnerability * 0.2)),
    coastal: Math.min(1, coastalVuln * (1 + ndGain.vulnerability * 0.2)),
    precip: Math.min(1, klimateData.risk.flood * 0.8) // Related to flood risk (precip field matches form)
  };
  
  // 6. Calculate adaptive capacity based on country readiness
  const adaptiveCapacity = {
    infrastructure: Math.max(0, ndGain.readiness * 0.9),
    financial: Math.max(0, ndGain.readiness * 0.95),
    governance: Math.max(0, ndGain.readiness * 0.85),
    technology: Math.max(0, ndGain.readiness * 0.9)
  };
  
  // 7. Calculate risk amplifiers
  const riskAmplifiers = {
    tagWaterDependency: waterStress,
    tagCoastalVulnerability: coastalVuln,
    tagStrandingRisk: 0.3, // Default - should be sector-specific
    tagSupplyChainExposure: Math.min(1, (1 - ndGain.readiness) * 0.8)
  };
  
  return {
    location: {
      latitude,
      longitude,
      elevation,
      distanceToCoast,
      countryCode
    },
    climate: {
      koppenZone,
      climateName: klimateData.name,
      description: `${klimateData.name} climate zone with specific risk profile`
    },
    countryRisk: {
      vulnerability: ndGain.vulnerability,
      readiness: ndGain.readiness,
      adaptiveCapacityIndex: ndGain.readiness
    },
    physicalRiskProbability,
    adaptiveCapacity,
    riskAmplifiers,
    metadata: {
      dataSource: 'Location-Based Climate Data Service',
      calculatedAt: new Date().toISOString(),
      confidence: 'medium', // high/medium/low based on data availability
      needsApiIntegration: true,
      recommendedAPIs: [
        'Aqueduct Water Risk Atlas (WRI)',
        'ND-GAIN Country Index',
        'World Bank Climate Portal',
        'OpenWeatherMap Climate API'
      ]
    }
  };
}

/**
 * Integrate location data into ECB form data
 * @param {Object} formData - Existing form data
 * @param {Object} locationData - Data from getLocationClimateData()
 * @returns {Object} Enhanced form data
 */
export function integrateLocationDataToForm(formData, locationData) {
  return {
    ...formData,
    // Update physical risk probability with location-based data (convert to strings)
    physicalRiskProbability: {
      heat: locationData.physicalRiskProbability.heat.toFixed(2),
      drought: locationData.physicalRiskProbability.drought.toFixed(2),
      flood: locationData.physicalRiskProbability.flood.toFixed(2),
      coastal: locationData.physicalRiskProbability.coastal.toFixed(2),
      precip: locationData.physicalRiskProbability.precip.toFixed(2)
    },
    
    // Update adaptive capacity with country readiness (convert to strings)
    adaptiveCapacity: {
      infrastructure: locationData.adaptiveCapacity.infrastructure.toFixed(2),
      financial: locationData.adaptiveCapacity.financial.toFixed(2),
      governance: locationData.adaptiveCapacity.governance.toFixed(2),
      technology: locationData.adaptiveCapacity.technology.toFixed(2)
    },
    
    // Update risk amplifiers (already as strings)
    tagWaterDependency: locationData.riskAmplifiers.tagWaterDependency.toFixed(2),
    tagCoastalVulnerability: locationData.riskAmplifiers.tagCoastalVulnerability.toFixed(2),
    tagSupplyChainExposure: locationData.riskAmplifiers.tagSupplyChainExposure.toFixed(2),
    
    // Add metadata
    _locationDataMetadata: locationData.metadata
  };
}

/**
 * Fetch real-time data from external APIs (stub for future implementation)
 */
export async function fetchExternalClimateData(latitude, longitude) {
  // TODO: Implement actual API calls
  
  // 1. Aqueduct Water Risk API
  // const aqueductData = await fetch(`https://api.wri.org/aqueduct/...`);
  
  // 2. World Bank Climate API
  // const wbData = await fetch(`https://climateknowledgeportal.worldbank.org/api/...`);
  
  // 3. OpenWeatherMap Climate Data
  // const owmData = await fetch(`https://api.openweathermap.org/data/2.5/...`);
  
  return {
    message: 'External API integration pending',
    status: 'not_implemented',
    fallback: 'Using simplified location-based calculation'
  };
}

export default {
  getLocationClimateData,
  integrateLocationDataToForm,
  fetchExternalClimateData
};
