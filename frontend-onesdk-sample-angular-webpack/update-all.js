/**
 * This script runs all the update scripts in sequence
 */

const { execSync } = require('child_process');

console.log('Running update-components.js...');
execSync('node update-components.js', { stdio: 'inherit' });

console.log('Running fix-async.js...');
execSync('node fix-async.js', { stdio: 'inherit' });

console.log('Running fix-onesdk.js...');
execSync('node fix-onesdk.js', { stdio: 'inherit' });

console.log('Running fix-onesdk-context.js...');
execSync('node fix-onesdk-context.js', { stdio: 'inherit' });

console.log('Running fix-token-service.js...');
execSync('node fix-token-service.js', { stdio: 'inherit' });

console.log('Running fix-environment-ports.js...');
execSync('node fix-environment-ports.js', { stdio: 'inherit' });

console.log('Running fix-typescript-warnings.js...');
execSync('node fix-typescript-warnings.js', { stdio: 'inherit' });

console.log('Running fix-api-url.js...');
execSync('node fix-api-url.js', { stdio: 'inherit' });

console.log('All updates completed successfully!');
console.log('Now run: npm run build');
