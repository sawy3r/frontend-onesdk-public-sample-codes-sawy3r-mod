/**
 * This script fixes the oneSdk vs OneSDK issue and remaining environment references
 */

const fs = require('fs');
const path = require('path');

// List of component files to fix
const componentFiles = [
  'src/app/e2e-ocr-bio/e2e-ocr-bio.component.ts',
  'src/app/idv-review/idv-review.ts',
  'src/app/idv/idv.component.ts',
  'src/app/onboarding-manual/onboarding-manual.component.ts',
  'src/app/onboarding/onboarding.component.ts',
  'src/app/sardine/sardine.component.ts',
  'src/app/smart-ui/smart-ui.component.ts'
];

// Function to fix a component file
function fixComponentFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  // Read the file content
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Fix oneSdk vs OneSDK
  content = content.replace(/\boneSdk\b/g, 'OneSDK');
  
  // Fix remaining environment references
  content = content.replace(/environment\.CUSTOMER_ID/g, '""');
  content = content.replace(/environment\.API_KEY/g, '""');
  content = content.replace(/environment\.CUSTOMER_CHILD_ID/g, '""');
  content = content.replace(/environment\.GOOGLE_API_KEY/g, 'await this.envConfigService.getGoogleApiKey()');
  
  // Write the updated content back to the file
  fs.writeFileSync(fullPath, content);
  console.log(`Fixed ${filePath}`);
}

// Fix all component files
componentFiles.forEach(fixComponentFile);

console.log('All component files fixed successfully!');
