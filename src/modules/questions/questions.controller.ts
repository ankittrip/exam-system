import { Controller, Get, Post, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express'; // Strict type import

import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { PaginationQueryDto } from '../courses/dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Question Bank')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.INSTRUCTOR) 
  @ApiOperation({ summary: 'Create a new question (MCQ or Coding)' })
  create(@Body() createQuestionDto: CreateQuestionDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.questionsService.create(createQuestionDto, userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Get all questions with pagination and search' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.questionsService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Get a specific question by ID' })
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }
}