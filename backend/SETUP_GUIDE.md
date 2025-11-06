# 🚀 Backend Setup Guide - Step by Step

Complete guide to get the Climate Platform backend running on your machine.

## ✅ Prerequisites Check

Before starting, ensure you have:

### 1. Node.js (v16+)
```bash
node --version
# Should show: v16.x.x or higher
```

**If not installed:**
- Windows: Download from https://nodejs.org/
- Mac: `brew install node`
- Linux: `sudo apt install nodejs npm`

### 2. PostgreSQL (v12+)
```bash
psql --version
# Should show: psql (PostgreSQL) 12.x or higher
```

**If not installed:**

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer
3. Remember the password you set for `postgres` user!
4. Default port: 5432

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 3. npm (comes with Node.js)
```bash
npm --version
# Should show: 8.x.x or higher
```

---

## 📦 Step 1: Install Dependencies

```bash
cd C:\Users\DELL\Documents\sustainability\climate-platform\backend
npm install
```

**What this does:**
- Installs all Node.js packages listed in package.json
- Creates `node_modules` folder
- Takes 1-2 minutes

**Expected output:**
```
added 234 packages, and audited 235 packages in 45s
```

---

## 🗄️ Step 2: Setup PostgreSQL Database

### Option A: Using Command Line (psql)

```bash
# Connect to PostgreSQL
psql -U postgres

# You'll be prompted for postgres password (the one you set during installation)
```

**Inside psql prompt:**
```sql
-- Create database
CREATE DATABASE climate_platform_dev;

-- Verify it was created
\l

-- Exit
\q
```

### Option B: Using pgAdmin (GUI)

1. Open pgAdmin 4
2. Connect to PostgreSQL server (localhost)
3. Right-click "Databases" → "Create" → "Database"
4. Name: `climate_platform_dev`
5. Click "Save"

### Option C: Using DBeaver (GUI - Recommended for beginners)

1. Download DBeaver: https://dbeaver.io/download/
2. Install and open
3. Click "New Database Connection"
4. Select "PostgreSQL"
5. Fill in:
   - Host: localhost
   - Port: 5432
   - Database: postgres
   - Username: postgres
   - Password: (your postgres password)
6. Click "Test Connection" → Should show "Connected"
7. Click "Finish"
8. Right-click connection → "Create" → "Database"
9. Name: `climate_platform_dev`

---

## ⚙️ Step 3: Configure Environment

### Create .env file

**PowerShell (Windows):**
```powershell
Copy-Item .env.example .env
```

**Or manually:**
1. Right-click `.env.example`
2. Copy
3. Paste in same folder
4. Rename to `.env` (no .txt!)

### Edit .env file

Open `.env` in any text editor and update:

```env
# CRITICAL: Change these!
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_STRING_123456789

# Leave these as default (unless you changed PostgreSQL settings)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=climate_platform_dev
DB_USER=postgres

# Leave these as is
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
```

**IMPORTANT:**
- Replace `YOUR_POSTGRES_PASSWORD_HERE` with your actual PostgreSQL password
- Generate a random JWT_SECRET (at least 32 characters):
  - Online: https://www.uuidgenerator.net/
  - Or type random characters: `kj34h5k23h5k2j3h5kjh23kjh5k23h5k23h5`

---

## 🧪 Step 4: Test Database Connection

Before starting the server, let's verify the database connection:

```bash
# Quick connection test
psql -U postgres -d climate_platform_dev -c "SELECT version();"
```

**Expected:**
```
                                                  version
-------------------------------------------------------------------------------------------------------------
 PostgreSQL 14.x on x86_64-pc-linux-gnu, compiled by gcc ...
(1 row)
```

**If you get an error:**
- `password authentication failed` → Wrong password in `.env`
- `database "climate_platform_dev" does not exist` → Database not created (go back to Step 2)
- `psql: command not found` → PostgreSQL not in PATH (restart terminal)

---

## 🚀 Step 5: Start the Server

### Development Mode (recommended)

```bash
npm run dev
```

**What this does:**
- Starts server with auto-reload (nodemon)
- Automatically restarts when you change code
- Perfect for development

### Production Mode

```bash
npm start
```

**What this does:**
- Starts server once
- No auto-reload
- Use this for actual deployment

---

## ✅ Step 6: Verify It's Working

### Expected Console Output

```
🔄 Testing database connection...
✅ Database connection established successfully.
🔄 Syncing database...
✅ Database synced successfully

================================================
🚀 Climate Platform Backend Server Started!
================================================
📡 Environment: development
🌐 Server running on: http://localhost:5000
📊 API version: v1
📚 API endpoints: http://localhost:5000/api/v1
💚 Health check: http://localhost:5000/health
================================================
```

**If you see this → SUCCESS! 🎉**

### Test the API

Open browser or Postman and visit:

**Health Check:**
```
http://localhost:5000/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2025-10-31T11:30:00.000Z",
  "uptime": 10.5,
  "environment": "development"
}
```

**API Root:**
```
http://localhost:5000/
```

**Expected response:**
```json
{
  "success": true,
  "message": "Climate Risk Intelligence Platform API",
  "version": "v1",
  "endpoints": {
    "auth": "/api/v1/auth",
    "companies": "/api/v1/companies"
  }
}
```

---

## 🧪 Step 7: Test User Registration

### Using Postman/Thunder Client/Bruno

**1. Create POST request:**
```
URL: http://localhost:5000/api/v1/auth/register
Method: POST
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User",
  "organization": "Test Company"
}
```

**Expected response (200 OK):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "test@example.com",
      "firstName": "Test",
      "lastName": "User",
      "organization": "Test Company",
      "role": "user",
      "isActive": true,
      "emailVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**2. Save the token!**
Copy the long `token` string - you'll need it for other API calls.

### Using curl (Command Line)

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"Test\"}"
```

---

## 🗄️ Step 8: Verify Database Tables

Check that tables were created:

```bash
psql -U postgres -d climate_platform_dev
```

**Inside psql:**
```sql
-- List all tables
\dt

-- You should see:
--   users
--   companies

-- View users table structure
\d users

-- View companies table structure
\d companies

-- Query your test user
SELECT email, "firstName", role FROM users;

-- Exit
\q
```

---

## 🎯 Common Issues & Solutions

### Issue 1: "Cannot find module 'express'"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: "Port 5000 already in use"

**Solution A - Change port:**
Edit `.env`:
```env
PORT=5001
```

**Solution B - Kill existing process:**

**Windows:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### Issue 3: "password authentication failed for user postgres"

**Solution:**
1. Your password in `.env` is wrong
2. Reset PostgreSQL password:

```bash
# Windows (as Administrator)
psql -U postgres
\password postgres
# Enter new password twice

# Mac/Linux
sudo -u postgres psql
\password postgres
# Enter new password twice
```

3. Update `.env` with new password

### Issue 4: Database sync error "relation already exists"

**Solution:**
This happens if you ran the server before. To reset:

```sql
psql -U postgres -d climate_platform_dev

DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

\q
```

Then restart server - it will recreate tables.

### Issue 5: CORS error from frontend

**Solution:**
Check `.env` has:
```env
ALLOWED_ORIGINS=http://localhost:3000
```

If frontend runs on different port (e.g. 3001):
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 🧪 Testing Checklist

Before moving to frontend integration, verify:

- [ ] Server starts without errors
- [ ] `/health` endpoint returns 200 OK
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Receive JWT token in response
- [ ] Database tables created (users, companies)
- [ ] Test user visible in database

---

## 📚 Next Steps

1. ✅ Backend is running → Now integrate with React frontend
2. Create API service file in React
3. Replace localStorage with API calls
4. Build authentication flow
5. Create dashboard with company list

See `FRONTEND_INTEGRATION.md` for next steps.

---

## 🆘 Still Having Issues?

### Check Logs

Look at server console output for detailed errors.

### Database Logs

```bash
# Check PostgreSQL logs (Linux/Mac)
tail -f /var/log/postgresql/postgresql-14-main.log

# Windows
# C:\Program Files\PostgreSQL\14\data\log\
```

### Enable Debug Mode

Edit `.env`:
```env
LOG_LEVEL=debug
```

Restart server - you'll see much more detailed logs.

### Contact Support

If still stuck:
1. Copy full error message
2. Include your `.env` (WITHOUT passwords!)
3. Include steps you tried
4. Create GitHub issue or contact team

---

**🎉 Congratulations! Your backend is ready for action!**
