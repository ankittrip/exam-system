import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}


  async getStudentResult(attemptId: string, userId: string, userRole: Role) {
    const result = await this.prisma.result.findUnique({
      where: { attemptId },
      include: {
        attempt: {
          include: {
            exam: { select: { title: true, courseId: true, instructorId: true } },
            answers: {
              include: {
                question: { select: { question: true, type: true, marks: true } },
                selectedOption: { select: { text: true, isCorrect: true } }
              }
            }
          }
        }
      }
    });

    if (!result) throw new NotFoundException('Result not found');


    if (userRole === Role.STUDENT && result.attempt.studentId !== userId) {
      throw new ForbiddenException('You can only view your own results');
    }

    return result;
  }


  async getExamResults(examId: string, instructorId: string, userRole: Role) {
    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Exam not found');

    if (userRole === Role.INSTRUCTOR && exam.instructorId !== instructorId) {
      throw new ForbiddenException('You can only view results of your own exams');
    }

    const results = await this.prisma.result.findMany({
      where: { attempt: { examId } },
      include: {
        attempt: {
          select: {
            student: { select: { firstName: true, lastName: true, email: true } },
            attemptNumber: true,
            timeTaken: true,
          }
        }
      },
      orderBy: { percentage: 'desc' }
    });

    return {
      examTitle: exam.title,
      totalParticipants: results.length,
      results
    };
  }
}