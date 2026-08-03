import { Controller, Get, Param, Res, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import PDFDocument = require('pdfkit');

import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get('exam/:examId')
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Get all results for a specific exam' })
  getExamResults(@Param('examId') examId: string, @Req() req: Request) {
    const user = req.user as any;
    return this.resultsService.getExamResults(examId, user.id, user.role);
  }

  @Get(':attemptId')
  @Roles(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Get detailed result for a specific attempt' })
  getStudentResult(@Param('attemptId') attemptId: string, @Req() req: Request) {
    const user = req.user as any;
    return this.resultsService.getStudentResult(attemptId, user.id, user.role);
  }

  @Get(':attemptId/download')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Download Result as PDF' })
  async downloadResultPDF(@Param('attemptId') attemptId: string, @Res() res: Response, @Req() req: Request) {
    const user = req.user as any;
    

    const result = await this.resultsService.getStudentResult(attemptId, user.id, user.role);


    const doc = new PDFDocument({ margin: 50 });
    

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Scorecard_${attemptId}.pdf`);
    

    doc.pipe(res);


    doc.fontSize(24).text('Online Examination System', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(18).text('Official Scorecard', { align: 'center', underline: true });
    doc.moveDown(2);


    doc.fontSize(14).text(`Exam Title: ${result.attempt.exam.title}`);
    doc.text(`Attempt ID: ${attemptId}`);
    

    const publishDate = result.publishedAt ? new Date(result.publishedAt) : new Date();
    doc.text(`Date: ${publishDate.toLocaleDateString()}`);
    doc.moveDown();


    doc.text(`Total Marks: ${result.totalMarks}`);
    doc.text(`Obtained Marks: ${result.obtainedMarks}`);
    doc.text(`Percentage: ${result.percentage.toFixed(2)}%`);
    
    doc.moveDown();
    

    const statusText = result.isPassed ? 'PASSED' : 'FAILED';
    doc.fillColor(result.isPassed ? 'green' : 'red')
       .fontSize(20)
       .text(`Status: ${statusText}`, { align: 'center' });


    doc.end();
  }
}