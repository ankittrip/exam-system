import { IsString, IsArray, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartExamDto {
  @ApiProperty({ example: 'exam_id_here' })
  @IsString()
  @IsNotEmpty()
  examId: string;
}

export class AnswerSubmitDto {
  @ApiProperty({ example: 'question_id_here' })
  @IsString()
  questionId: string;

  @ApiPropertyOptional({ example: 'option_id_here' })
  @IsOptional()
  @IsString()
  selectedOptionId?: string;

  @ApiPropertyOptional({ example: 'public class Solution { ... }' })
  @IsOptional()
  @IsString()
  codeSubmitted?: string;
}

export class SubmitExamDto {
  @ApiProperty({ example: 'attempt_id_here' })
  @IsString()
  @IsNotEmpty()
  attemptId: string;

  @ApiProperty({ type: [AnswerSubmitDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerSubmitDto)
  answers: AnswerSubmitDto[];
}