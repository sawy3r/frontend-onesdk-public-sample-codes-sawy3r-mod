/**
 * This script fixes the environment files to ensure they use the correct port
 * for the API endpoints.
 */

const fs = require('fs');
const path = require('path');

const environmentFiles = [
  path.join(__dirname, 'src/environments/environment.ts'),
  path.join(__dirname, 'src/environments/environment.development.ts')
];

// Get the port from server.js or use default 3000
let serverPort = 3000;
try {
  const serverContent = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
  const portMatch = serverContent.match(/const\s+port\s*=\s*process\.env\.PORT\s*\|\|\s*(\d+)/);
  if (portMatch && portMatch[1]) {
    serverPort = parseInt(portMatch[1], 10);
  }
} catch (error) {
  console.error('Error reading server.js:', error);
}

console.log(`Using server port: ${serverPort}`);

// Fix each environment file
environmentFiles.forEach(filePath => {
  try {
    console.log(`Checking ${path.basename(filePath)}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file contains incorrect port numbers
    const configEndpointRegex = /(CONFIG_ENDPOINT:\s*['"])http:\/\/localhost:(\d+)(\/api\/config['"])/;
    const tokenEndpointRegex = /(TOKEN_ENDPOINT:\s*['"])http:\/\/localhost:(\d+)(\/api\/get-token['"])/;
    
    const configMatch = content.match(configEndpointRegex);
    const tokenMatch = content.match(tokenEndpointRegex);
    
    let modified = false;
    
    if (configMatch && configMatch[2] !== serverPort.toString()) {
      console.log(`  Fixing CONFIG_ENDPOINT port from ${configMatch[2]} to ${serverPort}`);
      content = content.replace(configEndpointRegex, `$1http://localhost:${serverPort}$3`);
      modified = true;
    }
    
    if (tokenMatch && tokenMatch[2] !== serverPort.toString()) {
      console.log(`  Fixing TOKEN_ENDPOINT port from ${tokenMatch[2]} to ${serverPort}`);
      content = content.replace(tokenEndpointRegex, `$1http://localhost:${serverPort}$3`);
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  Updated ${path.basename(filePath)}`);
    } else {
      console.log(`  No changes needed for ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log('Environment port check completed.');
