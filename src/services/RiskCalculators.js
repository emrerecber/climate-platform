// RiskCalculators.js - X Bank metodolojisi ile risk hesaplama
// İklim risk projesinden adapt edilmiştir

// ==========================================
// GEÇİŞ RİSKİ HESAPLAYICI (Transition Risk)
// ==========================================
export class TransitionRiskCalculator {
    constructor() {
        this.weights = {
            directEmissions: 0.18,      // Doğrudan emisyonlar
            indirectEmissions: 0.10,    // Dolaylı emisyonlar  
            investmentCost: 0.25,       // Yatırım maliyeti
            revenueImpact: 0.23,        // Gelir etkisi
            restrictionCost: 0.12,      // Kısıtlama maliyeti
            governance: 0.06,           // Yönetişim
            innovationRD: 0.08          // İnovasyon & Ar-Ge
        };
    }

    calculateRisk(scores) {
        let totalScore = 0;
        let weightedScore = 0;

        Object.keys(this.weights).forEach(factor => {
            const score = scores[factor] || 2; // Default orta risk
            totalScore += score;
            weightedScore += score * this.weights[factor];
        });

        // Risk kategorisini belirle
        let category;
        if (totalScore <= 12) {
            category = 'low';
        } else if (totalScore <= 17) {
            category = 'medium';
        } else {
            category = 'high';
        }

        return {
            totalScore,
            weightedScore: parseFloat(weightedScore.toFixed(2)),
            category,
            breakdown: this.calculateBreakdown(scores)
        };
    }

    calculateBreakdown(scores) {
        const breakdown = {};
        Object.keys(this.weights).forEach(factor => {
            const score = scores[factor] || 2;
            breakdown[factor] = {
                score,
                weight: this.weights[factor],
                weightedValue: parseFloat((score * this.weights[factor]).toFixed(3))
            };
        });
        return breakdown;
    }

    getFactorLabels() {
        return {
            directEmissions: 'Doğrudan Emisyonlar',
            indirectEmissions: 'Dolaylı Emisyonlar',
            investmentCost: 'Yatırım Maliyeti',
            revenueImpact: 'Gelir Etkisi',
            restrictionCost: 'Kısıtlama Maliyeti',
            governance: 'Yönetişim',
            innovationRD: 'İnovasyon & Ar-Ge'
        };
    }
}

// ==========================================
// FİZİKSEL RİSK HESAPLAYICI (Physical Risk - PCRS)
// ==========================================
export class PhysicalRiskCalculator {
    constructor() {
        this.hazardWeights = {
            flood: 0.3,         // Sel/Taşkın
            heatwave: 0.25,     // Aşırı sıcaklık
            drought: 0.25,      // Kuraklık
            storm: 0.2          // Fırtına
        };
    }

    calculatePCRS(hazards, sensitivity, adaptiveCapacity) {
        // Tehlike ortalamasını ağırlıklı olarak hesapla
        let weightedHazardScore = 0;
        Object.keys(this.hazardWeights).forEach(hazard => {
            const hazardScore = hazards[hazard] || 3.0;
            weightedHazardScore += hazardScore * this.hazardWeights[hazard];
        });

        // PCRS formülü: (Weighted Hazard * 0.5) + (Sensitivity * 0.3) - (Adaptive Capacity * 0.2)
        const pcrs = (weightedHazardScore * 0.5) + (sensitivity * 0.3) - (adaptiveCapacity * 0.2);
        const finalScore = Math.max(1, Math.min(5, pcrs));
        
        // Kategori belirleme
        let category;
        if (finalScore < 2.75) {
            category = 'low';
        } else if (finalScore < 4.25) {
            category = 'medium';
        } else {
            category = 'high';
        }

        return {
            score: parseFloat(finalScore.toFixed(2)),
            category,
            breakdown: {
                weightedHazardScore: parseFloat(weightedHazardScore.toFixed(2)),
                sensitivity,
                adaptiveCapacity,
                hazardBreakdown: this.calculateHazardBreakdown(hazards)
            }
        };
    }

    calculateHazardBreakdown(hazards) {
        const breakdown = {};
        Object.keys(this.hazardWeights).forEach(hazard => {
            const score = hazards[hazard] || 3.0;
            breakdown[hazard] = {
                score,
                weight: this.hazardWeights[hazard],
                weightedValue: parseFloat((score * this.hazardWeights[hazard]).toFixed(3))
            };
        });
        return breakdown;
    }

    getHazardLabels() {
        return {
            flood: 'Sel/Taşkın',
            heatwave: 'Aşırı Sıcaklık',
            drought: 'Kuraklık',
            storm: 'Fırtına'
        };
    }
}

// ==========================================
// GENEL RİSK HESAPLAYICI
// ==========================================
export class ClimateRiskCalculator {
    constructor() {
        this.transitionCalculator = new TransitionRiskCalculator();
        this.physicalCalculator = new PhysicalRiskCalculator();
    }

    // Asset için kapsamlı risk analizi
    calculateAssetRisk(asset) {
        let transitionRisk = null;
        let physicalRisk = null;

        // Geçiş riski hesaplama
        if (asset.transitionScores) {
            transitionRisk = this.transitionCalculator.calculateRisk(asset.transitionScores);
        }

        // Fiziksel risk hesaplama
        if (asset.physicalData) {
            physicalRisk = this.physicalCalculator.calculatePCRS(
                asset.physicalData.hazards,
                asset.physicalData.sensitivity,
                asset.physicalData.adaptiveCapacity
            );
        }

        // Kombine risk skoru hesaplama
        const combinedScore = this.calculateCombinedRiskScore(transitionRisk, physicalRisk);

        return {
            transitionRisk,
            physicalRisk,
            combinedScore,
            overallCategory: this.determineCombinedCategory(transitionRisk, physicalRisk)
        };
    }

    calculateCombinedRiskScore(transitionRisk, physicalRisk) {
        if (!transitionRisk && !physicalRisk) return 5.0;
        
        let score = 0;
        let weights = 0;

        if (transitionRisk) {
            score += transitionRisk.weightedScore * 2; // 0-6 arası değeri 0-10'a çevir
            weights += 0.6;
        }

        if (physicalRisk) {
            score += physicalRisk.score * 2; // 0-5 arası değeri 0-10'a çevir  
            weights += 0.4;
        }

        return Math.max(1, Math.min(10, score / weights));
    }

    determineCombinedCategory(transitionRisk, physicalRisk) {
        // En yüksek kategoriye göre belirle
        if ((transitionRisk?.category === 'high') || (physicalRisk?.category === 'high')) {
            return 'high';
        }
        if ((transitionRisk?.category === 'medium') || (physicalRisk?.category === 'medium')) {
            return 'medium';
        }
        return 'low';
    }

    // Portföy düzeyinde analiz
    calculatePortfolioRisk(assets) {
        const results = assets.map(asset => ({
            asset: asset,
            riskAnalysis: this.calculateAssetRisk(asset)
        }));

        // Portföy istatistikleri
        const stats = this.calculatePortfolioStats(results);
        
        return {
            assetResults: results,
            portfolioStats: stats,
            recommendations: this.generateRecommendations(results)
        };
    }

    calculatePortfolioStats(results) {
        const validResults = results.filter(r => r.riskAnalysis.combinedScore);
        
        if (validResults.length === 0) return null;

        const totalValue = validResults.reduce((sum, r) => sum + (r.asset.value || 0), 0);
        const avgRisk = validResults.reduce((sum, r) => sum + r.riskAnalysis.combinedScore, 0) / validResults.length;
        
        // Risk kategorisi dağılımı
        const distribution = {
            high: validResults.filter(r => r.riskAnalysis.overallCategory === 'high').length,
            medium: validResults.filter(r => r.riskAnalysis.overallCategory === 'medium').length,
            low: validResults.filter(r => r.riskAnalysis.overallCategory === 'low').length
        };

        // Risk ağırlıklı değer
        const riskWeightedValue = validResults.reduce((sum, r) => {
            const riskMultiplier = r.riskAnalysis.overallCategory === 'high' ? 1.5 : 
                                   r.riskAnalysis.overallCategory === 'medium' ? 1.2 : 1.0;
            return sum + ((r.asset.value || 0) * riskMultiplier);
        }, 0);

        return {
            totalAssets: validResults.length,
            totalValue,
            avgRiskScore: parseFloat(avgRisk.toFixed(2)),
            riskDistribution: distribution,
            riskWeightedValue,
            highestRiskAssets: validResults
                .sort((a, b) => b.riskAnalysis.combinedScore - a.riskAnalysis.combinedScore)
                .slice(0, 5)
        };
    }

    generateRecommendations(results) {
        const recommendations = [];
        
        const highRiskAssets = results.filter(r => r.riskAnalysis.overallCategory === 'high');
        
        if (highRiskAssets.length > 0) {
            recommendations.push({
                priority: 'high',
                category: 'risk_mitigation',
                title: 'Yüksek Riskli Varlıklar',
                description: `${highRiskAssets.length} varlıkta yüksek risk tespit edildi. Acil aksiyon gerekiyor.`,
                actions: [
                    'Risk azaltma planları hazırlayın',
                    'Sigorta kapsamını gözden geçirin',
                    'Alternatif lokasyonları değerlendirin'
                ]
            });
        }

        // Geçiş riski yoğunluğu
        const highTransitionRisk = results.filter(r => 
            r.riskAnalysis.transitionRisk?.category === 'high'
        );

        if (highTransitionRisk.length > 0) {
            recommendations.push({
                priority: 'medium',
                category: 'transition_planning',
                title: 'Geçiş Riski Yönetimi',
                description: 'Düşük karbon ekonomisine geçiş planları oluşturun.',
                actions: [
                    'Emisyon azaltma hedefleri belirleyin',
                    'Yenilenebilir enerji yatırımları planlayın',
                    'Teknoloji yenilemesi yapın'
                ]
            });
        }

        return recommendations;
    }
}

// Risk kategorisi yardımcı fonksiyonları
export const RiskUtils = {
    getCategoryText(category) {
        switch(category) {
            case 'high': return 'Yüksek';
            case 'medium': return 'Orta';
            case 'low': return 'Düşük';
            default: return 'Bilinmiyor';
        }
    },

    getCategoryColor(category) {
        switch(category) {
            case 'high': return '#dc3545';
            case 'medium': return '#ffc107';  
            case 'low': return '#28a745';
            default: return '#6c757d';
        }
    },

    formatMoney(amount, short = false) {
        if (short && amount >= 1000000) {
            return (amount / 1000000).toFixed(0) + 'M';
        }
        return new Intl.NumberFormat('tr-TR').format(amount);
    }
};

// Singleton instances
export const transitionCalculator = new TransitionRiskCalculator();
export const physicalCalculator = new PhysicalRiskCalculator(); 
export const climateRiskCalculator = new ClimateRiskCalculator();