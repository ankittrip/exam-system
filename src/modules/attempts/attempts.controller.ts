import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';

import { AttemptsService } from './attempts.service';
import { StartExamDto, SubmitExamDto } from './dto/attempt.dto'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Exam Attempts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post('start')
  @Roles(Role.STUDENT) 
  @ApiOperation({ summary: 'Start an exam attempt' })
  startExam(@Body() startExamDto: StartExamDto, @Req() req: Request) {
    const studentId = (req.user as any).id;
    return this.attemptsService.startExam(startExamDto, studentId);
  }

  @Post('submit')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Submit exam answers and auto-evaluate' })
  submitExam(@Body() submitExamDto: SubmitExamDto, @Req() req: Request) {
    const studentId = (req.user as any).id;
    return this.attemptsService.submitExam(submitExamDto, studentId);
  }


  @Get('history')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get student exam history and previous attempts' })
  getHistory(@Req() req: Request) {
    const studentId = (req.user as any).id;
    return this.attemptsService.getStudentHistory(studentId);
  }
}