import React from 'react';
import { useTranslation } from 'react-i18next';

const PACTADataForm = ({ formData = {}, handleChange = () => {}, inputStyle = {}, buttonStyle = {}, formStep = 6, setFormStep = () => {}, onSubmit = () => {} }) => {
  const { t } = useTranslation();
  const defaultInputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    ...inputStyle
  };

  const defaultButtonStyle = {
    padding: '12px 30px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    ...buttonStyle
  };

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>{t('pactaScenarioAnalysisData')}</h2>
      
      {/* İlerleme Göstergesi */}
      <div style={{ display: 'flex', marginBottom: '40px' }}>
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div
            key={step}
            style={{
              flex: 1,
              height: '4px',
              backgroundColor: formStep >= step ? '#0066cc' : '#e0e0e0',
              marginRight: step < 6 ? '10px' : '0'
            }}
          />
        ))}
      </div>

      {/* Sektör Bazlı Teknoloji Verileri */}
      <div style={{ marginBottom: '30px' }}>
        <h3>{t('technologyMixAndCapacity')}</h3>
        
        {formData.sector === 'Enerji' && (
          <div>
            <h4 style={{ marginTop: '20px', marginBottom: '15px' }}>Enerji Üretim Kapasitesi (MW)</h4>
            
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Kömür Kapasitesi (MW)
            </label>
            <input
              type="number"
              name="coalCapacity"
              value={formData.coalCapacity || ''}
              onChange={handleChange}
              placeholder="0"
              style={defaultInputStyle}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Doğalgaz Kapasitesi (MW)
            </label>
            <input
              type="number"
              name="gasCapacity"
              value={formData.gasCapacity || ''}
              onChange={handleChange}
              placeholder="0"
              style={defaultInputStyle}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Yenilenebilir Enerji Kapasitesi (MW)
            </label>
            <input
              type="number"
              name="renewableCapacity"
              value={formData.renewableCapacity || ''}
              onChange={handleChange}
              placeholder="0"
              style={defaultInputStyle}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Nükleer Kapasitesi (MW)
            </label>
            <input
              type="number"
              name="nuclearCapacity"
              value={formData.nuclearCapacity || ''}
              onChange={handleChange}
              placeholder="0"
              style={defaultInputStyle}
            />
          </div>
        )}

        {formData.sector === 'Otomotiv' && (
          <div>
            <h4 style={{ marginTop: '20px', marginBottom: '15px' }}>Yıllık Üretim Adetleri</h4>
            
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              İçten Yanmalı Motor (ICE) Üretimi
            </label>
            <input
              type="number"
              name="iceProduction"
              value={formData.iceProduction || ''}
              onChange={handleChange}
              placeholder="0"
              style={defaultInputStyle}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Hibrit Araç Üretimi
            </label>
            <input
              type="number"
              name="hybridProduction"
              value={formData.hybridProduction || ''}
              onChange={handleChange}
              placeholder="0"
              style={defaultInputStyle}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Elektrikli Araç (EV) Üretimi
            </label>
            <input
              type="number"
              name="evProduction"
              value={formData.evProduction || ''}
              onChange={handleChange}
              placeholder="0"
              style={defaultInputStyle}
            />
          </div>
        )}

        {formData.sector === 'Çimento' && (
          <div>
            <h4 style={{ marginTop: '20px', marginBottom: '15px' }}>Üretim Teknolojisi</h4>
            
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Yıllık Çimento Üretimi (ton)
            </label>
            <input
              type="number"
              name="cementProduction"
              value={formData.cementProduction || ''}
              onChange={handleChange}
              placeholder="0"
              style={defaultInputStyle}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Alternatif Yakıt Kullanım Oranı (%)
            </label>
            <input
              type="number"
              name="alternativeFuelRatio"
              value={formData.alternativeFuelRatio || ''}
              onChange={handleChange}
              placeholder="0-100"
              style={defaultInputStyle}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              CCS/CCUS Teknolojisi
            </label>
            <select name="ccsCapability" value={formData.ccsCapability || ''} onChange={handleChange} style={defaultInputStyle}>
              <option value="">Seçiniz</option>
              <option value="none">Yok</option>
              <option value="pilot">Pilot Aşamada</option>
              <option value="operational">Operasyonel</option>
            </select>
          </div>
        )}
      </div>

      {/* Gelecek Hedefler */}
      <div style={{ marginBottom: '30px' }}>
        <h3>2030 ve 2050 Hedefleri</h3>
        
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          2030 Yenilenebilir/Temiz Teknoloji Hedefi (%)
        </label>
        <input
          type="number"
          name="cleanTech2030Target"
          value={formData.cleanTech2030Target || ''}
          onChange={handleChange}
          placeholder="0-100"
          style={defaultInputStyle}
        />

        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          2050 Net-Zero Hedefi
        </label>
        <select name="netZero2050Target" value={formData.netZero2050Target || ''} onChange={handleChange} style={defaultInputStyle}>
          <option value="">Seçiniz</option>
          <option value="committed">Taahhüt Verildi</option>
          <option value="planned">Planlanıyor</option>
          <option value="none">Hedef Yok</option>
        </select>

        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Stranded Asset (Değersizleşecek Varlık) Risk Değerlendirmesi
        </label>
        <select name="strandedAssetAssessment" value={formData.strandedAssetAssessment || ''} onChange={handleChange} style={defaultInputStyle}>
          <option value="">Seçiniz</option>
          <option value="completed">Tamamlandı</option>
          <option value="inProgress">Devam Ediyor</option>
          <option value="planned">Planlanıyor</option>
          <option value="none">Yapılmadı</option>
        </select>
      </div>

      {/* Senaryo Uyumluluğu */}
      <div style={{ marginBottom: '30px' }}>
        <h3>İklim Senaryosu Uyumluluğu</h3>
        
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Paris Anlaşması Uyum Seviyesi
        </label>
        <select name="parisAlignmentLevel" value={formData.parisAlignmentLevel || ''} onChange={handleChange} style={defaultInputStyle}>
          <option value="">Seçiniz</option>
          <option value="aligned">1.5°C Uyumlu</option>
          <option value="2c">2°C Uyumlu</option>
          <option value="partial">Kısmen Uyumlu</option>
          <option value="notAligned">Uyumsuz</option>
        </select>

        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Geçiş Planı Kalitesi
        </label>
        <select name="transitionPlanQuality" value={formData.transitionPlanQuality || ''} onChange={handleChange} style={defaultInputStyle}>
          <option value="">Seçiniz</option>
          <option value="comprehensive">Kapsamlı ve Detaylı</option>
          <option value="moderate">Orta Düzey</option>
          <option value="basic">Temel Düzey</option>
          <option value="none">Plan Yok</option>
        </select>

        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Yıllık İklim CAPEX Bütçesi (Milyon {formData.currency || 'EUR'})
        </label>
        <input
          type="number"
          name="climateCapexBudget"
          value={formData.climateCapexBudget || ''}
          onChange={handleChange}
          placeholder="0"
          style={defaultInputStyle}
        />
      </div>

      {/* R&D ve İnovasyon */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Ar-Ge ve İnovasyon</h3>
        
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Temiz Teknoloji Ar-Ge Bütçesi (Milyon {formData.currency || 'EUR'})
        </label>
        <input
          type="number"
          name="cleanTechRDBudget"
          value={formData.cleanTechRDBudget || ''}
          onChange={handleChange}
          placeholder="0"
          style={defaultInputStyle}
        />

        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          İklim Teknolojisi Patentleri (Adet)
        </label>
        <input
          type="number"
          name="climatePatents"
          value={formData.climatePatents || ''}
          onChange={handleChange}
          placeholder="0"
          style={defaultInputStyle}
        />
      </div>

      {/* Navigasyon Butonları */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        <button 
          onClick={() => setFormStep(5)} 
          style={{
            ...defaultButtonStyle,
            backgroundColor: '#6c757d'
          }}
        >
          {t('back')}
        </button>
// src/components/PACTADataForm.js dosyasında, en alttaki butonu bulun ve değiştirin:

<button 
  onClick={onSubmit} 
  style={{
    ...defaultButtonStyle,
    backgroundColor: '#28a745'
  }}
>
  {t('completeAssessment')}
</button>
      </div>
    </div>
  );
};

export default PACTADataForm;