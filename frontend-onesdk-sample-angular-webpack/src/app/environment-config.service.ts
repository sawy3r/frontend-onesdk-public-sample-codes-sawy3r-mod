import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

export interface EnvironmentConfig {
  BASE_API_URL: string;
  API_CREATE_SESSION_PATH: string;
  GOOGLE_API_KEY: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentConfigService {
  private config: EnvironmentConfig | null = null;

  constructor(private http: HttpClient) {}

  async getConfig(): Promise<EnvironmentConfig> {
    if (!this.config) {
      this.config = await firstValueFrom(
        this.http.get<EnvironmentConfig>(environment.CONFIG_ENDPOINT)
      );
    }
    return this.config;
  }

  async getGoogleApiKey(): Promise<string> {
    const config = await this.getConfig();
    return config.GOOGLE_API_KEY;
  }
}
