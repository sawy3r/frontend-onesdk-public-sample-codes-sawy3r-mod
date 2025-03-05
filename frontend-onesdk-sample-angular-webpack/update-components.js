/**
 * This script updates all component files to use the EnvironmentConfigService
 * instead of accessing environment variables directly.
 */

const fs = require('fs');
const path = require('path');

// List of component files to update
const componentFiles = [
  'src/app/e2e-ocr-bio/e2e-ocr-bio.component.ts',
  'src/app/idv-review/idv-review.ts',
  'src/app/idv/idv.component.ts',
  'src/app/onboarding-manual/onboarding-manual.component.ts',
  'src/app/onboarding/onboarding.component.ts',
  'src/app/sardine/sardine.component.ts',
  'src/app/smart-ui/smart-ui.component.ts'
];

// Function to update a component file
function updateComponentFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  // Read the file content
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if the file already has the EnvironmentConfigService import
  if (!content.includes('EnvironmentConfigService')) {
    // Add the import
    content = content.replace(
      /import { environment } from 'src\/environments\/environment';/,
      `import { environment } from 'src/environments/environment';\nimport { EnvironmentConfigService } from '../environment-config.service';`
    );
    
    // Update the constructor to inject the EnvironmentConfigService
    content = content.replace(
      /constructor\((.*?)\) {/,
      (match, params) => {
        if (params.includes('envConfigService')) {
          return match;
        }
        return `constructor(${params ? params + ', ' : ''}private envConfigService: EnvironmentConfigService) {`;
      }
    );
    
    // Update the getToken call to use async/await and the EnvironmentConfigService
    content = content.replace(
      /this.onesdkTokenService.getToken\(\s*environment\.CUSTOMER_ID,\s*environment\.API_KEY,\s*environment\.CUSTOMER_CHILD_ID\s*\)/g,
      'this.onesdkTokenService.getToken()'
    );
    
    // Update the Google API key usage
    content = content.replace(
      /googleApiKey:\s*environment\.GOOGLE_API_KEY/g,
      'googleApiKey: await this.envConfigService.getGoogleApiKey()'
    );
    
    // Make sure the method is async if it contains await
    content = content.replace(
      /ngOnInit\(\)\s*{/g,
      'async ngOnInit() {'
    );
    
    // Fix any double async declarations
    content = content.replace(/async\s+async/g, 'async');
    
    // Update the tokenService variable name if it's different
    content = content.replace(
      /this.tokenService.getToken\(\s*environment\.CUSTOMER_ID,\s*environment\.API_KEY,\s*environment\.CUSTOMER_CHILD_ID\s*\)/g,
      'this.tokenService.getToken()'
    );
    
    content = content.replace(
      /this.onesdkTokenService.getToken\(\s*environment\.CUSTOMER_ID,\s*environment\.API_KEY,\s*environment\.CUSTOMER_CHILD_ID\s*\)/g,
      'this.onesdkTokenService.getToken()'
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`${filePath} already updated`);
  }
}

// Update all component files
componentFiles.forEach(updateComponentFile);

console.log('All component files updated successfully!');
