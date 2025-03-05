const fs = require('fs');
const path = require('path');

// List of component files to update
const componentFiles = [
  'src/app/e2e-ocr-bio/e2e-ocr-bio.component.ts',
  'src/app/idv-dynamic/idv-dynamic.component.ts',
  'src/app/idverse/idverse.component.ts',
  'src/app/onboarding-manual/onboarding-manual.component.ts',
  'src/app/onboarding/onboarding.component.ts',
  'src/app/onfido/onfido.component.ts',
  'src/app/sardine/sardine.component.ts',
  'src/app/smart-ui/smart-ui.component.ts'
];

// Function to update a component file
function updateComponentFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  // Read the file
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Add the import for EnvironmentConfigService if it doesn't exist
  if (!content.includes('import { EnvironmentConfigService }')) {
    content = content.replace(
      /import { environment } from 'src\/environments\/environment';/,
      `import { environment } from 'src/environments/environment';\nimport { EnvironmentConfigService } from '../environment-config.service';`
    );
  }
  
  // Update the constructor to include EnvironmentConfigService
  content = content.replace(
    /constructor\(\s*private tokenService: OnesdkTokenService\s*\)/,
    `constructor(\n\t\tprivate tokenService: OnesdkTokenService,\n\t\tprivate envConfigService: EnvironmentConfigService\n\t)`
  );
  
  // Update the ngOnInit method to use the new approach
  content = content.replace(
    /session: await this\.tokenService\.getToken\(\s*environment\.CUSTOMER_ID,\s*environment\.API_KEY,\s*environment\.CUSTOMER_CHILD_ID[^)]*\)/g,
    `session: await this.tokenService.getToken()`
  );
  
  // Update the Google API key usage
  if (content.includes('googleApiKey: environment.GOOGLE_API_KEY')) {
    // Add the line to get the Google API key
    content = content.replace(
      /async ngOnInit\(\)\s*{/,
      `async ngOnInit() {\n\t\t// Get the Google API key from the environment config service\n\t\tconst googleApiKey = await this.envConfigService.getGoogleApiKey();\n`
    );
    
    // Replace the Google API key reference
    content = content.replace(
      /googleApiKey: environment\.GOOGLE_API_KEY/g,
      `googleApiKey`
    );
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${filePath}`);
}

// Update all component files
componentFiles.forEach(updateComponentFile);

console.log('All component files have been updated successfully!');
