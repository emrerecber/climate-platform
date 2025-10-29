const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import routes
const authRoutes = require('../../src/routes/auth');
const userRoutes = require('../../src/routes/users');
const assessmentRoutes = require('../../src/routes/assessments');
const reportRoutes = require('../../src/routes/reports');
const pactaRoutes = require('../../src/routes/pacta');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/pacta', pactaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running on Netlify Functions',
    timestamp: new Date().toISOString()
  });
});

// Export serverless handler
module.exports.handler = serverless(app);