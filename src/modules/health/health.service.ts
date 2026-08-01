import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  getHealth() {
    return {
      success: true,
      message: 'Online Examination System API is running',
      app: this.configService.get<string>('app.name'),
      version: this.configService.get<string>('app.version'),
      environment: this.configService.get<string>('app.nodeEnv'),
      timestamp: new Date().toISOString(),
    };
  }
}