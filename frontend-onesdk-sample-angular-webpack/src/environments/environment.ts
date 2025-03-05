/**
 * This environment file is designed to be safe for client-side usage.
 * It does NOT contain any sensitive API keys or credentials.
 * Those are now handled server-side.
 */
export const environment = {
	// API endpoint to fetch configuration
	CONFIG_ENDPOINT: 'http://localhost:3000/api/config',
	// API endpoint to get token
	TOKEN_ENDPOINT: 'http://localhost:3000/api/get-token',
	// Flag to indicate if we're in production mode
	production: true
};
