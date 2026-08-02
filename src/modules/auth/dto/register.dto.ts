import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    example: 'Ankit',
  })
  @IsString()
  @Length(2, 50)
  firstName: string;

  @ApiProperty({
    example: 'Tripathi',
  })
  @IsString()
  @Length(2, 50)
  lastName: string;

  @ApiProperty({
    example: 'ankit@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Ankit@123',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiPropertyOptional({
    example: '9876543210',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    enum: Role,
    default: Role.STUDENT,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}