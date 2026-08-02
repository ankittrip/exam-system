import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';

import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { PaginationQueryDto } from '../courses/dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Create a new Exam (Admin/Instructor)' })
  create(@Body() createExamDto: CreateExamDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.examsService.create(createExamDto, userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  @ApiOperation({ summary: 'Get all exams (Students only see Published)' })
  findAll(@Query() query: PaginationQueryDto, @Req() req: Request) {
    const userRole = (req.user as any).role;
    return this.examsService.findAll(query, userRole);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  @ApiOperation({ summary: 'Get exam details' })
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }
}