# 🧪 TEST GUIDE - Role & Customer Profile System

**Date:** October 31, 2025  
**Features:** Role-based access + Customer profiles

---

## ✅ WHAT'S NEW

### **1. Registration Form:**
- ✅ Role selection dropdown (Viewer, Analyst, Manager, Admin)
- ✅ Customer profile dropdown (Bank, Asset Manager, Corporate, Consultant, Other)
- ✅ Real-time descriptions
- ✅ Organization name field

### **2. Dashboard:**
- ✅ Role badge display (colored by role)
- ✅ Customer profile badge
- ✅ Role-based button visibility
- ✅ Viewer gets "View-only access" message

---

## 🧪 TEST SCENARIOS

### **Test 1: Register as Analyst (Bank)**
1. Open http://localhost:3000
2. Click "Don't have an account? Register"
3. Fill form:
   - Email: `analyst@bank.com`
   - Password: `test123456`
   - First Name: `John`
   - Last Name: `Smith`
   - Organization: `ABC Bank`
   - **Role:** Analyst ✍️
   - **Type:** Bank 🏦
4. Click "Register"
5. ✅ **Expected:**
   - Dashboard opens
   - Header shows: "Welcome, John" + **ANALYST** badge (blue) + **BANK** badge
   - "+ New Assessment" button visible
   - Can create companies

---

### **Test 2: Register as Viewer (Corporate)**
1. Logout
2. Register new user:
   - Email: `viewer@corp.com`
   - Password: `test123456`
   - First Name: `Sarah`
   - Last Name: `Johnson`
   - Organization: `XYZ Manufacturing`
   - **Role:** Viewer 📖
   - **Type:** Corporate 🏭
3. ✅ **Expected:**
   - Dashboard opens
   - Header shows: "Welcome, Sarah" + **VIEWER** badge (green) + **CORPORATE** badge
   - **NO** "+ New Assessment" button
   - Instead shows: "🔒 View-only access"
   - Can't create companies

---

### **Test 3: Register as Manager (Asset Manager)**
1. Logout
2. Register new user:
   - Email: `manager@asset.com`
   - Password: `test123456`
   - First Name: `Michael`
   - Last Name: `Chen`
   - Organization: `Green Capital`
   - **Role:** Manager 👥
   - **Type:** Asset Manager 💼
3. ✅ **Expected:**
   - Dashboard opens
   - Header shows: "Welcome, Michael" + **MANAGER** badge (yellow) + **ASSET MGR** badge
   - "+ New Assessment" button visible
   - Can create and manage companies

---

### **Test 4: Register as Admin (Consultant)**
1. Logout
2. Register new user:
   - Email: `admin@consult.com`
   - Password: `test123456`
   - First Name: `Emma`
   - Last Name: `Davis`
   - Organization: `Climate Advisory LLP`
   - **Role:** Admin ⚙️
   - **Type:** Consultant 📊
3. ✅ **Expected:**
   - Dashboard opens
   - Header shows: "Welcome, Emma" + **ADMIN** badge (red) + **CONSULTANT** badge
   - "+ New Assessment" button visible
   - Full access to everything

---

## 🎨 VISUAL GUIDE

### **Role Badge Colors:**
```
ADMIN    → 🔴 Red (#dc3545)
MANAGER  → 🟡 Yellow (#ffc107)
ANALYST  → 🔵 Blue (#667eea)
VIEWER   → 🟢 Green (#28a745)
AUDITOR  → ⚫ Gray (#6c757d)
```

### **Customer Profile Badges:**
```
BANK           → 🏦 Blue background
ASSET MGR      → 💼 Blue background
CORPORATE      → 🏭 Blue background
CONSULTANT     → 📊 Blue background
(Other hidden)
```

---

## 📊 REGISTRATION FORM - FIELD GUIDE

### **Role Descriptions (shown on select):**
- **Viewer:** 📖 Can view reports only
- **Analyst:** ✍️ Can create and edit assessments
- **Manager:** 👥 Can manage team and approve
- **Admin:** ⚙️ Full system access

### **Customer Profile Descriptions:**
- **Bank:** Credit risk assessment & portfolio monitoring
- **Asset Manager:** ESG scoring & investment analysis
- **Corporate:** Own operations & TCFD reporting
- **Consultant:** Multi-client advisory services
- **Other:** General climate risk analysis

---

## 🔍 BACKEND VERIFICATION

### **Check User in Database:**
```sql
-- Using backend/test-api.html
1. Login with test user
2. Click "Get Current User"
3. Check response JSON:
{
  "role": "analyst",
  "customerProfile": "bank",
  "organizationName": "ABC Bank"
}
```

### **Check Database Directly:**
```sql
-- If using SQLite browser
SELECT email, role, customerProfile, organizationName 
FROM users;
```

---

## ✅ CHECKLIST

### **Frontend:**
- [ ] Registration form shows role dropdown
- [ ] Registration form shows customer profile dropdown
- [ ] Descriptions update when selecting
- [ ] Form submits successfully
- [ ] Dashboard shows correct badges
- [ ] Role badge color is correct
- [ ] Customer profile badge shows (if not "other")
- [ ] "+ New Assessment" button shows for analyst/manager/admin
- [ ] "+ New Assessment" hidden for viewer
- [ ] Viewer sees "View-only access" message

### **Backend:**
- [ ] User created with correct role
- [ ] User created with correct customerProfile
- [ ] Database stores role enum correctly
- [ ] Database stores customerProfile enum correctly
- [ ] organizationName saved (not "organization")

### **Permissions (Coming Soon):**
- [ ] Viewer can't create companies (API blocks)
- [ ] Analyst can create own companies
- [ ] Manager can see workspace companies
- [ ] Admin can see all companies

---

## 🐛 TROUBLESHOOTING

### **Problem: Badges not showing**
**Solution:** Refresh page (F5) after registration

### **Problem: "Organization" field error**
**Solution:** Backend updated to "organizationName" - clear browser cache

### **Problem: Role dropdown empty**
**Solution:** Check Auth.js loaded correctly

### **Problem: Backend error on register**
**Solution:** Make sure backend restarted after model changes

---

## 🎯 NEXT FEATURES TO TEST (Phase 3B)

1. **Workspace Creation** (Coming)
   - Create workspace button (managers only)
   - Invite team members
   - Assign roles within workspace

2. **Approval Workflow** (Coming)
   - Submit for review button
   - Manager approval queue
   - Rejection with reason

3. **Customer-Specific Dashboards** (Coming)
   - Bank: Portfolio aggregation view
   - Asset Manager: Peer benchmarking
   - Corporate: Emissions tracking
   - Consultant: Client billing

---

## 📸 EXPECTED SCREENSHOTS

### **Registration Form:**
```
┌─────────────────────────────────────┐
│   🌍 Climate Platform               │
│   Create your account               │
│                                     │
│   [Email________________]           │
│   [Password_____________]           │
│   [First Name___________]           │
│   [Last Name____________]           │
│   [Organization_________]           │
│                                     │
│   Your Role                         │
│   [Analyst (Create & Edit) ▼]      │
│   ✍️ Can create and edit...        │
│                                     │
│   Organization Type                 │
│   [🏦 Bank ▼]                       │
│   Credit risk assessment...         │
│                                     │
│   [Register]                        │
└─────────────────────────────────────┘
```

### **Dashboard Header:**
```
┌─────────────────────────────────────────────┐
│ 🌍 Climate Platform            [Logout]    │
│ Welcome, John  [ANALYST] [BANK]            │
└─────────────────────────────────────────────┘
```

---

**Ready to test! Start with Test 1** 🚀
