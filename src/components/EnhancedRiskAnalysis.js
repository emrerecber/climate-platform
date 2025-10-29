import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { climateRiskCalculator, RiskUtils } from '../services/RiskCalculators';
import DataManager from '../services/DataManager';
import { weatherService } from '../services/WeatherService';
import { useTranslation } from 'react-i18next';

// Demo veri - gerçek projede API'den gelecek
const demoAssets = [
    {
        id: 1,
        name: 'İstanbul Fabrika',
        city: 'İstanbul',
        lat: 41.0082,
        lon: 28.9784,
        value: 25000000,
        riskScore: 7.8,
        category: 'high',
        protection: 2,
        employeeCount: 150,
        transitionScores: {
            directEmissions: 3,
            indirectEmissions: 2,
            investmentCost: 3,
            revenueImpact: 2,
            restrictionCost: 2,
            governance: 1,
            innovationRD: 2
        },
        physicalData: {
            hazards: {
                flood: 3.5,
                heatwave: 2.8,
                drought: 2.1,
                storm: 3.2
            },
            sensitivity: 3.5,
            adaptiveCapacity: 2.5
        }
    },
    {
        id: 2,
        name: 'Ankara Depo',
        city: 'Ankara',
        lat: 39.9334,
        lon: 32.8597,
        value: 15000000,
        riskScore: 4.2,
        category: 'medium',
        protection: 3,
        employeeCount: 50,
        transitionScores: {
            directEmissions: 2,
            indirectEmissions: 2,
            investmentCost: 1,
            revenueImpact: 2,
            restrictionCost: 1,
            governance: 2,
            innovationRD: 2
        },
        physicalData: {
            hazards: {
                flood: 2.1,
                heatwave: 3.8,
                drought: 4.2,
                storm: 2.5
            },
            sensitivity: 2.8,
            adaptiveCapacity: 3.5
        }
    }
];

const EnhancedRiskAnalysis = () => {
    const { t } = useTranslation();
    const [assets, setAssets] = useState(demoAssets);
    const [portfolioAnalysis, setPortfolioAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [weatherUpdating, setWeatherUpdating] = useState(false);
    const [stressTesting, setStressTesting] = useState(false);
    const [stressResults, setStressResults] = useState(null);

    // Component mount'ta analiz yap
    useEffect(() => {
        performPortfolioAnalysis();
    }, [assets]);

    const performPortfolioAnalysis = () => {
        setLoading(true);
        const analysis = climateRiskCalculator.calculatePortfolioRisk(assets);
        setPortfolioAnalysis(analysis);
        setLoading(false);
    };

    // Hava durumu ile risk güncelleme
    const updateWithWeatherData = async () => {
        setWeatherUpdating(true);
        try {
            const result = await weatherService.updateAssetsWithWeather(assets, (progress) => {
                console.log(`İlerleme: ${progress.completed}/${progress.total} - ${progress.currentAsset}`);
            });

            if (result.updatedAssets) {
                setAssets(result.updatedAssets);
                DataManager.save('climateRiskAssets', result.updatedAssets);
            }
        } catch (error) {
            console.error('Hava durumu güncellemesi başarısız:', error);
        }
        setWeatherUpdating(false);
    };

    // Stres testi uygula
    const runStressTest = (scenarioType) => {
        setStressTesting(true);
        
        // Senaryo tanımları
        const scenarios = {
            heatwave: {
                name: 'Aşırı Sıcaklık (+5°C)',
                hazards: ['heatwave'],
                impact: 1.25
            },
            flood: {
                name: 'Şiddetli Yağış (+50%)',
                hazards: ['flood'],
                impact: 1.5
            },
            carbonPrice: {
                name: 'Karbon Fiyat Şoku (€100/ton)',
                transitionFactors: ['directEmissions', 'indirectEmissions'],
                impact: 1.4
            }
        };

        const scenario = scenarios[scenarioType];
        const results = [];

        assets.forEach(asset => {
            let stressedAsset = JSON.parse(JSON.stringify(asset));
            
            // Fiziksel hazard'ları strese sokma
            if (scenario.hazards) {
                scenario.hazards.forEach(hazard => {
                    if (stressedAsset.physicalData?.hazards[hazard]) {
                        stressedAsset.physicalData.hazards[hazard] *= scenario.impact;
                        stressedAsset.physicalData.hazards[hazard] = Math.min(5, stressedAsset.physicalData.hazards[hazard]);
                    }
                });
            }

            // Geçiş riski faktörlerini strese sokma
            if (scenario.transitionFactors) {
                scenario.transitionFactors.forEach(factor => {
                    if (stressedAsset.transitionScores?.[factor]) {
                        stressedAsset.transitionScores[factor] = Math.min(3,
                            Math.ceil(stressedAsset.transitionScores[factor] * scenario.impact)
                        );
                    }
                });
            }

            const originalAnalysis = climateRiskCalculator.calculateAssetRisk(asset);
            const stressedAnalysis = climateRiskCalculator.calculateAssetRisk(stressedAsset);

            results.push({
                asset: asset.name,
                original: originalAnalysis.combinedScore,
                stressed: stressedAnalysis.combinedScore,
                impact: stressedAnalysis.combinedScore - originalAnalysis.combinedScore
            });
        });

        setStressResults({
            scenario: scenario.name,
            results,
            summary: {
                avgImpact: results.reduce((sum, r) => sum + r.impact, 0) / results.length,
                maxImpact: Math.max(...results.map(r => r.impact)),
                affectedAssets: results.filter(r => r.impact > 0.5).length
            }
        });

        setStressTesting(false);
    };

    if (loading || !portfolioAnalysis) {
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '400px',
                flexDirection: 'column' 
            }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌡️</div>
                <p>Risk analizi gerçekleştiriliyor...</p>
            </div>
        );
    }

    const { portfolioStats, assetResults, recommendations } = portfolioAnalysis;

    // Grafik verilerini hazırla
    const riskDistributionData = {
        labels: [t('highRisk'), t('mediumRisk'), t('lowRisk')],
        datasets: [{
            data: [
                portfolioStats.riskDistribution.high,
                portfolioStats.riskDistribution.medium,
                portfolioStats.riskDistribution.low
            ],
            backgroundColor: ['#dc3545', '#ffc107', '#28a745'],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };

    const riskTrendData = {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025P'],
        datasets: [
            {
                label: t('portfolioRiskScore'),
                data: [2.15, 2.08, 2.02, 1.96, 1.91, 1.85],
                borderColor: '#0066cc',
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                fill: true
            },
            {
                label: t('sectorAverage'),
                data: [2.25, 2.20, 2.15, 2.10, 2.05, 2.00],
                borderColor: '#6c757d',
                backgroundColor: 'rgba(108, 117, 125, 0.1)',
                fill: false
            }
        ]
    };

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ marginBottom: '8px', color: '#dc2626' }}>
                        🌡️ {t('advancedClimateRiskAnalysis')}
                    </h1>
                    <p style={{ color: '#666' }}>
                        {t('xBankMethodology')}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={updateWithWeatherData}
                        disabled={weatherUpdating}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: weatherUpdating ? '#6c757d' : '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: weatherUpdating ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        {weatherUpdating ? `🌀 ${t('updating')}` : `🌤️ ${t('updateWeather')}`}
                    </button>
                    <button
                        onClick={performPortfolioAnalysis}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        🔄 {t('refreshAnalysis')}
                    </button>
                </div>
            </div>

            {/* KPI Kartları */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '20px', 
                marginBottom: '30px' 
            }}>
                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '12px',
                    borderLeft: '4px solid #dc3545'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc3545', marginBottom: '8px' }}>
                        {portfolioStats.totalAssets}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6c757d' }}>{t('totalAssets')}</div>
                </div>

                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '12px',
                    borderLeft: '4px solid #ffc107'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107', marginBottom: '8px' }}>
                        {portfolioStats.avgRiskScore}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6c757d' }}>{t('avgRiskScoreFull')}</div>
                </div>

                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '12px',
                    borderLeft: '4px solid #28a745'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745', marginBottom: '8px' }}>
                        €{RiskUtils.formatMoney(portfolioStats.totalValue)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6c757d' }}>{t('totalValue')}</div>
                </div>

                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '12px',
                    borderLeft: '4px solid #17a2b8'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#17a2b8', marginBottom: '8px' }}>
                        {portfolioStats.riskDistribution.high}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6c757d' }}>{t('highRiskFull')}</div>
                </div>
            </div>

            {/* Grafikler */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '30px'
            }}>
                {/* Risk Dağılımı */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>{t('riskDistribution')}</h3>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pie
                            data={riskDistributionData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Risk Trendi */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>{t('riskTrendAnalysis')}</h3>
                    <div style={{ height: '300px' }}>
                        <Line
                            data={riskTrendData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: false,
                                        min: 1.5
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Stres Testi */}
            <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                marginBottom: '30px'
            }}>
                <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>⚡ {t('stressTestScenarios')}</h3>
                
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <button
                        onClick={() => runStressTest('heatwave')}
                        disabled={stressTesting}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: stressTesting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        🌡️ {t('extremeHeat')}
                    </button>
                    <button
                        onClick={() => runStressTest('flood')}
                        disabled={stressTesting}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: stressTesting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        🌧️ {t('severeRainfall')}
                    </button>
                    <button
                        onClick={() => runStressTest('carbonPrice')}
                        disabled={stressTesting}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6f42c1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: stressTesting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        💰 {t('carbonPriceShock')}
                    </button>
                </div>

                {stressTesting && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
                        <p>{t('stressTestRunning')}</p>
                    </div>
                )}

                {stressResults && (
                    <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '20px', 
                        borderRadius: '8px' 
                    }}>
                        <h4 style={{ marginBottom: '15px' }}>{stressResults.scenario} {t('stressTestResults')}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                                    {stressResults.summary.affectedAssets}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('affectedAssets')}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                                    +{stressResults.summary.avgImpact.toFixed(2)}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('avgImpact')}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
                                    +{stressResults.summary.maxImpact.toFixed(2)}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('maxImpact')}</div>
                            </div>
                        </div>

                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {stressResults.results.map((result, index) => (
                                <div key={index} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    padding: '8px 0', 
                                    borderBottom: '1px solid #dee2e6' 
                                }}>
                                    <span>{result.asset}</span>
                                    <div>
                                        <span style={{ color: '#6c757d', marginRight: '10px' }}>
                                            {result.original.toFixed(2)} → {result.stressed.toFixed(2)}
                                        </span>
                                        <span style={{ 
                                            color: result.impact > 0.5 ? '#dc3545' : '#28a745',
                                            fontWeight: 'bold' 
                                        }}>
                                            {result.impact > 0 ? '+' : ''}{result.impact.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Öneriler */}
            {recommendations && recommendations.length > 0 && (
                <div style={{
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>💡 {t('riskManagementRecommendations')}</h3>
                    
                    {recommendations.map((rec, index) => (
                        <div key={index} style={{
                            backgroundColor: rec.priority === 'high' ? '#fff5f5' : '#f0f9ff',
                            border: `1px solid ${rec.priority === 'high' ? '#fecaca' : '#bfdbfe'}`,
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '15px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                                <div style={{ 
                                    fontSize: '24px', 
                                    color: rec.priority === 'high' ? '#dc3545' : '#0ea5e9' 
                                }}>
                                    {rec.priority === 'high' ? '🚨' : 'ℹ️'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{rec.title}</h4>
                                    <p style={{ margin: '0 0 15px 0', color: '#666' }}>{rec.description}</p>
                                    <div>
                                        <strong style={{ fontSize: '14px', color: '#495057' }}>{t('actions')}:</strong>
                                        <ul style={{ margin: '8px 0 0 20px', color: '#6c757d' }}>
                                            {rec.actions.map((action, i) => (
                                                <li key={i} style={{ marginBottom: '4px' }}>{action}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnhancedRiskAnalysis;