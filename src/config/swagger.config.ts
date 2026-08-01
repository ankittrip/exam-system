import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  title: 'Online Examination System API',
  description: 'REST API documentation for the Online Examination System.',
  version: '1.0.0',
  path: 'api/docs',
}));