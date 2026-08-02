import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StartExamDto } from './dto/attempt.dto';
import { AttemptStatus, ExamStatus } from '@prisma/client';

@Injectable()
export class AttemptsService {
  constructor(private readonly prisma: PrismaService) {}

  async startExam(startExamDto: StartExamDto, studentId: string) {
    const { examId } = startExamDto;

    // 1. Fetch Exam Details
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) throw new NotFoundException('Exam not found');

    // 2. Check how many attempts this student has already made for this exam
    const previousAttemptsCount = await this.prisma.studentAttempt.count({
      where: { examId, studentId },
    });

    if (previousAttemptsCount >= exam.maxAttempts) {
      throw new ForbiddenException(`Maximum attempts (${exam.maxAttempts}) reached for this exam.`);
    }

    const nextAttemptNumber = previousAttemptsCount + 1;

    // 3. Create the StudentAttempt record (Timer starts now!)
    const attempt = await this.prisma.studentAttempt.create({
      data: {
        examId,
        studentId,
        attemptNumber: nextAttemptNumber,
        startedAt: new Date(), // Matches schema field
        status: AttemptStatus.STARTED,
      },
    });

    return {
      message: 'Exam started successfully. Timer has begun!',
      attemptId: attempt.id,
      attemptNumber: attempt.attemptNumber,
      durationMinutes: exam.duration,
      startedAt: attempt.startedAt,
    };
  }
}