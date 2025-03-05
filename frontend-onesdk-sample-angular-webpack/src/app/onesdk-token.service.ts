import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// Define the session response interface to match what the SDK expects
interface SessionResponse {
  token: string;
  [key: string]: any;
}

@Injectable({
	providedIn: 'root'
})
export class OnesdkTokenService {

	constructor(private http: HttpClient) { }

	// Helper method to create a properly formatted mock JWT token
	private createMockJwtToken(): string {
		// Create a properly formatted JWT token for development
		// This is a minimal JWT structure with header, payload, and signature parts
		const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
		const payload = btoa(JSON.stringify({ 
			sub: 'mock-user-id',
			name: 'Mock User',
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
			permissions: {
				preset: "one-sdk"
			}
		}));
		const signature = btoa('mock-signature');
		
		return `${header}.${payload}.${signature}`;
	}

	getToken = async (): Promise<SessionResponse> => {
		try {
			// Use the server-side endpoint to get the token securely
			const response = await firstValueFrom<SessionResponse>(
				this.http.post<SessionResponse>(environment.TOKEN_ENDPOINT, {})
			);
			
			// Make sure the response has the token property that the SDK expects
			if (!response.token && response['sessionToken']) {
				response.token = response['sessionToken'];
			}
			
			// If we still don't have a token, check if we have an error message
			if (!response.token) {
				if (response['message'] || response['error']) {
					console.error('Token service error:', response['message'] || response['error']);
				}
				
				// For development/testing purposes only - provide a mock token
				// In production, you should never do this and instead ensure proper credentials are set
				if (environment.production === false) {
					console.warn('Using mock token for development. DO NOT USE IN PRODUCTION!');
					
					const mockJwtToken = this.createMockJwtToken();
					
					return {
						token: mockJwtToken,
						sessionId: 'mock-session-id',
						sessionToken: mockJwtToken
					};
				}
			}
			
			return response;
		} catch (error) {
			console.error('Error getting token:', error);
			
			// For development/testing purposes only - provide a mock token
			// In production, you should never do this and instead ensure proper credentials are set
			if (environment.production === false) {
				console.warn('Using mock token for development. DO NOT USE IN PRODUCTION!');
				
				const mockJwtToken = this.createMockJwtToken();
				
				return {
					token: mockJwtToken,
					sessionId: 'mock-session-id',
					sessionToken: mockJwtToken
				};
			}
			
			throw error;
		}
	};
}
