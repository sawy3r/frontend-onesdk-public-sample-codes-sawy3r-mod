/**
 * This script fixes TypeScript warnings by updating the tsconfig.json file
 * to exclude specific files or patterns that cause warnings.
 */

const fs = require('fs');
const path = require('path');

const tsconfigPath = path.join(__dirname, 'tsconfig.json');

try {
  console.log('Reading tsconfig.json...');
  const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
  
  // Parse the tsconfig.json file, preserving the comment at the top
  const commentMatch = tsconfigContent.match(/^\/\*[\s\S]*?\*\//);
  const comment = commentMatch ? commentMatch[0] + '\n' : '';
  
  // Remove the comment before parsing
  const jsonContent = tsconfigContent.replace(/^\/\*[\s\S]*?\*\/\s*/, '');
  const tsconfig = JSON.parse(jsonContent);

  // Add exclude property if it doesn't exist
  if (!tsconfig.exclude) {
    tsconfig.exclude = [];
  }

  // Add specific exclusions for known warning sources
  const exclusionsToAdd = [
    'node_modules/@reduxjs/toolkit/dist/uncheckedindexed.ts'
  ];

  let modified = false;
  for (const exclusion of exclusionsToAdd) {
    if (!tsconfig.exclude.includes(exclusion)) {
      console.log(`Adding exclusion: ${exclusion}`);
      tsconfig.exclude.push(exclusion);
      modified = true;
    }
  }

  if (modified) {
    console.log('Writing updated tsconfig.json...');
    // Add the comment back to the beginning of the file
    const updatedContent = comment + JSON.stringify(tsconfig, null, 2);
    fs.writeFileSync(tsconfigPath, updatedContent, 'utf8');
    console.log('tsconfig.json updated successfully!');
  } else {
    console.log('No changes needed for tsconfig.json');
  }
} catch (error) {
  console.error('Error updating tsconfig.json:', error);
}
