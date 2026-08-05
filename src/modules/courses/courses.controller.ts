import { Controller, Get, Post, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';

import { CoursesService } from './courses.service';
import { CreateCourseDto, PaginationQueryDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Create a new course' })
  create(@Body() createCourseDto: CreateCourseDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.coursesService.create(createCourseDto, userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  @ApiOperation({ summary: 'Get all courses with pagination and search' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  @ApiOperation({ summary: 'Get course details by ID' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }
}