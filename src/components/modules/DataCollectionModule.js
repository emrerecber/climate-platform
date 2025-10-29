import React, { useState, useEffect } from 'react';
import DataManager from '../../services/DataManager';

const DataCollectionModule = ({ onClose, onDataSaved }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Adım 1: Temel Şirket Bilgileri
        companyName: '',
        sector: '',
        headOfficeAddress: '',
        totalEmployees: '',
        annualRevenue: '',
        operationalCountries: '',
        
        // Adım 2: Emisyon Verileri
        scope1Emissions: '',
        scope2Emissions: '',
        scope3Emissions: '',
        baselineYear: '2020',
        emissionCalculationMethod: '',
        thirdPartyVerified: false,
        
        // Adım 3: Enerji ve Kaynak Kullanımı
        totalEnergyConsumption: '',
        renewableEnergyRatio: '',
        waterConsumption: '',
        wasteGeneration: '',
        recyclingRatio: '',
        
        // Adım 4: Finansal Bilgiler
        totalAssets: '',
        totalLiabilities: '',
        operatingIncome: '',
        capexLast3Years: '',
        rdExpenditure: '',
        
        // Adım 5: Risk ve Strateji
        climateRiskAssessment: false,
        transitionPlan: false,
        emissionTargets2030: '',
        emissionTargets2050: '',
        scienceBasedTargets: false,
        
        // Adım 6: Governance ve Raporlama
        tcfdReporting: false,
        sustainabilityReport: false,
        esgRating: '',
        boardClimateExpertise: false,
        climateGovernanceStructure: ''
    });

    const steps = [
        { id: 1, title: 'Temel Bilgiler', icon: '🏢' },
        { id: 2, title: 'Emisyon Verileri', icon: '🌫️' },
        { id: 3, title: 'Enerji & Kaynak', icon: '⚡' },
        { id: 4, title: 'Finansal Bilgiler', icon: '💰' },
        { id: 5, title: 'Risk & Strateji', icon: '🎯' },
        { id: 6, title: 'Governance', icon: '👥' }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                return formData.companyName && formData.sector && formData.totalEmployees;
            case 2:
                return formData.scope1Emissions && formData.scope2Emissions;
            case 3:
                return formData.totalEnergyConsumption;
            case 4:
                return formData.totalAssets && formData.operatingIncome;
            case 5:
                return true; // Bu adımda zorunlu alan yok
            case 6:
                return true; // Bu adımda zorunlu alan yok
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 6));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const saveData = () => {
        const dataToSave = {
            ...formData,
            collectedAt: new Date().toISOString(),
            completeness: calculateCompleteness()
        };

        DataManager.save('detailedCompanyData', dataToSave);
        DataManager.broadcastUpdate('detailedCompanyData');

        if (onDataSaved) {
            onDataSaved(dataToSave);
        }
    };

    const calculateCompleteness = () => {
        const totalFields = Object.keys(formData).length;
        const filledFields = Object.values(formData).filter(value => 
            value !== '' && value !== false && value !== null
        ).length;
        return Math.round((filledFields / totalFields) * 100);
    };

    const renderStep1 = () => (
        <div className="form-step">
            <h3>🏢 Temel Şirket Bilgileri</h3>
            
            <div className="form-grid">
                <div className="form-group">
                    <label>Şirket Adı *</label>
                    <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Şirket adını giriniz"
                    />
                </div>

                <div className="form-group">
                    <label>Sektör *</label>
                    <select
                        value={formData.sector}
                        onChange={(e) => handleInputChange('sector', e.target.value)}
                    >
                        <option value="">Sektör seçiniz</option>
                        <option value="Finans">Finans</option>
                        <option value="Enerji">Enerji</option>
                        <option value="Sanayi">Sanayi</option>
                        <option value="Otomotiv">Otomotiv</option>
                        <option value="Telekomünikasyon">Telekomünikasyon</option>
                        <option value="İnşaat">İnşaat</option>
                        <option value="Gıda">Gıda</option>
                        <option value="Teknoloji">Teknoloji</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Merkez Ofis Adresi</label>
                    <input
                        type="text"
                        value={formData.headOfficeAddress}
                        onChange={(e) => handleInputChange('headOfficeAddress', e.target.value)}
                        placeholder="Merkez ofis adresi"
                    />
                </div>

                <div className="form-group">
                    <label>Toplam Çalışan Sayısı *</label>
                    <input
                        type="number"
                        value={formData.totalEmployees}
                        onChange={(e) => handleInputChange('totalEmployees', e.target.value)}
                        placeholder="Çalışan sayısı"
                    />
                </div>

                <div className="form-group">
                    <label>Yıllık Ciro (TRY)</label>
                    <input
                        type="number"
                        value={formData.annualRevenue}
                        onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                        placeholder="Yıllık ciro"
                    />
                </div>

                <div className="form-group">
                    <label>Faaliyet Gösterilen Ülkeler</label>
                    <input
                        type="text"
                        value={formData.operationalCountries}
                        onChange={(e) => handleInputChange('operationalCountries', e.target.value)}
                        placeholder="Türkiye, Almanya, İtalya"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="form-step">
            <h3>🌫️ Emisyon Verileri</h3>
            
            <div className="form-grid">
                <div className="form-group">
                    <label>Kapsam 1 Emisyonları (ton CO2e/yıl) *</label>
                    <input
                        type="number"
                        value={formData.scope1Emissions}
                        onChange={(e) => handleInputChange('scope1Emissions', e.target.value)}
                        placeholder="Doğrudan emisyonlar"
                    />
                </div>

                <div className="form-group">
                    <label>Kapsam 2 Emisyonları (ton CO2e/yıl) *</label>
                    <input
                        type="number"
                        value={formData.scope2Emissions}
                        onChange={(e) => handleInputChange('scope2Emissions', e.target.value)}
                        placeholder="Dolaylı emisyonlar (elektrik)"
                    />
                </div>

                <div className="form-group">
                    <label>Kapsam 3 Emisyonları (ton CO2e/yıl)</label>
                    <input
                        type="number"
                        value={formData.scope3Emissions}
                        onChange={(e) => handleInputChange('scope3Emissions', e.target.value)}
                        placeholder="Diğer dolaylı emisyonlar"
                    />
                </div>

                <div className="form-group">
                    <label>Bazline Yılı</label>
                    <select
                        value={formData.baselineYear}
                        onChange={(e) => handleInputChange('baselineYear', e.target.value)}
                    >
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Hesaplama Metodolojisi</label>
                    <select
                        value={formData.emissionCalculationMethod}
                        onChange={(e) => handleInputChange('emissionCalculationMethod', e.target.value)}
                    >
                        <option value="">Seçiniz</option>
                        <option value="GHG Protocol">GHG Protocol</option>
                        <option value="ISO 14064">ISO 14064</option>
                        <option value="TCFD">TCFD</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="checkbox-group">
                        <input
                            type="checkbox"
                            checked={formData.thirdPartyVerified}
                            onChange={(e) => handleInputChange('thirdPartyVerified', e.target.checked)}
                        />
                        Üçüncü taraf doğrulaması yapıldı
                    </label>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="form-step">
            <h3>⚡ Enerji ve Kaynak Kullanımı</h3>
            
            <div className="form-grid">
                <div className="form-group">
                    <label>Toplam Enerji Tüketimi (MWh/yıl) *</label>
                    <input
                        type="number"
                        value={formData.totalEnergyConsumption}
                        onChange={(e) => handleInputChange('totalEnergyConsumption', e.target.value)}
                        placeholder="Yıllık enerji tüketimi"
                    />
                </div>

                <div className="form-group">
                    <label>Yenilenebilir Enerji Oranı (%)</label>
                    <input
                        type="number"
                        max="100"
                        value={formData.renewableEnergyRatio}
                        onChange={(e) => handleInputChange('renewableEnergyRatio', e.target.value)}
                        placeholder="0-100 arası"
                    />
                </div>

                <div className="form-group">
                    <label>Su Tüketimi (m³/yıl)</label>
                    <input
                        type="number"
                        value={formData.waterConsumption}
                        onChange={(e) => handleInputChange('waterConsumption', e.target.value)}
                        placeholder="Yıllık su tüketimi"
                    />
                </div>

                <div className="form-group">
                    <label>Atık Üretimi (ton/yıl)</label>
                    <input
                        type="number"
                        value={formData.wasteGeneration}
                        onChange={(e) => handleInputChange('wasteGeneration', e.target.value)}
                        placeholder="Yıllık atık miktarı"
                    />
                </div>

                <div className="form-group">
                    <label>Geri Dönüşüm Oranı (%)</label>
                    <input
                        type="number"
                        max="100"
                        value={formData.recyclingRatio}
                        onChange={(e) => handleInputChange('recyclingRatio', e.target.value)}
                        placeholder="0-100 arası"
                    />
                </div>
            </div>
        </div>
    );

    const renderProgressBar = () => (
        <div className="progress-container">
            <div className="progress-bar">
                {steps.map((step, index) => (
                    <div key={step.id} className="progress-step-container">
                        <div 
                            className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                            onClick={() => setCurrentStep(step.id)}
                        >
                            <span className="step-icon">{step.icon}</span>
                            <span className="step-number">{step.id}</span>
                        </div>
                        <div className="step-label">{step.title}</div>
                        {index < steps.length - 1 && (
                            <div className={`progress-line ${currentStep > step.id ? 'completed' : ''}`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="data-collection-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>📊 Kurumsal Veri Toplama</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {renderProgressBar()}

                <div className="modal-body">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {/* Diğer adımlar benzer şekilde eklenebilir */}
                </div>

                <div className="modal-footer">
                    <div className="progress-info">
                        Adım {currentStep}/{steps.length} • Tamamlanma: {calculateCompleteness()}%
                    </div>
                    
                    <div className="nav-buttons">
                        {currentStep > 1 && (
                            <button className="btn btn-secondary" onClick={prevStep}>
                                ← Önceki
                            </button>
                        )}
                        
                        {currentStep < steps.length ? (
                            <button 
                                className="btn btn-primary" 
                                onClick={nextStep}
                                disabled={!validateStep(currentStep)}
                            >
                                Sonraki →
                            </button>
                        ) : (
                            <button className="btn btn-success" onClick={saveData}>
                                💾 Kaydet ve Tamamla
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .data-collection-modal {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 900px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 25px 30px;
                    border-bottom: 1px solid #e2e8f0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 12px 12px 0 0;
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: white;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .progress-container {
                    padding: 25px 30px;
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                }

                .progress-bar {
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                }

                .progress-step-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex: 1;
                    position: relative;
                }

                .progress-step {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    border: 3px solid #e2e8f0;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    z-index: 2;
                }

                .progress-step.active {
                    border-color: #667eea;
                    background: #667eea;
                    color: white;
                }

                .progress-step.completed {
                    border-color: #10b981;
                    background: #10b981;
                    color: white;
                }

                .step-icon {
                    font-size: 16px;
                }

                .step-number {
                    font-size: 14px;
                    font-weight: bold;
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    background: inherit;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                }

                .step-label {
                    margin-top: 10px;
                    font-size: 12px;
                    color: #64748b;
                    text-align: center;
                    font-weight: 500;
                }

                .progress-line {
                    position: absolute;
                    top: 25px;
                    left: 50%;
                    right: -50%;
                    height: 3px;
                    background: #e2e8f0;
                    z-index: 1;
                }

                .progress-line.completed {
                    background: #10b981;
                }

                .modal-body {
                    padding: 30px;
                }

                .form-step h3 {
                    margin-bottom: 25px;
                    color: #1e293b;
                    font-size: 20px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-group label {
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                }

                .form-group input,
                .form-group select {
                    padding: 12px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.2s ease;
                }

                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .checkbox-group {
                    flex-direction: row !important;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                }

                .checkbox-group input {
                    width: auto;
                    margin: 0;
                }

                .modal-footer {
                    padding: 20px 30px;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #f8fafc;
                }

                .progress-info {
                    color: #64748b;
                    font-size: 14px;
                    font-weight: 500;
                }

                .nav-buttons {
                    display: flex;
                    gap: 15px;
                }

                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }

                .btn-primary {
                    background: #667eea;
                    color: white;
                }

                .btn-secondary {
                    background: #6b7280;
                    color: white;
                }

                .btn-success {
                    background: #10b981;
                    color: white;
                }

                .btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default DataCollectionModule;