import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'Ankit@123',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: 'NewPassword@123',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;
}