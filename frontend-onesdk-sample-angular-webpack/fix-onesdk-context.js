/**
 * This script fixes the OneSDK vs oneSdk context issue
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
  
  // Check if we need to fix the OneSDK context
  if (content.includes('oneSdk.component') || content.includes('oneSdk.flow') || content.includes('oneSdk.individual')) {
    // Make sure OneSDK is imported
    if (!content.includes('import OneSDK from')) {
      content = content.replace(
        /import { Component[^;]*;/,
        'import { Component, OnInit } from \'@angular/core\';\nimport OneSDK from \'@frankieone/one-sdk\';'
      );
    }
    
    // Make sure the component implements OnInit
    content = content.replace(
      /export class ([a-zA-Z0-9_]+) {/,
      'export class $1 implements OnInit {'
    );
    
    // Add a declaration for oneSdk at the class level
    content = content.replace(
      /export class ([a-zA-Z0-9_]+) implements OnInit {/,
      'export class $1 implements OnInit {\n  private oneSdk: any;'
    );
    
    // Update the ngOnInit method to initialize oneSdk
    content = content.replace(
      /async ngOnInit\(\) {(\s*)const oneSdk = await OneSDK\(/g,
      'async ngOnInit() {$1this.oneSdk = await OneSDK('
    );
    
    // If the above replacement didn't work, try a different pattern
    if (!content.includes('this.oneSdk = await OneSDK(')) {
      content = content.replace(
        /async ngOnInit\(\) {(\s*)OneSDK\(/g,
        'async ngOnInit() {$1this.oneSdk = await OneSDK('
      );
    }
    
    // Replace oneSdk. with this.oneSdk.
    content = content.replace(/\boneSdk\./g, 'this.oneSdk.');
    
    // Write the updated content back to the file
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed ${filePath}`);
  } else {
    console.log(`${filePath} already fixed or doesn't need fixing`);
  }
}

// Fix all component files
componentFiles.forEach(fixComponentFile);

console.log('All component files fixed successfully!');
