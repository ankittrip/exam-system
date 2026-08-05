import { IsString, IsNumber, IsBoolean, IsDateString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({ example: 'Mid-Term DSA Exam' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'Covers Arrays and HashMaps' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'ID of the associated Course' })
  @IsString()
  courseId!: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsNumber()
  duration!: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  totalMarks!: number;

  @ApiProperty({ example: 40 })
  @IsNumber()
  passingMarks!: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  negativeMarking?: boolean;

  @ApiPropertyOptional({ example: 0.25 })
  @IsOptional()
  @IsNumber()
  negativeMarks?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  randomQuestions?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  maxAttempts?: number;

  @ApiProperty({ example: '2026-08-10T10:00:00Z' })
  @IsDateString()
  startTime!: string;

  @ApiProperty({ example: '2026-08-10T11:00:00Z' })
  @IsDateString()
  endTime!: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Array of Question IDs to add to this exam',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questionIds?: string[];
}