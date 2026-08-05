import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StartExamDto, SubmitExamDto } from './dto/attempt.dto';
import { AttemptStatus, ExamStatus, ResultStatus } from '@prisma/client';

@Injectable()
export class AttemptsService {
  constructor(private readonly prisma: PrismaService) {}

  async startExam(startExamDto: StartExamDto, studentId: string) {
    const { examId } = startExamDto;

    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) throw new NotFoundException('Exam not found');

    const previousAttemptsCount = await this.prisma.studentAttempt.count({
      where: { examId, studentId },
    });

    if (previousAttemptsCount >= exam.maxAttempts) {
      throw new ForbiddenException(`Maximum attempts (${exam.maxAttempts}) reached for this exam.`);
    }

    const nextAttemptNumber = previousAttemptsCount + 1;

    const attempt = await this.prisma.studentAttempt.create({
      data: {
        examId,
        studentId,
        attemptNumber: nextAttemptNumber,
        startedAt: new Date(),
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


  async submitExam(submitExamDto: SubmitExamDto, studentId: string) {
    const { attemptId, answers } = submitExamDto;


    const attempt = await this.prisma.studentAttempt.findUnique({
      where: { id: attemptId },
      include: { exam: { include: { questions: { include: { question: { include: { options: true } } } } } } },
    });

    if (!attempt) throw new NotFoundException('Exam attempt not found');
    if (attempt.studentId !== studentId) {
      throw new ForbiddenException('You are not authorized to submit this attempt.');
    }
    if (attempt.status === AttemptStatus.SUBMITTED) {
      throw new BadRequestException('This exam attempt has already been submitted.');
    }

    const exam = attempt.exam;
    let totalObtainedMarks = 0;
    const evaluatedAnswers: any[] = [];


    for (const ans of answers) {
      const examQuestion = exam.questions.find(eq => eq.questionId === ans.questionId);
      if (!examQuestion) continue; 

      const question = examQuestion.question;
      let isCorrect = false;
      let obtainedMarks = 0;

  
      if (question.type === 'MCQ' && ans.selectedOptionId) {
        const selectedOption = question.options.find(opt => opt.id === ans.selectedOptionId);
        if (selectedOption && selectedOption.isCorrect) {
          isCorrect = true;
          obtainedMarks = question.marks;
        } else {
          if (exam.negativeMarking && exam.negativeMarks) {
            obtainedMarks = -exam.negativeMarks;
          }
        }
      } 

      else if (question.type === 'CODING' && ans.codeSubmitted) {
        isCorrect = true; 
        obtainedMarks = question.marks;
      }

      totalObtainedMarks += obtainedMarks;

      evaluatedAnswers.push({
        attemptId,
        questionId: ans.questionId,
        selectedOptionId: ans.selectedOptionId || null,
        submittedCode: ans.codeSubmitted || null,
        isCorrect,
        obtainedMarks,
      });
    }


    totalObtainedMarks = Math.max(0, totalObtainedMarks);
    const percentage = (totalObtainedMarks / exam.totalMarks) * 100;
    const isPassed = totalObtainedMarks >= exam.passingMarks;
    const timeTaken = Math.floor((new Date().getTime() - new Date(attempt.startedAt).getTime()) / 1000); // in seconds


    const result = await this.prisma.$transaction(async (tx) => {
      for (const ansData of evaluatedAnswers) {
        await tx.studentAnswer.upsert({
          where: { attemptId_questionId: { attemptId, questionId: ansData.questionId } },
          update: ansData,
          create: ansData,
        });
      }


      const updatedAttempt = await tx.studentAttempt.update({
        where: { id: attemptId },
        data: {
          status: AttemptStatus.SUBMITTED,
          submittedAt: new Date(),
          obtainedMarks: totalObtainedMarks,
          percentage,
          timeTaken,
        },
      });


      const examResult = await tx.result.create({
        data: {
          attemptId,
          totalMarks: exam.totalMarks,
          obtainedMarks: totalObtainedMarks,
          percentage,
          isPassed,
          status: ResultStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      });

      return { updatedAttempt, examResult };
    });
    

    return {
      message: 'Exam submitted and evaluated successfully!',
      resultId: result.examResult.id,
      totalMarks: exam.totalMarks,
      obtainedMarks: totalObtainedMarks,
      percentage: `${percentage.toFixed(2)}%`,
      isPassed,
    };
  }

  async getStudentHistory(studentId: string) {
    return this.prisma.studentAttempt.findMany({
      where: { studentId },
      include: { 
        exam: { select: { title: true, courseId: true } }, 
        result: true 
      },
      orderBy: { startedAt: 'desc' }
    });
  }
}

