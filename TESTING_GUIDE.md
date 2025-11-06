# Climate Platform - Testing Guide

Bu döküman Phase 3 (Approval Workflow) ve Phase 4 (Organization & Workspace Management) özelliklerini test etmek için hazırlanmıştır.

## 🚀 Başlangıç

### Backend Çalıştırma
```bash
cd backend
npm start
```
Backend: http://localhost:5000

### Frontend Çalıştırma
```bash
cd climate-platform
npm start
```
Frontend: http://localhost:3000

---

## 📋 Test Senaryoları

### 1. Authentication & Role-Based Access (RBAC)

#### Test 1.1: Viewer Rolü ile Kayıt
1. http://localhost:3000 adresine git
2. "Register" tab'ına geç
3. Bilgileri doldur:
   - Email: `viewer@test.com`
   - Password: `Test1234!`
   - First Name: `Test`
   - Last Name: `Viewer`
   - Organization: `Test Corp`
   - **Role: `viewer`**
   - **Customer Profile: `bank`**
4. Register'a tıkla
5. **Beklenen Sonuç:**
   - Dashboard açılır
   - Role badge: `VIEWER` (yeşil)
   - Customer Profile badge: `BANK` (mavi)
   - "+ New Assessment" butonu **görünmez**
   - "🔒 View-only access" mesajı görünür
   - "📋 Approval Queue" butonu **görünmez**

#### Test 1.2: Analyst Rolü ile Kayıt
1. Logout yap
2. "Register" tab'ına geç
3. Bilgileri doldur:
   - Email: `analyst@test.com`
   - Password: `Test1234!`
   - First Name: `Test`
   - Last Name: `Analyst`
   - Organization: `Test Corp`
   - **Role: `analyst`**
   - **Customer Profile: `corporate`**
4. Register'a tıkla
5. **Beklenen Sonuç:**
   - Dashboard açılır
   - Role badge: `ANALYST` (mor)
   - "+ New Assessment" butonu **görünür**
   - "📋 Approval Queue" butonu **görünmez**

#### Test 1.3: Manager Rolü ile Kayıt
1. Logout yap
2. "Register" tab'ına geç
3. Bilgileri doldur:
   - Email: `manager@test.com`
   - Password: `Test1234!`
   - First Name: `Test`
   - Last Name: `Manager`
   - Organization: `Test Corp`
   - **Role: `manager`**
   - **Customer Profile: `asset_manager`**
4. Register'a tıkla
5. **Beklenen Sonuç:**
   - Dashboard açılır
   - Role badge: `MANAGER` (sarı)
   - "+ New Assessment" butonu **görünür**
   - **"📋 Approval Queue" butonu görünür** ✨

#### Test 1.4: Admin Rolü ile Kayıt
1. Logout yap
2. "Register" tab'ına geç
3. Bilgileri doldur:
   - Email: `admin@test.com`
   - Password: `Test1234!`
   - First Name: `Test`
   - Last Name: `Admin`
   - Organization: `Test Corp`
   - **Role: `admin`**
   - **Customer Profile: `consultant`**
4. Register'a tıkla
5. **Beklenen Sonuç:**
   - Dashboard açılır
   - Role badge: `ADMIN` (kırmızı)
   - "+ New Assessment" butonu **görünür**
   - **"📋 Approval Queue" butonu görünür** ✨

---

### 2. Approval Workflow

#### Test 2.1: Assessment Oluşturma ve Submit for Review

**Ön Koşul:** Analyst rolünde login olun

1. Dashboard'da "+ New Assessment" butonuna tıkla
2. "← Back to Dashboard" butonu görünür
3. Sol menüden **"Mali Analiz"** (Financial Analysis) seçin
4. Form açılır - Minimum bilgileri doldurun:
   - **Step 1 - Basic Info:**
     - Entity Name: `Test Company A`
     - Sector: `Energy` (veya başka bir seçenek)
     - Country: `Turkey`
   - Diğer adımları atlayabilirsiniz
5. **"Calculate" veya "Submit"** butonuna tıklayın
6. **Beklenen Sonuç:**
   - "✅ Data saved successfully!" alert'i
   - **"Would you like to submit this assessment for Manager review?"** confirmation dialog'u
   - **OK** seçin
   - "📋 Assessment submitted for review!" alert'i

#### Test 2.2: Approval Queue - Manager Görünümü

**Ön Koşul:** Manager rolünde login olun

1. Dashboard'da **"📋 Approval Queue"** butonuna tıkla
2. **Beklenen Sonuç:**
   - Modal açılır: "📋 Approval Queue"
   - Test 2.1'de oluşturduğunuz "Test Company A" listede görünür
   - Sarı kenarlı kart (pending status)
   - Company name: **Test Company A**
   - Sector badge: **Energy**
   - Location: **Turkey**
   - Submitted date gösterilir
   - **✅ Approve** butonu (yeşil)
   - **❌ Reject** butonu (kırmızı)

#### Test 2.3: Assessment Onaylama

**Ön Koşul:** Test 2.2'den devam

1. Approval Queue modal'ında "Test Company A" için **"✅ Approve"** butonuna tıkla
2. **Beklenen Sonuç:**
   - "✅ Company approved!" alert'i
   - "Test Company A" listeden kaybolur
   - Modal boş kalırsa: "✅ No pending approvals" mesajı

#### Test 2.4: Assessment Reddetme

**Ön Koşul:** Yeni bir assessment oluşturun (Test 2.1'i tekrarlayın)

1. Manager olarak Approval Queue'ya git
2. Yeni assessment için **"❌ Reject"** butonuna tıkla
3. **Beklenen Sonuç:**
   - "Reject Assessment" modal'ı açılır
   - Textarea: "Please provide a reason for rejection:"
   - Bir sebep yazın: örn. "Incomplete data"
   - **"Confirm Reject"** butonuna tıkla
   - "❌ Company rejected" alert'i
   - Assessment listeden kaybolur

---

### 3. API Endpoint Testleri (Postman/cURL)

#### Test 3.1: Organization API

**Create Organization (Admin only)**
```bash
POST http://localhost:5000/api/v1/organizations
Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json
Body:
{
  "name": "Acme Corporation",
  "description": "Technology company",
  "industry": "technology",
  "website": "https://acme.com",
  "country": "Turkey"
}
```

**Get My Organization**
```bash
GET http://localhost:5000/api/v1/organizations/my-organization
Headers:
  Authorization: Bearer <token>
```

**Get Organization Stats**
```bash
GET http://localhost:5000/api/v1/organizations/<org_id>/stats
Headers:
  Authorization: Bearer <token>
```

#### Test 3.2: Workspace API

**Create Workspace**
```bash
POST http://localhost:5000/api/v1/workspaces
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "name": "Engineering Team",
  "description": "Engineering workspace",
  "organizationId": "<org_id>"
}
```

**Get My Workspaces**
```bash
GET http://localhost:5000/api/v1/workspaces/my-workspaces
Headers:
  Authorization: Bearer <token>
```

**Add Member to Workspace**
```bash
POST http://localhost:5000/api/v1/workspaces/<workspace_id>/members
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "userId": "<user_id>",
  "role": "member"
}
```

**Update Member Role**
```bash
PUT http://localhost:5000/api/v1/workspaces/<workspace_id>/members/<user_id>/role
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "role": "admin"
}
```

**Remove Member**
```bash
DELETE http://localhost:5000/api/v1/workspaces/<workspace_id>/members/<user_id>
Headers:
  Authorization: Bearer <token>
```

#### Test 3.3: Approval Workflow API

**Get Pending Approvals**
```bash
GET http://localhost:5000/api/v1/companies/pending
Headers:
  Authorization: Bearer <manager_token>
```

**Submit for Review**
```bash
POST http://localhost:5000/api/v1/companies/<company_id>/submit
Headers:
  Authorization: Bearer <token>
```

**Approve Company**
```bash
POST http://localhost:5000/api/v1/companies/<company_id>/approve
Headers:
  Authorization: Bearer <manager_token>
```

**Reject Company**
```bash
POST http://localhost:5000/api/v1/companies/<company_id>/reject
Headers:
  Authorization: Bearer <manager_token>
  Content-Type: application/json
Body:
{
  "reason": "Incomplete financial data"
}
```

---

### 4. Database Verification

SQLite database'i kontrol etmek için:

```bash
cd backend
sqlite3 database.sqlite

# Users tablosunu kontrol et
SELECT id, email, role, customerProfile, organizationId FROM users;

# Companies tablosunu kontrol et
SELECT id, companyName, status, approvalStatus, approvedBy FROM companies;

# Organizations tablosunu kontrol et
SELECT * FROM organizations;

# Workspaces tablosunu kontrol et
SELECT * FROM workspaces;

# Workspace members tablosunu kontrol et
SELECT * FROM workspace_members;
```

---

## ✅ Checklist

### Phase 3: Approval Workflow
- [ ] Analyst can create assessments
- [ ] Analyst sees "Submit for Review" dialog after save
- [ ] Manager sees "Approval Queue" button
- [ ] Approval Queue shows pending assessments
- [ ] Manager can approve assessments
- [ ] Manager can reject assessments with reason
- [ ] Approved/rejected assessments disappear from queue

### Phase 4: Organization & Workspace Management (Backend)
- [ ] Organizations can be created (admin only)
- [ ] Users can get their organization
- [ ] Organization stats work
- [ ] Workspaces can be created
- [ ] Users can be added to workspaces
- [ ] Member roles can be updated
- [ ] Members can be removed from workspaces
- [ ] Workspace stats work

### General
- [ ] All 5 roles work (viewer, analyst, manager, admin, auditor)
- [ ] Role badges display correctly
- [ ] Customer profile badges display correctly
- [ ] Button visibility based on role
- [ ] Authentication works
- [ ] Dashboard loads correctly
- [ ] No console errors

---

## 🐛 Known Issues

1. **Frontend UI for Organization/Workspace management henüz yok**
   - Backend API'lar hazır
   - Frontend components oluşturulacak

2. **Invitation system henüz implemente edilmedi**
   - Kullanıcılar manuel ekleniyor
   - Email invitation gelecek

---

## 📊 Test Sonuçları

Test tamamlandığında bu bölümü doldurun:

| Test ID | Test Adı | Durum | Notlar |
|---------|----------|-------|--------|
| 1.1 | Viewer Role | ⏳ Pending | |
| 1.2 | Analyst Role | ⏳ Pending | |
| 1.3 | Manager Role | ⏳ Pending | |
| 1.4 | Admin Role | ⏳ Pending | |
| 2.1 | Create & Submit | ⏳ Pending | |
| 2.2 | Approval Queue View | ⏳ Pending | |
| 2.3 | Approve Assessment | ⏳ Pending | |
| 2.4 | Reject Assessment | ⏳ Pending | |
| 3.1 | Organization API | ⏳ Pending | |
| 3.2 | Workspace API | ⏳ Pending | |
| 3.3 | Approval API | ⏳ Pending | |

---

## 🎯 Next Steps

Test sonrası:
1. Bulunan bug'ları düzelt
2. Frontend UI components'larını oluştur
3. Invitation system ekle
4. Email notifications ekle
5. Advanced permissions implement et
