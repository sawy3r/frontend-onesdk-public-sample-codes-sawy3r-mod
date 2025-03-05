# Changes Made to the FrankieOne OneSDK Angular Sample

## Overview
This document summarizes the changes made to the FrankieOne OneSDK Angular sample application to improve security and fix TypeScript errors.

## Security Improvements

### Environment Variables
- Moved sensitive API keys and customer IDs from client-side environment files to server-side `.env` file
- Updated environment files to only include safe configuration values for client-side usage
- Added `CONFIG_ENDPOINT` and `TOKEN_ENDPOINT` properties to environment files
- Fixed environment files to use the correct port (3000) for API endpoints
- Updated API URL to use the UAT environment (`https://backend.kycaml.uat.frankiefinancial.io`)

### Server-Side API
- Implemented Express server to handle API requests and serve the Angular application
- Created endpoints for configuration and token requests
- Ensured sensitive information is not exposed in client-side code
- Added detailed error logging for API requests
- Improved error handling for API responses

### Development Mode Support
- Added mock token generation for development mode when API credentials are not available
- Improved error handling in the token service to provide better debugging information
- Added clear warnings when using mock tokens to prevent accidental use in production
- Enhanced mock tokens to use proper JWT format for compatibility with OneSDK

## TypeScript Error Fixes

### Component Updates
- Updated all components to use the `EnvironmentConfigService` instead of directly accessing environment variables
- Fixed TypeScript errors related to accessing properties from an index signature
- Updated the `OnesdkTokenService` to use the new environment configuration approach
- Fixed issues with `oneSdk` vs `OneSDK` usage in component files

### Circular Dependency Fix
- Simplified the `OnesdkTokenService` to remove unnecessary dependencies
- Updated the service to only use the HttpClient for token requests
- Removed the private `getConfig` method that was causing circular dependencies
- Updated all components to use the simplified token service

### TypeScript Warning Fixes
- Added exclusions to tsconfig.json to prevent warnings about unused files in node_modules
- Fixed the warning about @reduxjs/toolkit/dist/uncheckedindexed.ts being part of the TypeScript compilation

### Scripts Created
1. `update-components.js` - Initial script to update component files
2. `fix-async.js` - Fixed the double async issue in component files
3. `fix-onesdk.js` - Fixed the `oneSdk` vs `OneSDK` issue and remaining environment references
4. `fix-onesdk-context.js` - Fixed the OneSDK context issue by properly initializing the SDK
5. `fix-token-service.js` - Fixed the circular dependency issue in the token service
6. `fix-environment-ports.js` - Fixed the environment files to use the correct port for API endpoints
7. `fix-typescript-warnings.js` - Fixed TypeScript warnings by updating tsconfig.json

## Build Process
- Ensured the application builds successfully without TypeScript errors
- Added documentation for the build and deployment process
- Added HttpClientModule to the app module to ensure HTTP requests work correctly

## Next Steps
1. Test the application thoroughly with real API keys
2. Consider adding more robust error handling for API requests
3. Implement proper logging for debugging purposes
4. Add unit tests for the new services and components
