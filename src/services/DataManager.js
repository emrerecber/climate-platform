// DataManager.js - Climate Platform için veri yönetim servisi
// İklim risk projesinden adapt edilmiştir

class DataManager {
    constructor() {
        this.currentCompany = this.getCurrentCompany();
    }

    getCurrentCompany() {
        const companyData = localStorage.getItem('currentCompany');
        return companyData ? JSON.parse(companyData) : null;
    }

    setCurrentCompany(company) {
        this.currentCompany = company;
        localStorage.setItem('currentCompany', JSON.stringify(company));
    }

    save(key, data) {
        try {
            // Eğer currentCompany varsa, şirket kodunu ekle
            if (this.currentCompany?.code) {
                key = `${this.currentCompany.code}_${key}`;
            }
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Veri kaydedilemedi:', e);
            return false;
        }
    }
    
    load(key) {
        try {
            // Eğer currentCompany varsa, şirket kodunu ekle
            if (this.currentCompany?.code) {
                key = `${this.currentCompany.code}_${key}`;
            }
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Veri yüklenemedi:', e);
            return null;
        }
    }
    
    initialize(defaultData = []) {
        let savedAssets = this.load('climateRiskAssets');
        
        if (!savedAssets || savedAssets.length === 0) {
            this.save('climateRiskAssets', defaultData);
            return defaultData;
        }
        
        return savedAssets;
    }

    // Veri tamlık hesaplama - geliştirilmiş versiyon
    calculateDataCompleteness(data) {
        if (!data) return 0;
        
        let totalFields = 0;
        let filledFields = 0;
        
        const countFields = (obj, isArray = false) => {
            if (obj === null || obj === undefined) {
                totalFields++;
                return;
            }
            
            if (Array.isArray(obj)) {
                totalFields++;
                if (obj.length > 0) {
                    filledFields++;
                    obj.forEach(item => countFields(item, true));
                }
            } else if (typeof obj === 'object') {
                Object.values(obj).forEach(value => countFields(value));
            } else if (typeof obj === 'boolean') {
                totalFields++;
                filledFields++; // Boolean değerler her zaman dolu sayılır
            } else {
                totalFields++;
                if (obj && obj.toString().trim() !== '') {
                    filledFields++;
                }
            }
        };
        
        countFields(data);
        
        return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    }

    // Veri dışa aktarım - geliştirilmiş versiyon
    exportAllData() {
        const assets = this.load('climateRiskAssets') || [];
        const detailedData = this.load('detailedData') || {};
        const portfolioData = this.load('portfolioData') || {};
        const financialData = this.load('financialData') || {};
        const geographicData = this.load('geographicData') || {};
        const creditRiskData = this.load('creditRiskData') || {};
        const exportCbamData = this.load('exportCbamData') || {};
        const esgData = this.load('esgData') || {};

        return {
            exportDate: new Date().toISOString(),
            version: '2.0',
            company: this.currentCompany,
            assets,
            detailedData,
            portfolioData,
            financialData,
            geographicData,
            creditRiskData,
            exportCbamData,
            esgData,
            statistics: this.getStatistics(),
            completenessScore: this.calculateDataCompleteness({
                ...detailedData,
                ...financialData,
                ...geographicData,
                ...creditRiskData,
                ...exportCbamData,
                ...esgData
            })
        };
    }

    // İstatistikler
    getStatistics() {
        const assets = this.load('climateRiskAssets') || [];
        
        return {
            totalAssets: assets.length,
            highRiskAssets: assets.filter(a => a.category === 'high').length,
            mediumRiskAssets: assets.filter(a => a.category === 'medium').length,
            lowRiskAssets: assets.filter(a => a.category === 'low').length,
            totalValue: assets.reduce((sum, asset) => sum + (asset.value || 0), 0),
            avgRiskScore: assets.length > 0 ? 
                assets.reduce((sum, asset) => sum + (asset.riskScore || 0), 0) / assets.length : 0
        };
    }

    // Bildirim gönderme
    broadcastUpdate(type) {
        if ('BroadcastChannel' in window) {
            const channel = new BroadcastChannel('climate_risk_updates');
            channel.postMessage({
                type: 'data_update',
                dataType: type,
                timestamp: new Date().toISOString(),
                company: this.currentCompany?.code
            });
        }
        
        // Custom event dispatch
        window.dispatchEvent(new CustomEvent('climateDataUpdate', {
            detail: { type, timestamp: new Date().toISOString() }
        }));
    }

    // Güncelleme dinleyicisi
    listenForUpdates(callback) {
        if ('BroadcastChannel' in window) {
            const channel = new BroadcastChannel('climate_risk_updates');
            channel.addEventListener('message', callback);
        }

        // Custom event listener
        window.addEventListener('climateDataUpdate', callback);
    }

    // Yeni veri türleri için kaydetme fonksiyonları
    saveFinancialData(data) {
        const result = this.save('financialData', data);
        if (result) this.broadcastUpdate('financialData');
        return result;
    }

    saveGeographicData(data) {
        const result = this.save('geographicData', data);
        if (result) this.broadcastUpdate('geographicData');
        return result;
    }

    saveCreditRiskData(data) {
        const result = this.save('creditRiskData', data);
        if (result) this.broadcastUpdate('creditRiskData');
        return result;
    }

    saveExportCbamData(data) {
        const result = this.save('exportCbamData', data);
        if (result) this.broadcastUpdate('exportCbamData');
        return result;
    }

    saveEsgData(data) {
        const result = this.save('esgData', data);
        if (result) this.broadcastUpdate('esgData');
        return result;
    }

    // Comprehensive data save - tüm formdan gelen veriyi parçalara ayırıp kaydeder
    saveComprehensiveData(formData) {
        try {
            // Coğrafi veriler
            const geographicData = {
                facilityLatitude: formData.facilityLatitude,
                facilityLongitude: formData.facilityLongitude,
                facilityElevation: formData.facilityElevation,
                physicalAddress: formData.physicalAddress,
                city: formData.city,
                district: formData.district,
                postalCode: formData.postalCode,
                region: formData.region,
                climateZone: formData.climateZone,
                proximityToCoast: formData.proximityToCoast,
                proximityToRiver: formData.proximityToRiver,
                landUseType: formData.landUseType,
                facilitySize: formData.facilitySize,
                buildingAge: formData.buildingAge
            };

            // Kredi riski verileri
            const creditRiskData = {
                creditScore: formData.creditScore,
                probabilityOfDefault: formData.probabilityOfDefault,
                lossGivenDefault: formData.lossGivenDefault,
                loanMaturityYears: formData.loanMaturityYears,
                repaymentStatus: formData.repaymentStatus,
                collateralValue: formData.collateralValue,
                collateralType: formData.collateralType,
                insuranceCoverage: formData.insuranceCoverage,
                assetType: formData.assetType,
                guarantorInfo: formData.guarantorInfo
            };

            // İhracat ve CBAM verileri
            const exportCbamData = {
                exportDestinations: formData.exportDestinations,
                cbamCoverage: formData.cbamCoverage,
                cbamSectors: formData.cbamSectors,
                hsCodes: formData.hsCodes,
                exportValue: formData.exportValue,
                exportPercentage: formData.exportPercentage,
                euExports: formData.euExports,
                carbonContent: formData.carbonContent,
                productCertifications: formData.productCertifications
            };

            // ESG ve çevresel veriler
            const esgData = {
                isoCertifications: formData.isoCertifications,
                eiaReports: formData.eiaReports,
                environmentalActionPlans: formData.environmentalActionPlans,
                energyAudit: formData.energyAudit,
                carbonFootprintCalculated: formData.carbonFootprintCalculated,
                renewableEnergyTargets: formData.renewableEnergyTargets,
                waterManagement: formData.waterManagement,
                wasteManagement: formData.wasteManagement,
                biodiversityImpact: formData.biodiversityImpact,
                stakeholderEngagement: formData.stakeholderEngagement,
                floodZoneExposure: formData.floodZoneExposure,
                historicalHazardIncidents: formData.historicalHazardIncidents,
                physicalRiskAssessment: formData.physicalRiskAssessment,
                climateAdaptationMeasures: formData.climateAdaptationMeasures,
                emergencyPreparedness: formData.emergencyPreparedness,
                businessContinuityPlan: formData.businessContinuityPlan
            };

            // Tüm veri türlerini kaydet
            const results = {
                geographic: this.saveGeographicData(geographicData),
                creditRisk: this.saveCreditRiskData(creditRiskData),
                exportCbam: this.saveExportCbamData(exportCbamData),
                esg: this.saveEsgData(esgData),
                complete: this.save('comprehensiveFormData', formData)
            };

            return Object.values(results).every(result => result);
        } catch (error) {
            console.error('Comprehensive data save failed:', error);
            return false;
        }
    }
}

// Singleton instance
const dataManager = new DataManager();

export default dataManager;