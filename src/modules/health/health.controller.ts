import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Check API health',
    description: 'Returns application health information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is running successfully.',
  })
  getHealth() {
    return this.healthService.getHealth();
  }
}