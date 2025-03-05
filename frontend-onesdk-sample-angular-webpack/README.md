# frontend-onesdk-sample-angular-webpack
FrankieOne OneSDK integration sample using Angular with webpack

## How to run
- Install dependencies `npm i`
- Create a `.env` file based on the `.env.example` template and add your API keys and customer IDs
- Start the server with `node server.js` which will serve the Angular app and provide secure API endpoints
- Alternatively, for development, you can run `npm run start` or `ng serve`

## Environment Configuration
This application uses a secure approach to handle sensitive API keys and customer IDs:

1. Server-side environment variables are stored in a `.env` file (not committed to version control)
2. The Angular application fetches configuration from the server via API endpoints
3. No sensitive information is compiled into the client-side JavaScript

### API Environment
- The application is configured to use the UAT environment by default: `https://backend.kycaml.uat.frankiefinancial.io`
- If you need to use a different environment, update the `BASE_API_URL` in your `.env` file

## API Endpoints
- `/api/config` - Returns the environment configuration for the client
- `/api/get-token` - Generates a session token for OneSDK authentication

## Development Mode
- In development mode, if API credentials are not available, the application will use mock tokens
- This allows for testing the UI and flow without valid API credentials
- Mock tokens are only provided in development mode and will not work in production
- You will see console warnings when mock tokens are being used

## Build for Production
- Run `npm run build` to create a production build
- The build artifacts will be stored in the `dist/` directory
- Deploy the application with `node server.js`
- Ensure your `.env` file contains valid API credentials for production use

## Troubleshooting
- If you encounter port conflicts, check the `PORT` variable in your `.env` file
- Make sure the port in the environment files (`environment.ts` and `environment.development.ts`) matches the server port
- You can run the `fix-environment-ports.js` script to automatically fix port mismatches
- For circular dependency errors, run the `fix-token-service.js` script
- If you see "503 Service Temporarily Unavailable" errors, check that you're using the correct API URL for your environment