// utils/riskCalculator.js
const RiskCalculator = {
  // Ana hesaplama fonksiyonu
  calculateRiskScores: (formData) => {
    const transitionRisk = calculateTransitionRisk(formData);
    const physicalRisk = calculatePhysicalRisk(formData);
    const totalRisk = (transitionRisk + physicalRisk) / 2;
    
    const pactaScores = calculatePactaScores(formData);
    
    return {
      transitionRisk: transitionRisk.toFixed(2),
      physicalRisk: physicalRisk.toFixed(2),
      totalRisk: totalRisk.toFixed(2),
      riskCategory: getRiskCategory(totalRisk),
      details: {
        transitionComponents: getTransitionRiskBreakdown(formData),
        physicalComponents: getPhysicalRiskBreakdown(formData)
      },
      // PACTA skorları
      pactaTechnologyAlignment: pactaScores.technologyAlignment,
      pactaScenarioDeviation: pactaScores.scenarioDeviation,
      pacta2030Readiness: pactaScores.readiness2030,
      pactaParisAlignment: pactaScores.parisAlignment
    };
  }
};

// Geçiş Riski Hesaplama
const calculateTransitionRisk = (data) => {
  let score = 0;
  
  // Karbon Yoğunluğu (0-1.5 puan)
  const carbonIntensity = (parseFloat(data.scope1Emissions) + parseFloat(data.scope2Emissions)) / parseFloat(data.annualRevenue);
  if (carbonIntensity > 200) score += 1.5;
  else if (carbonIntensity > 100) score += 1.0;
  else if (carbonIntensity > 50) score += 0.5;
  
  // Yenilenebilir Enerji (0-1 puan)
  const renewableRatio = parseFloat(data.renewableEnergyRatio) || 0;
  if (renewableRatio < 10) score += 1.0;
  else if (renewableRatio < 30) score += 0.7;
  else if (renewableRatio < 50) score += 0.4;
  
  // CBAM Maruziyeti (0-1 puan)
  if (data.cbamExposure === 'high') score += 1.0;
  else if (data.cbamExposure === 'medium') score += 0.6;
  else if (data.cbamExposure === 'low') score += 0.3;
  
  // Yeşil Gelir Oranı (0-0.5 puan)
  const greenRevenue = parseFloat(data.greenRevenueRatio) || 0;
  if (greenRevenue < 5) score += 0.5;
  else if (greenRevenue < 20) score += 0.3;
  else if (greenRevenue < 40) score += 0.1;
  
  // İklim Hedefleri (0-1 puan)
  if (!data.netZeroTarget || data.netZeroTarget === 'none') score += 1.0;
  else if (data.netZeroTarget === '2050') score += 0.3;
  else if (data.netZeroTarget === '2040') score += 0.1;
  
  return Math.min(5, Math.max(1, score));
};

// Fiziksel Risk Hesaplama
const calculatePhysicalRisk = (data) => {
  let score = 0;
  
  // Sel Riski (0-1 puan)
  if (data.floodRisk === 'high') score += 1.0;
  else if (data.floodRisk === 'medium') score += 0.6;
  else if (data.floodRisk === 'low') score += 0.2;
  
  // Kuraklık Riski (0-1 puan)
  if (data.droughtRisk === 'high') score += 1.0;
  else if (data.droughtRisk === 'medium') score += 0.6;
  else if (data.droughtRisk === 'low') score += 0.2;
  
  // Aşırı Sıcak Riski (0-0.8 puan)
  if (data.heatWaveRisk === 'high') score += 0.8;
  else if (data.heatWaveRisk === 'medium') score += 0.5;
  else if (data.heatWaveRisk === 'low') score += 0.2;
  
  // Lokasyon bazlı ek risk (0-0.7 puan)
  // Türkiye için ortalama fiziksel risk
  score += 0.7;
  
  // Senaryo analizi yapılmamışsa ek risk (0-0.5 puan)
  if (data.climateScenarioAnalysis === 'no') score += 0.5;
  else if (data.climateScenarioAnalysis === 'yes-partial') score += 0.2;
  
  return Math.min(5, Math.max(1, score));
};

// Risk Kategorisi Belirleme
const getRiskCategory = (totalRisk) => {
  if (totalRisk < 1.5) return 'Low';
  if (totalRisk < 2.5) return 'Medium';
  return 'High';
};

// Detaylı Risk Bileşenleri
const getTransitionRiskBreakdown = (data) => {
  return {
    carbonIntensity: {
      label: 'Karbon Yoğunluğu',
      value: ((parseFloat(data.scope1Emissions) + parseFloat(data.scope2Emissions)) / parseFloat(data.annualRevenue)).toFixed(2),
      unit: 'tCO₂/milyon TL',
      weight: '30%'
    },
    renewableEnergy: {
      label: 'Yenilenebilir Enerji',
      value: data.renewableEnergyRatio || '0',
      unit: '%',
      weight: '20%'
    },
    cbamExposure: {
      label: 'CBAM Maruziyeti',
      value: data.cbamExposure || 'Belirtilmemiş',
      unit: '',
      weight: '20%'
    },
    greenRevenue: {
      label: 'Yeşil Gelir',
      value: data.greenRevenueRatio || '0',
      unit: '%',
      weight: '10%'
    },
    climateTargets: {
      label: 'İklim Hedefleri',
      value: data.netZeroTarget || 'Yok',
      unit: '',
      weight: '20%'
    }
  };
};

const getPhysicalRiskBreakdown = (data) => {
  return {
    flooding: {
      label: 'Sel Riski',
      value: data.floodRisk || 'Belirtilmemiş',
      weight: '25%'
    },
    drought: {
      label: 'Kuraklık Riski',
      value: data.droughtRisk || 'Belirtilmemiş',
      weight: '25%'
    },
    heatWave: {
      label: 'Aşırı Sıcak',
      value: data.heatWaveRisk || 'Belirtilmemiş',
      weight: '20%'
    },
    locationRisk: {
      label: 'Lokasyon Riski',
      value: 'Türkiye - Orta/Yüksek',
      weight: '20%'
    },
    scenarioAnalysis: {
      label: 'Senaryo Analizi',
      value: data.climateScenarioAnalysis === 'no' ? 'Yapılmamış' : 'Yapılmış',
      weight: '10%'
    }
  };
};

// PACTA Skorları Hesaplama
const calculatePactaScores = (data) => {
  return {
    technologyAlignment: calculateTechnologyAlignment(data),
    scenarioDeviation: calculateScenarioDeviation(data),
    readiness2030: calculate2030Readiness(data),
    parisAlignment: calculateParisAlignment(data)
  };
};

// Teknoloji Uyumu Hesaplama
const calculateTechnologyAlignment = (data) => {
  let alignment = 50; // Başlangıç puanı
  
  // Enerji sektörü için
  if (data.sector === 'Enerji') {
    const totalCapacity = parseFloat(data.totalInstalledCapacity) || 1;
    const renewableCapacity = (
      (parseFloat(data.windCapacity) || 0) +
      (parseFloat(data.solarCapacity) || 0) +
      (parseFloat(data.hydroCapacity) || 0) +
      (parseFloat(data.biomassCapacity) || 0) +
      (parseFloat(data.geothermalCapacity) || 0)
    );
    const renewableRatio = (renewableCapacity / totalCapacity) * 100;
    
    if (renewableRatio > 70) alignment += 30;
    else if (renewableRatio > 50) alignment += 20;
    else if (renewableRatio > 30) alignment += 10;
    else if (renewableRatio < 10) alignment -= 20;
  }
  
  // Otomotiv sektörü için
  if (data.sector === 'Otomotiv') {
    const totalProduction = parseFloat(data.annualTotalProduction) || 1;
    const evProduction = (
      (parseFloat(data.bevProduction) || 0) +
      (parseFloat(data.phevProduction) || 0) +
      (parseFloat(data.fcevProduction) || 0)
    );
    const evRatio = (evProduction / totalProduction) * 100;
    
    if (evRatio > 50) alignment += 25;
    else if (evRatio > 30) alignment += 15;
    else if (evRatio > 15) alignment += 5;
    else if (evRatio < 5) alignment -= 15;
  }
  
  // Yatırım uyumu
  const greenTechRatio = parseFloat(data.greenTechInvestmentRatio) || 0;
  if (greenTechRatio > 60) alignment += 15;
  else if (greenTechRatio > 40) alignment += 10;
  else if (greenTechRatio > 20) alignment += 5;
  
  return Math.max(0, Math.min(100, Math.round(alignment)));
};

// Senaryo Sapması Hesaplama
const calculateScenarioDeviation = (data) => {
  let deviation = 0; // Sıfır sapma ideal
  
  // Referans senaryo kontrolü
  if (data.referenceScenario === 'iea-nze') {
    deviation -= 5; // 1.5°C senaryosu daha iyi
  } else if (data.referenceScenario === 'iea-sds') {
    deviation += 0; // 2°C senaryosu orta
  } else {
    deviation += 10; // Belirtilmemiş ise olumsuz
  }
  
  // Karbon bütçesi uyumu
  if (data.carbonBudgetCompliance === 'compliant') {
    deviation -= 5;
  } else if (data.carbonBudgetCompliance === 'partially-compliant') {
    deviation += 0;
  } else {
    deviation += 8;
  }
  
  // 2030 projeksiyonları
  const projection2030 = parseFloat(data.productionProjection2030) || 0;
  if (projection2030 > 20) deviation += 10; // Aşırı büyüme olumsuz
  else if (projection2030 < -10) deviation += 5; // Daralırıken bile risk
  
  return Math.max(-20, Math.min(20, Math.round(deviation)));
};

// 2030 Hazırlık Skoru
const calculate2030Readiness = (data) => {
  let score = 50; // C notu başlangıç
  
  // Ar-Ge yatırımı
  const rdBudget = parseFloat(data.rdBudget) || 0;
  if (rdBudget > 50) score += 20;
  else if (rdBudget > 25) score += 15;
  else if (rdBudget > 10) score += 10;
  else if (rdBudget > 5) score += 5;
  
  // Yeşil teknoloji oranı
  const greenTech = parseFloat(data.greenTechInvestmentRatio) || 0;
  if (greenTech > 60) score += 15;
  else if (greenTech > 40) score += 10;
  else if (greenTech > 20) score += 5;
  
  // Planlanan yatırımlar
  const investments = parseFloat(data.plannedInvestments) || 0;
  if (investments > 500) score += 10;
  else if (investments > 250) score += 7;
  else if (investments > 100) score += 5;
  
  // Fosil kapasitesi kapatma planı
  if (data.fossilCapacityToClose && data.fossilCapacityToClose.length > 10) {
    score += 10;
  }
  
  // Dekarbonizasyon yol haritası
  if (data.decarbonizationRoadmap && data.decarbonizationRoadmap.length > 50) {
    score += 5;
  }
  
  // Skoru harfe çevir
  if (score >= 85) return 'A+';
  else if (score >= 80) return 'A';
  else if (score >= 75) return 'A-';
  else if (score >= 70) return 'B+';
  else if (score >= 65) return 'B';
  else if (score >= 60) return 'B-';
  else if (score >= 55) return 'C+';
  else if (score >= 50) return 'C';
  else if (score >= 45) return 'C-';
  else if (score >= 40) return 'D+';
  else if (score >= 35) return 'D';
  else return 'F';
};

// Paris Anlaşması Uyumu (°C)
const calculateParisAlignment = (data) => {
  let temperature = 3.5; // Şu anki politikalar senaryosu
  
  // Enerji sektörü iyileştirmeleri
  if (data.sector === 'Enerji') {
    const totalCapacity = parseFloat(data.totalInstalledCapacity) || 1;
    const fossilCapacity = (
      (parseFloat(data.coalCapacity) || 0) +
      (parseFloat(data.naturalGasCapacity) || 0) +
      (parseFloat(data.oilCapacity) || 0)
    );
    const fossilRatio = (fossilCapacity / totalCapacity) * 100;
    
    if (fossilRatio < 10) temperature -= 1.0;
    else if (fossilRatio < 30) temperature -= 0.7;
    else if (fossilRatio < 50) temperature -= 0.4;
    else if (fossilRatio > 80) temperature += 0.3;
  }
  
  // Otomotiv sektörü iyileştirmeleri
  if (data.sector === 'Otomotiv') {
    const totalProduction = parseFloat(data.annualTotalProduction) || 1;
    const iceProduction = parseFloat(data.iceProduction) || 0;
    const iceRatio = (iceProduction / totalProduction) * 100;
    
    if (iceRatio < 20) temperature -= 0.8;
    else if (iceRatio < 50) temperature -= 0.5;
    else if (iceRatio < 70) temperature -= 0.2;
    else if (iceRatio > 90) temperature += 0.2;
  }
  
  // Genel iyileştirmeler
  const greenInvestments = parseFloat(data.greenTechInvestmentRatio) || 0;
  if (greenInvestments > 70) temperature -= 0.4;
  else if (greenInvestments > 50) temperature -= 0.3;
  else if (greenInvestments > 30) temperature -= 0.1;
  
  // Senaryo uyumu
  if (data.referenceScenario === 'iea-nze') temperature -= 0.5;
  else if (data.referenceScenario === 'iea-sds') temperature -= 0.2;
  
  return Math.max(1.5, Math.min(4.0, parseFloat(temperature.toFixed(1))));
};

export default RiskCalculator;
