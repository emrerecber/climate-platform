# Climate Platform Backend API

Enterprise-grade REST API for Climate Risk Intelligence Platform built with Node.js, Express, and PostgreSQL.

## 🚀 Features

### Phase 1 (CURRENT) - Core Functionality
- ✅ User Authentication (JWT)
- ✅ User Registration & Login
- ✅ Company CRUD Operations
- ✅ Calculation Results Storage (JSONB)
- ✅ Multi-user Support
- ✅ Data Persistence
- ✅ Role-Based Access Control
- ✅ API Rate Limiting
- ✅ Security Headers (Helmet)
- ✅ CORS Support
- ✅ Input Validation
- ✅ Error Handling

## 📋 Prerequisites

- **Node.js**: v16+ 
- **PostgreSQL**: v12+
- **npm**: v8+

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

**Create PostgreSQL database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE climate_platform_dev;

# Exit
\q
```

**Or use GUI tools:**
- pgAdmin
- DBeaver
- Postico (Mac)

### 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

**Edit `.env` with your settings:**

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=climate_platform_dev
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
```

### 4. Start Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

**Expected output:**

```
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

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "organization": "ABC Company"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "role": "user",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/v1/auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "organization": "New Company"
}
```

#### Change Password
```http
PUT /api/v1/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

---

### Companies

> **Note:** All company endpoints require authentication (`Authorization: Bearer <token>`)

#### Create Company
```http
POST /api/v1/companies
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "ABC Corp",
  "sector": "Manufacturing",
  "country": "Turkey",
  "city": "Istanbul",
  "revenue": 10000000,
  "employees": 500,
  "formData": {
    "step1": {...},
    "step2": {...}
  },
  "tags": ["manufacturing", "turkey"]
}
```

#### Get All Companies (with filters)
```http
GET /api/v1/companies?status=completed&sector=Energy&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: draft | in_progress | completed | archived
- `sector`: Industry sector
- `search`: Company name search
- `sortBy`: Field to sort by (default: createdAt)
- `order`: ASC | DESC
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

#### Get Single Company
```http
GET /api/v1/companies/:id
Authorization: Bearer <token>
```

#### Update Company
```http
PUT /api/v1/companies/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "ABC Corporation",
  "status": "completed",
  "completionPercentage": 100,
  "formData": {...}
}
```

#### Save Calculation Results
```http
POST /api/v1/companies/:id/calculations
Authorization: Bearer <token>
Content-Type: application/json

{
  "pactaResults": {...},
  "tcfdResults": {...},
  "financialResults": {...},
  "scope3Results": {...},
  "forwardMetrics": {...},
  "physicalRisk": {...},
  "benchmarking": {...}
}
```

#### Delete Company
```http
DELETE /api/v1/companies/:id
Authorization: Bearer <token>
```

#### Get Statistics
```http
GET /api/v1/companies/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 42,
    "byStatus": {
      "draft": 10,
      "completed": 30,
      "archived": 2
    },
    "bySector": [
      { "sector": "Energy", "count": 15 },
      { "sector": "Manufacturing", "count": 12 }
    ],
    "recent": [...]
  }
}
```

---

### Health Check
```http
GET /health
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  organization VARCHAR(255),
  role ENUM('user', 'professional', 'enterprise', 'admin'),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Companies Table
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  sector VARCHAR(255) NOT NULL,
  country VARCHAR(255) DEFAULT 'Turkey',
  city VARCHAR(255),
  revenue FLOAT,
  employees INTEGER,
  year_founded INTEGER,
  form_data JSONB DEFAULT '{}',
  pacta_results JSONB,
  tcfd_results JSONB,
  financial_results JSONB,
  scope3_results JSONB,
  forward_metrics JSONB,
  physical_risk JSONB,
  benchmarking JSONB,
  status ENUM('draft', 'in_progress', 'completed', 'archived'),
  completion_percentage INTEGER DEFAULT 0,
  last_calculated_at TIMESTAMP,
  notes TEXT,
  tags VARCHAR(255)[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🔒 Security

- **Password Hashing**: bcryptjs (10 salt rounds)
- **JWT Tokens**: 7-day expiry
- **Helmet.js**: Security headers
- **CORS**: Whitelist origins
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: express-validator
- **SQL Injection Protection**: Sequelize ORM

## 🧪 Testing

```bash
npm test
```

## 🐛 Troubleshooting

### Database Connection Failed

**Error:**
```
❌ Unable to connect to the database: password authentication failed
```

**Solution:**
1. Check `.env` DB_PASSWORD
2. Verify PostgreSQL is running: `sudo service postgresql status`
3. Test connection: `psql -U postgres -d climate_platform_dev`

### Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Module Not Found

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # DB configuration
│   │   └── sequelize.js         # Sequelize instance
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Company.js           # Company model
│   │   └── index.js             # Model associations
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── companyController.js # Company CRUD
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── companyRoutes.js     # Company endpoints
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Error middleware
│   │   └── validate.js          # Input validation
│   └── server.js                # Express app
├── .env.example                 # Environment template
├── package.json
└── README.md
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Enable SSL for database (`DB_SSL=true`)
- [ ] Configure production CORS origins
- [ ] Set up error monitoring (Sentry)
- [ ] Configure logging (Winston)
- [ ] Set up database backups
- [ ] Use environment-specific configs
- [ ] Enable HTTPS
- [ ] Set up CI/CD pipeline

### Deploy to Heroku

```bash
# Add Heroku Postgres
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret_here
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Deploy to AWS/Azure/GCP

See deployment guides in `/docs` folder (coming soon).

## 📚 Next Steps (Phase 2)

- [ ] Portfolio management
- [ ] Team collaboration
- [ ] File uploads
- [ ] Email notifications
- [ ] Audit logs
- [ ] Advanced analytics
- [ ] API documentation (Swagger)
- [ ] Integration tests

## 📄 License

MIT

## 👥 Support

For issues, please create a GitHub issue or contact the development team.

---

**Built with ❤️ for climate action**
