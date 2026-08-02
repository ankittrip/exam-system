import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { PaginationQueryDto } from '../courses/dto/create-course.dto';
import { ExamStatus, Role } from '@prisma/client';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto, instructorId: string) {
    const { questionIds, ...examData } = createExamDto;

    const course = await this.prisma.course.findUnique({
      where: { id: examData.courseId },
    });
    
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const exam = await this.prisma.exam.create({
      data: {
        ...examData,
        startTime: new Date(examData.startTime),
        endTime: new Date(examData.endTime),
        instructorId,
        questions: questionIds
          ? {
              create: (questionIds || []).map((qId, index) => ({
                question: { connect: { id: qId } },
                order: index + 1,
              })),
            }
          : undefined,
      },
      include: {
        questions: true,
      },
    });

    return exam;
  }

  async findAll(query: PaginationQueryDto, userRole: Role) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const whereClause: any = query.search
      ? { title: { contains: query.search, mode: 'insensitive' as const } }
      : {};

    if (userRole === Role.STUDENT) {
      whereClause.status = ExamStatus.PUBLISHED;
    }

    const [data, total] = await Promise.all([
      this.prisma.exam.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: query.sortOrder || 'desc' },
        include: {
          course: { select: { title: true, code: true } },
          _count: { select: { questions: true } },
        },
      }),
      this.prisma.exam.count({ where: whereClause }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        course: { select: { title: true } },
        questions: {
          include: {
            question: { select: { question: true, type: true, marks: true } },
          },
          orderBy: { order: 'asc' }
        },
      },
    });

    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }
}