import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Data Structures and Algorithms' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'CS201' })
  @IsString()
  code!: string;

  @ApiPropertyOptional({ example: 'Core concepts of DSA' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  limit?: string;

  @ApiPropertyOptional({ description: 'Search term for title or code' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}