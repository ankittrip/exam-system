import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import swaggerConfig from './config/swagger.config';

import { PrismaModule } from './prisma/prisma.module';

import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';    
import { QuestionsModule } from './modules/questions/questions.module'; 
import { ExamsModule } from './modules/exams/exams.module';             
import { AttemptsModule } from './modules/attempts/attempts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        swaggerConfig,
      ],
    }),

    PrismaModule,

    AuthModule,
    HealthModule,
    
    CoursesModule,   
    QuestionsModule, 
    ExamsModule, AttemptsModule,     
  ],
})
export class AppModule {}