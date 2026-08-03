import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getExamLeaderboard(examId: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Exam not found');


    const topResults = await this.prisma.result.findMany({
      where: {
        attempt: { examId },
        isPassed: true,
      },
      include: {
        attempt: {
          select: {
            timeTaken: true,
            student: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: {
        obtainedMarks: 'desc',
      },
      take: 10,
    });


    return topResults.map((result, index) => ({
      rank: index + 1,
      studentName: `${result.attempt.student.firstName} ${result.attempt.student.lastName}`,
      score: result.obtainedMarks,
      percentage: `${result.percentage.toFixed(2)}%`,
      timeTakenSeconds: result.attempt.timeTaken,
    }));
  }
}