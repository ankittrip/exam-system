import { 
  Injectable, 
  ConflictException, 
  NotFoundException, 
  BadRequestException  
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto, PaginationQueryDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, instructorId: string) {
    const instructor = await this.prisma.user.findUnique({ where: { id: instructorId } });
    if (!instructor) {
      throw new NotFoundException('Assigned user not found');
    }
    if (instructor.role !== 'INSTRUCTOR') {
      throw new BadRequestException('Assigned user must have the INSTRUCTOR role to teach a course');
    }

    const existingCourse = await this.prisma.course.findUnique({
      where: { code: createCourseDto.code },
    });

    if (existingCourse) {
      throw new ConflictException('Course code already exists');
    }

    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        instructorId,
      },
    });
  }

  async findAll(query: PaginationQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const whereClause = query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: 'insensitive' as const } },
            { code: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: query.sortOrder || 'desc' },
        include: {
          instructor: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      this.prisma.course.count({ where: whereClause }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { instructor: { select: { firstName: true, lastName: true } } },
    });

    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
}