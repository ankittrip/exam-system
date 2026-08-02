import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionType } from '@prisma/client';
import { PaginationQueryDto } from '../courses/dto/create-course.dto'; 

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto, instructorId: string) {
    if (
      createQuestionDto.type === QuestionType.MCQ &&
      (!createQuestionDto.options || createQuestionDto.options.length < 2)
    ) {
      throw new BadRequestException('MCQ questions must have at least 2 options.');
    }

    const { options, ...questionData } = createQuestionDto;

    // Prisma nested write logic for MCQs
    const createPayload: any = {
      ...questionData,
      createdById: instructorId,
    };

    if (createQuestionDto.type === QuestionType.MCQ) {
      createPayload.options = {
        create: (options || []).map((opt, index) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
          order: opt.order || index + 1,
        })),
      };
    }

    return this.prisma.question.create({
      data: createPayload,
      include: {
        options: true,
      },
    });
  }

  async findAll(query: PaginationQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const whereClause = query.search
      ? {
          question: { contains: query.search, mode: 'insensitive' as const },
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.question.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: query.sortOrder || 'desc' },
        include: { options: true }, 
      }),
      this.prisma.question.count({ where: whereClause }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { options: true, createdBy: { select: { firstName: true, lastName: true } } },
    });

    if (!question) throw new NotFoundException('Question not found');
    return question;
  }
}