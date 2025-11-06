# ECB/IFRS S2 Implementation - Test Guide

## ✅ Tamamlanan İşler

### 1. Form UI Güncellemeleri ✅
- **Step 3**: 10 PCAF finansal alan eklendi
- **Step 9**: Scope 2 (2 metod) + Scope 3 (15 kategori) + CBAM alanları
- **Step 10**: Physical Risk P-S-A (5 hazard + 4 adaptive capacity) + 4 Risk Tag
- **Step 12**: Governance scoring (4 metrik, 0-1 skala)

### 2. Translation Keys ✅
- `src/i18n.js` dosyasına 70+ yeni çeviri eklendi
- Türkçe ve İngilizce tam destek

### 3. Validation Utilities ✅
- `src/utils/ecbValidation.js` oluşturuldu
- 0-1 range validation
- Scope 3 otomatik toplama
- Form data sanitization

### 4. Build Status ✅
- Production build başarılı
- Syntax hatası yok
- Sadece unused vars warnings (normal)

---

## 🧪 Test Adımları

### Adım 1: Development Server Başlat
```bash
cd "C:\Users\DELL\Documents\sustainability\climate-platform"
npm start
```

### Adım 2: Formları Test Et

#### A. Financial Data Form Test
1. Ana sayfadan "Risk Değerlendirme Formu" veya "Financial Analysis" seçin
2. Step 1-2'yi normal doldurun
3. **Step 3'te** kontrol edin:
   - "PCAF Financial Metrics (ECB/IFRS S2)" section görünüyor mu?
   - EBITDA, EAD, Equity Market Value alanları var mı?
   - PD, LGD, Risk Weight alanları 0-1 range'de çalışıyor mu?
4. İlerleyin

#### B. Emissions Data Test (Step 9)
1. Step 9'a gidin
2. Kontrol edin:
   - "Scope 2 Emissions (ECB/IFRS S2)" section var mı?
   - Location-Based ve Market-Based alanlar ayrı mı?
   - "Scope 3 Emissions - 15 Categories" section var mı?
   - Tüm 15 kategori (Cat 1 - Cat 15) görünüyor mu?
   - "CBAM Extended Data" section var mı?
   - CBAM fiyatları default 85 ve 20 olarak geliyor mu?

#### C. Physical Risk Test (Step 10)
1. Step 10'a gidin
2. Kontrol edin:
   - "Physical Risk Probability (P)" section var mı?
   - 5 hazard tipi (heat, flood, coastal, precipitation, drought) var mı?
   - "Adaptive Capacity (A)" section var mı?
   - 4 capacity component (infrastructure, financial, governance, technology) var mı?
   - "Risk Amplifiers & Tags" section var mı?
   - 4 risk tag (water dependency, stranding, coastal vuln, supply chain) var mı?
   - Tüm alanlar 0-1 range'de mi?

#### D. Governance Test (Step 12)
1. Step 12'ye gidin
2. Kontrol edin:
   - Eski TCFD governance alanları hala var mı? (backward compatibility)
   - "Governance Quality Scoring (ECB/IFRS S2)" section eklendi mi?
   - 4 yeni governance metrik var mı?
   - Board Oversight, Management Role, Incentive Alignment, R&D Investment
   - Tüm alanlar 0-1 scale mi?

#### E. Translation Test
1. Sağ üst köşedeki dil değiştirici ile TR/EN geçiş yapın
2. Yeni ECB alanlarının her iki dilde de düzgün çevrildiğini kontrol edin

---

## 🔍 Detaylı Test Senaryoları

### Senaryo 1: Minimum Geçerli Veri
```
Step 3:
- EBITDA: 1000000
- EAD: 5000000
- Equity Market Value: 2000000

Step 9:
- Scope 2 Location: 10000
- Scope 2 Market: 9500
- En az 1 Scope 3 kategori: 5000

Step 10:
- En az 1 Physical Risk hazard: 0.3
- En az 1 Adaptive Capacity: 0.6

Step 12:
- Board Oversight: 0.5
```

Form submit olmalı.

### Senaryo 2: Maximum Değerler
```
Step 3:
- PD Base: 1.0
- LGD Base: 1.0
- Risk Weight: 1.0

Step 10:
- Tüm hazard types: 1.0
- Tüm adaptive capacity: 0.0 (en kötü)
- Tüm risk tags: 1.0 (maximum risk)

Step 12:
- Tüm governance scores: 0.0 (poor governance)
```

Tüm değerler 0-1 arası clamp edilmeli.

### Senaryo 3: Scope 3 Otomatik Toplama
```
Step 9'da Scope 3 individual categories doldur:
- Cat 1: 1000
- Cat 2: 500
- Cat 6: 200
- Cat 11: 3000
Total: 4700

Eğer "scope3Emissions" alanı boşsa, otomatik 4700 hesaplanmalı.
```

---

## ⚠️ Bilinen Limitasyonlar

### Şu An Çalışmayanlar (İleride Eklenecek):

1. **Backend Entegrasyonu**
   - Form verileri submit edilebilir ama backend henüz yeni alanları kabul etmiyor
   - Database schema güncellemesi gerekiyor

2. **ECB Hesaplama Motoru**
   - `masterCalculatorECB.js` hazır ama form'a bağlı değil
   - Calculate butonu şu an normal hesaplamayı çağırıyor

3. **Results Page**
   - ECB-specific outputları göstermiyor (TRS, PRS, RI*, ECL, RWA)
   - Sadece mevcut risk skoru gösteriliyor

4. **Data Persistence**
   - Yeni ECB alanları save/load edilemiyor (backend henüz hazır değil)

### Çalışanlar:

✅ Form UI render  
✅ Input validation (client-side)  
✅ Translations (TR/EN)  
✅ Step navigation  
✅ 0-1 range constraints  
✅ Default values  
✅ Responsive layout  

---

## 🐛 Hata Ayıklama

### Form alanları görünmüyorsa:
1. Browser console'u açın (F12)
2. React errors var mı kontrol edin
3. `npm start` output'unda compile error var mı bakın

### Translation key'ler eksikse:
1. `src/i18n.js` dosyasını kontrol edin
2. Key format doğru mu: `t('keyName')`
3. Browser cache temizleyin (Ctrl+Shift+R)

### Input değerleri kaydedilmiyorsa:
1. `handleInputChange` fonksiyonu çalışıyor mu?
2. Console'da formData state'ini log'layın:
```javascript
console.log('FormData:', formData);
```

### Build hatası alırsanız:
```bash
# node_modules silip yeniden yükleyin
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📊 Test Checklist

### UI Elements
- [ ] Step 3: PCAF section görünüyor
- [ ] Step 3: 10 financial field var
- [ ] Step 9: Scope 2 dual method var
- [ ] Step 9: Scope 3 15 categories var
- [ ] Step 9: CBAM section var
- [ ] Step 10: Physical Risk P-S-A var
- [ ] Step 10: Adaptive Capacity var
- [ ] Step 10: Risk Amplifiers var
- [ ] Step 12: Governance scoring var

### Functionality
- [ ] Input alanlar değer kabul ediyor
- [ ] 0-1 range validation çalışıyor
- [ ] Nested object fields update oluyor (physicalRiskProbability.heat)
- [ ] Step navigation sorunsuz
- [ ] Form submit ediliyor
- [ ] TR/EN translation çalışıyor

### Validation
- [ ] Negative değerler reddediliyor
- [ ] 1'den büyük değerler 1'e clamp ediliyor
- [ ] Percentage alanlar 0-100 arası
- [ ] Required field validations çalışıyor

---

## 🚀 Sonraki Adımlar (Backend Tarafı)

Bunlar kompleks işler olduğu için şimdilik atlıyoruz:

1. **Backend Model Update**
   ```javascript
   // models/Company.js veya Assessment.js
   // Yeni ECB alanları ekle
   ```

2. **API Endpoint**
   ```javascript
   POST /api/assessments/ecb-calculate
   // masterCalculatorECB.js'i çağır
   ```

3. **Results Page Update**
   ```javascript
   // ECB outputlarını göster
   // TRS, PRS, RI*, PD, ECL, RWA
   ```

4. **Database Migration**
   ```bash
   # Yeni schema deploy et
   ```

---

## 📞 Support

Sorun yaşarsanız:
1. `ECB_IFRS_S2_FORM_UPDATE_SUMMARY.md` dökümanını okuyun
2. `src/utils/ecbValidation.js` validation fonksiyonlarını inceleyin
3. Browser console'daki error mesajlarını kontrol edin

**Test sırasında bulduğunuz bugları not alın!**

---

## ✨ Test Başarılı Olursa

Eğer tüm UI testleri başarılıysa:
1. ✅ Frontend implementation tamamlanmış demektir
2. 🎯 Backend entegrasyonu için hazırsınız
3. 📊 ECB calculation engine'i bağlayabilirsiniz

**Şimdi test edebilirsiniz! 🚀**
