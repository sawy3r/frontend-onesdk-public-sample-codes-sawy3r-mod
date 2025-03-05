/**
 * This script fixes the double async issue in component files
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
  
  // Fix double async
  if (content.includes('async async')) {
    content = content.replace(/async\s+async/g, 'async');
    
    // Fix the getToken calls to use the new service
    content = content.replace(
      /this\.tokenService\.getToken\(\s*environment\.CUSTOMER_ID,\s*environment\.API_KEY,\s*environment\.CUSTOMER_CHILD_ID\s*\)/g,
      'this.tokenService.getToken()'
    );
    
    content = content.replace(
      /this\.onesdkTokenService\.getToken\(\s*environment\.CUSTOMER_ID,\s*environment\.API_KEY,\s*environment\.CUSTOMER_CHILD_ID\s*\)/g,
      'this.onesdkTokenService.getToken()'
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed ${filePath}`);
  } else {
    console.log(`${filePath} already fixed`);
  }
}

// Fix all component files
componentFiles.forEach(fixComponentFile);

console.log('All component files fixed successfully!');
