import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'ankit@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Ankit@123',
  })
  @IsString()
  password: string;
}