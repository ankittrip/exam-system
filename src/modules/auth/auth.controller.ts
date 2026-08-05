import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import type { Request } from 'express';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }


  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Login user',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }



  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({
    summary: 'Logout current user',
  })
  logout(@Req() req: Request) {
    return this.authService.logout((req.user as any).id);
  }



  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
  })
  profile(@Req() req: Request) {
    return this.authService.profile((req.user as any).id);
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('change-password')
  @ApiOperation({
    summary: 'Change current user password',
  })
  changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      (req.user as any).id,
      changePasswordDto,
    );
  }
}