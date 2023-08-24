import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dtos/auth.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenGuard } from './guard/jwt-refresh.guard';
import { GetUser } from './decorator/get-user.decorator';
import { IDataThirdParty } from './interfaces/auth.interface';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Đăng nhập và hệ thống' })
  @Public()
  @Post('login')
  // @UseInterceptors(ResponseLoginInterceptor)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(dto);
    const { refreshToken, ...resp } = data;
    res.cookie('auth-cookie', refreshToken, { httpOnly: true });
    return resp;
  }

  @ApiOperation({ summary: 'Đăng kí tài khoản' })
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'refreshToken' })
  @UseGuards(RefreshTokenGuard)
  @Public()
  @Post('refresh-token')
  async refreshToken(
    @GetUser('id') userId: number,
    @GetUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.refreshTokens(userId, refreshToken);
    res.cookie('auth-cookie', token.refreshToken, { httpOnly: true });
    return { accessToken: token.accessToken };
  }

  @ApiOperation({ summary: 'logout' })
  @Post('logout')
  async logout(
    @GetUser('id') userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('auth-cookie', '', { maxAge: -1 });
    return this.authService.logout(userId);
  }

  @ApiOperation({ summary: 'forgot-password' })
  @Post('forgot-password')
  async forgot(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgot(dto);
  }

  @ApiOperation({ summary: 'reset-password' })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const resp = await this.authService.thirdPartyLogin(req.user);
    res.cookie('auth-cookie', resp.refreshToken, { httpOnly: true });
    res.redirect(`http://localhost:3000/login?accessToken=${resp.accessToken}`);
    return this.authService.thirdPartyLogin(req.user);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req: Request) {}

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req: Request) {
    const user = req.user;
    return this.authService.thirdPartyLogin(user);
  }
}
