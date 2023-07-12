import { Body, Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { LoginDto, RegisterDto } from './dtos/auth.dto';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Đăng nhập và hệ thống' })
  @Public()
  @Post('login')
  //   @UseInterceptors(ResponseLoginInterceptor)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(dto);
    res.cookie('auth-cookie', data.refreshToken, { httpOnly: true });
    return data;
  }

  @ApiOperation({ summary: 'Đăng kí tài khoản' })
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
