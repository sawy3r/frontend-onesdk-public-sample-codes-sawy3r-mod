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
    
    // Debug environment variables (don't log API_KEY in production)
    console.log('Environment variables:');
    console.log('CUSTOMER_ID:', CUSTOMER_ID ? 'Set' : 'Not set');
    console.log('CUSTOMER_CHILD_ID:', CUSTOMER_CHILD_ID ? 'Set' : 'Not set');
    console.log('API_KEY:', API_KEY ? 'Set' : 'Not set');
    console.log('BASE_API_URL:', BASE_API_URL);
    console.log('API_CREATE_SESSION_PATH:', API_CREATE_SESSION_PATH);
    
    if (!CUSTOMER_ID || !API_KEY) {
      return res.status(500).json({ error: 'Missing required environment variables' });
    }

    const authString = Buffer.from([CUSTOMER_ID, CUSTOMER_CHILD_ID, API_KEY].filter(Boolean).join(":")).toString('base64');
    console.log('Authorization string (base64):', authString);
    
    const apiUrl = BASE_API_URL + API_CREATE_SESSION_PATH;
    console.log('API URL:', apiUrl);
    
    const requestBody = {
      permissions: {
        preset: "one-sdk",
        reference: `demo-${new Date().toISOString()}`
      }
    };
    console.log('Request body:', JSON.stringify(requestBody));
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        authorization: "machine " + authString,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `API request failed with status ${response.status}`,
        details: errorText
      });
    }

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
