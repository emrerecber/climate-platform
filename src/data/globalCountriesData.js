/**
 * Global Countries and Regions Climate Data
 * 
 * Comprehensive dataset for worldwide climate risk assessment
 * Includes ND-GAIN scores, regional classifications, and default risk profiles
 * 
 * Data sources:
 * - ND-GAIN Index (University of Notre Dame)
 * - World Bank Country Classification
 * - UN Regional Groups
 */

export const GLOBAL_COUNTRIES = {
  // North America
  US: {
    name: 'United States',
    region: 'North America',
    currency: 'USD',
    ndGain: { vulnerability: 0.25, readiness: 0.80 },
    avgCoastalDistance: 150,
    primaryRisks: ['heat', 'flood', 'coastal']
  },
  CA: {
    name: 'Canada',
    region: 'North America',
    currency: 'CAD',
    ndGain: { vulnerability: 0.20, readiness: 0.85 },
    avgCoastalDistance: 200,
    primaryRisks: ['heat', 'flood']
  },
  MX: {
    name: 'Mexico',
    region: 'North America',
    currency: 'MXN',
    ndGain: { vulnerability: 0.48, readiness: 0.52 },
    avgCoastalDistance: 100,
    primaryRisks: ['heat', 'drought', 'coastal']
  },
  
  // Europe
  DE: {
    name: 'Germany',
    region: 'Europe',
    currency: 'EUR',
    ndGain: { vulnerability: 0.20, readiness: 0.85 },
    avgCoastalDistance: 250,
    primaryRisks: ['flood', 'heat']
  },
  FR: {
    name: 'France',
    region: 'Europe',
    currency: 'EUR',
    ndGain: { vulnerability: 0.23, readiness: 0.82 },
    avgCoastalDistance: 150,
    primaryRisks: ['heat', 'coastal']
  },
  GB: {
    name: 'United Kingdom',
    region: 'Europe',
    currency: 'GBP',
    ndGain: { vulnerability: 0.22, readiness: 0.83 },
    avgCoastalDistance: 80,
    primaryRisks: ['flood', 'coastal']
  },
  IT: {
    name: 'Italy',
    region: 'Europe',
    currency: 'EUR',
    ndGain: { vulnerability: 0.27, readiness: 0.75 },
    avgCoastalDistance: 120,
    primaryRisks: ['heat', 'drought', 'coastal']
  },
  ES: {
    name: 'Spain',
    region: 'Europe',
    currency: 'EUR',
    ndGain: { vulnerability: 0.28, readiness: 0.74 },
    avgCoastalDistance: 130,
    primaryRisks: ['heat', 'drought', 'coastal']
  },
  NL: {
    name: 'Netherlands',
    region: 'Europe',
    currency: 'EUR',
    ndGain: { vulnerability: 0.21, readiness: 0.84 },
    avgCoastalDistance: 40,
    primaryRisks: ['coastal', 'flood']
  },
  
  // Middle East & North Africa
  TR: {
    name: 'Turkey',
    region: 'Middle East',
    currency: 'TRY',
    ndGain: { vulnerability: 0.42, readiness: 0.58 },
    avgCoastalDistance: 180,
    primaryRisks: ['heat', 'drought', 'flood']
  },
  SA: {
    name: 'Saudi Arabia',
    region: 'Middle East',
    currency: 'SAR',
    ndGain: { vulnerability: 0.38, readiness: 0.62 },
    avgCoastalDistance: 200,
    primaryRisks: ['heat', 'drought']
  },
  AE: {
    name: 'United Arab Emirates',
    region: 'Middle East',
    currency: 'AED',
    ndGain: { vulnerability: 0.32, readiness: 0.68 },
    avgCoastalDistance: 60,
    primaryRisks: ['heat', 'drought', 'coastal']
  },
  QA: {
    name: 'Qatar',
    region: 'Middle East',
    currency: 'QAR',
    ndGain: { vulnerability: 0.35, readiness: 0.65 },
    avgCoastalDistance: 30,
    primaryRisks: ['heat', 'coastal', 'drought']
  },
  EG: {
    name: 'Egypt',
    region: 'North Africa',
    currency: 'EGP',
    ndGain: { vulnerability: 0.55, readiness: 0.45 },
    avgCoastalDistance: 250,
    primaryRisks: ['heat', 'drought', 'coastal']
  },
  
  // Asia-Pacific
  CN: {
    name: 'China',
    region: 'Asia',
    currency: 'CNY',
    ndGain: { vulnerability: 0.45, readiness: 0.55 },
    avgCoastalDistance: 300,
    primaryRisks: ['flood', 'drought', 'coastal']
  },
  JP: {
    name: 'Japan',
    region: 'Asia',
    currency: 'JPY',
    ndGain: { vulnerability: 0.28, readiness: 0.78 },
    avgCoastalDistance: 80,
    primaryRisks: ['coastal', 'flood', 'precipitation']
  },
  IN: {
    name: 'India',
    region: 'Asia',
    currency: 'INR',
    ndGain: { vulnerability: 0.55, readiness: 0.45 },
    avgCoastalDistance: 200,
    primaryRisks: ['heat', 'flood', 'drought']
  },
  KR: {
    name: 'South Korea',
    region: 'Asia',
    currency: 'KRW',
    ndGain: { vulnerability: 0.30, readiness: 0.72 },
    avgCoastalDistance: 100,
    primaryRisks: ['coastal', 'flood']
  },
  SG: {
    name: 'Singapore',
    region: 'Asia',
    currency: 'SGD',
    ndGain: { vulnerability: 0.24, readiness: 0.82 },
    avgCoastalDistance: 5,
    primaryRisks: ['coastal', 'heat']
  },
  AU: {
    name: 'Australia',
    region: 'Oceania',
    currency: 'AUD',
    ndGain: { vulnerability: 0.26, readiness: 0.78 },
    avgCoastalDistance: 250,
    primaryRisks: ['heat', 'drought', 'coastal']
  },
  NZ: {
    name: 'New Zealand',
    region: 'Oceania',
    currency: 'NZD',
    ndGain: { vulnerability: 0.24, readiness: 0.80 },
    avgCoastalDistance: 100,
    primaryRisks: ['coastal', 'flood']
  },
  
  // Latin America
  BR: {
    name: 'Brazil',
    region: 'South America',
    currency: 'BRL',
    ndGain: { vulnerability: 0.50, readiness: 0.50 },
    avgCoastalDistance: 280,
    primaryRisks: ['flood', 'drought', 'heat']
  },
  AR: {
    name: 'Argentina',
    region: 'South America',
    currency: 'ARS',
    ndGain: { vulnerability: 0.46, readiness: 0.54 },
    avgCoastalDistance: 300,
    primaryRisks: ['flood', 'drought']
  },
  CL: {
    name: 'Chile',
    region: 'South America',
    currency: 'CLP',
    ndGain: { vulnerability: 0.40, readiness: 0.60 },
    avgCoastalDistance: 100,
    primaryRisks: ['drought', 'coastal']
  },
  CO: {
    name: 'Colombia',
    region: 'South America',
    currency: 'COP',
    ndGain: { vulnerability: 0.52, readiness: 0.48 },
    avgCoastalDistance: 180,
    primaryRisks: ['flood', 'precipitation']
  },
  
  // Africa
  ZA: {
    name: 'South Africa',
    region: 'Africa',
    currency: 'ZAR',
    ndGain: { vulnerability: 0.48, readiness: 0.52 },
    avgCoastalDistance: 200,
    primaryRisks: ['drought', 'heat', 'coastal']
  },
  NG: {
    name: 'Nigeria',
    region: 'Africa',
    currency: 'NGN',
    ndGain: { vulnerability: 0.62, readiness: 0.38 },
    avgCoastalDistance: 150,
    primaryRisks: ['flood', 'heat']
  },
  KE: {
    name: 'Kenya',
    region: 'Africa',
    currency: 'KES',
    ndGain: { vulnerability: 0.58, readiness: 0.42 },
    avgCoastalDistance: 200,
    primaryRisks: ['drought', 'heat', 'flood']
  }
};

// Regional groupings for broader analysis
export const REGIONS = {
  'North America': {
    countries: ['US', 'CA', 'MX'],
    avgVulnerability: 0.31,
    avgReadiness: 0.72
  },
  'Europe': {
    countries: ['DE', 'FR', 'GB', 'IT', 'ES', 'NL'],
    avgVulnerability: 0.24,
    avgReadiness: 0.80
  },
  'Middle East': {
    countries: ['TR', 'SA', 'AE', 'QA'],
    avgVulnerability: 0.37,
    avgReadiness: 0.63
  },
  'Asia': {
    countries: ['CN', 'JP', 'IN', 'KR', 'SG'],
    avgVulnerability: 0.36,
    avgReadiness: 0.66
  },
  'Oceania': {
    countries: ['AU', 'NZ'],
    avgVulnerability: 0.25,
    avgReadiness: 0.79
  },
  'South America': {
    countries: ['BR', 'AR', 'CL', 'CO'],
    avgVulnerability: 0.47,
    avgReadiness: 0.53
  },
  'Africa': {
    countries: ['ZA', 'NG', 'KE', 'EG'],
    avgVulnerability: 0.56,
    avgReadiness: 0.44
  }
};

/**
 * Get country data by ISO code
 */
export function getCountryData(countryCode) {
  return GLOBAL_COUNTRIES[countryCode] || {
    name: 'Unknown',
    region: 'Unknown',
    currency: 'USD',
    ndGain: { vulnerability: 0.5, readiness: 0.5 },
    avgCoastalDistance: 150,
    primaryRisks: ['heat', 'flood']
  };
}

/**
 * Get all countries in a region
 */
export function getCountriesByRegion(region) {
  return Object.entries(GLOBAL_COUNTRIES)
    .filter(([_, data]) => data.region === region)
    .map(([code, data]) => ({ code, ...data }));
}

/**
 * Get region data by name
 */
export function getRegionData(regionName) {
  return REGIONS[regionName] || null;
}

export default {
  GLOBAL_COUNTRIES,
  REGIONS,
  getCountryData,
  getCountriesByRegion,
  getRegionData
};
