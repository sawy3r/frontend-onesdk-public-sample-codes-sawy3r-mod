/**
 * This script fixes the token service usage in all components
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
  
  // Fix the getToken calls to use the new service signature
  content = content.replace(
    /this\.tokenService\.getToken\(\s*[^)]*\)/g,
    'this.tokenService.getToken()'
  );
  
  // Fix the OneSDK initialization
  content = content.replace(
    /this\.oneSdk\s*=\s*await\s*OneSDK\(\{[^}]*\}\);/s,
    'this.oneSdk = await OneSDK({\n      session: await this.tokenService.getToken(),\n    });'
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(fullPath, content);
  console.log(`Fixed ${filePath}`);
}

// Fix all component files
componentFiles.forEach(fixComponentFile);

console.log('All component files fixed successfully!');
