import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  title: 'Online Examination System API',
  description: 'REST API Documentation',
  version: '1.0.0',
  path: 'api/docs',
}));