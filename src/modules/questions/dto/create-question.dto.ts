import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionType, Difficulty, ProgrammingLanguage } from '@prisma/client';

export class CreateOptionDto {
  @ApiProperty({ example: 'O(n)' })
  @IsString()
  text!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCorrect!: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class CreateQuestionDto {
  @ApiProperty({ example: 'What is the time complexity of binary search?' })
  @IsString()
  question!: string;

  @ApiPropertyOptional({ example: 'It divides the array in half each time.' })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  type!: QuestionType;

  @ApiProperty({ enum: Difficulty })
  @IsEnum(Difficulty)
  difficulty!: Difficulty;

  @ApiProperty({ example: 2 })
  @IsNumber()
  marks!: number;


  @ApiPropertyOptional({ type: [CreateOptionDto] })
  @ValidateIf((o) => o.type === QuestionType.MCQ)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];


  @ApiPropertyOptional({ enum: ProgrammingLanguage })
  @ValidateIf((o) => o.type === QuestionType.CODING)
  @IsEnum(ProgrammingLanguage)
  language?: ProgrammingLanguage;

  @ApiPropertyOptional({ example: 'function solve(arr) {\n\n}' })
  @ValidateIf((o) => o.type === QuestionType.CODING)
  @IsString()
  starterCode?: string;

  @ApiPropertyOptional({
    example: [{ input: '[1, 2, 3]', expectedOutput: '6' }],
  })
  @ValidateIf((o) => o.type === QuestionType.CODING)
  @IsArray()
  testCases?: any[];
}