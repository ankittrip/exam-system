import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { WinstonLogger } from './common/logger/winston.logger'; // ✅ Imported WinstonLogger

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLogger,
  });

  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());

  // Compression
  app.use(compression());

  // Cookie Parser
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Response Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title')!)
    .setDescription(configService.get<string>('swagger.description')!)
    .setVersion(configService.get<string>('swagger.version')!)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(
    configService.get<string>('swagger.path')!,
    app,
    document,
  );

  const port = configService.get<number>('app.port') || 3000;

  await app.listen(port);


  Logger.log(`Server running on http://localhost:${port}/api/v1`, 'Bootstrap');
  Logger.log(
    `Swagger Docs: http://localhost:${port}/${configService.get<string>('swagger.path')}`,
    'Bootstrap',
  );
}

bootstrap();