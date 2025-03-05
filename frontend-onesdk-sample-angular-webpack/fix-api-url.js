/**
 * This script updates the BASE_API_URL in the .env file to use the correct UAT endpoint
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '.env');

try {
  console.log('Checking .env file...');
  
  // Check if .env file exists
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found. Please create one based on .env.example');
    process.exit(1);
  }
  
  // Read the current .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Parse the .env file
  const envConfig = dotenv.parse(envContent);
  
  // Check if BASE_API_URL is set
  if (!envConfig.BASE_API_URL) {
    console.log('BASE_API_URL not found in .env file. Adding it...');
    
    // Add the BASE_API_URL to the .env file
    const updatedContent = envContent + '\n# Frankie Financial API URL\nBASE_API_URL=https://backend.kycaml.uat.frankiefinancial.io\n';
    fs.writeFileSync(envPath, updatedContent, 'utf8');
    
    console.log('Added BASE_API_URL to .env file.');
  } else if (envConfig.BASE_API_URL === 'https://backend.latest.frankiefinancial.io') {
    console.log('Found outdated BASE_API_URL. Updating to UAT endpoint...');
    
    // Update the BASE_API_URL in the .env file
    const updatedContent = envContent.replace(
      /BASE_API_URL=https:\/\/backend\.latest\.frankiefinancial\.io/g,
      'BASE_API_URL=https://backend.kycaml.uat.frankiefinancial.io'
    );
    
    fs.writeFileSync(envPath, updatedContent, 'utf8');
    
    console.log('Updated BASE_API_URL to UAT endpoint.');
  } else if (envConfig.BASE_API_URL !== 'https://backend.kycaml.uat.frankiefinancial.io') {
    console.log(`Current BASE_API_URL is set to: ${envConfig.BASE_API_URL}`);
    console.log('This is not the default UAT endpoint. You may want to update it if you are experiencing issues.');
  } else {
    console.log('BASE_API_URL is already set to the correct UAT endpoint.');
  }
  
  console.log('Done!');
} catch (error) {
  console.error('Error updating .env file:', error);
}
