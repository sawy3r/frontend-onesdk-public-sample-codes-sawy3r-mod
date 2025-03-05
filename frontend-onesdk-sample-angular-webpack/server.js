// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for development
app.use(cors());

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, 'dist/angular16-new')));

// API endpoint to securely provide environment configuration
app.get('/api/config', (req, res) => {
  // Return only the configuration needed by the client
  // These values come from environment variables instead of being hardcoded
  res.json({
    BASE_API_URL: process.env.BASE_API_URL || 'https://backend.latest.frankiefinancial.io',
    API_CREATE_SESSION_PATH: process.env.API_CREATE_SESSION_PATH || '/auth/v2/machine-session',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
  });
});

// API endpoint to get a session token
app.post('/api/get-token', express.json(), async (req, res) => {
  try {
    // Use environment variables for sensitive credentials
    const CUSTOMER_ID = process.env.CUSTOMER_ID;
    const CUSTOMER_CHILD_ID = process.env.CUSTOMER_CHILD_ID || '';
    const API_KEY = process.env.API_KEY;
    const BASE_API_URL = process.env.BASE_API_URL || 'https://backend.latest.frankiefinancial.io';
    const API_CREATE_SESSION_PATH = process.env.API_CREATE_SESSION_PATH || '/auth/v2/machine-session';
    
    if (!CUSTOMER_ID || !API_KEY) {
      return res.status(500).json({ error: 'Missing required environment variables' });
    }

    const response = await fetch(BASE_API_URL + API_CREATE_SESSION_PATH, {
      method: "POST",
      headers: {
        authorization: "machine " + Buffer.from([CUSTOMER_ID, CUSTOMER_CHILD_ID, API_KEY].filter(Boolean).join(":")).toString('base64'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        permissions: {
          preset: "one-sdk",
          reference: `demo-${new Date().toISOString()}`
        }
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error getting token:', error);
    res.status(500).json({ error: 'Failed to get token' });
  }
});

// All other GET requests not handled before will return the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/angular16-new/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
