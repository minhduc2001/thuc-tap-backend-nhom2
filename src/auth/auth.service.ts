import { config } from '@/base/config';
import { LoggerService } from '@/base/logger';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IDataThirdParty,
  IJWTPayload,
  ITokens,
} from './interfaces/auth.interface';
import * as exc from '@base/api/exception.reslover';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dtos/auth.dto';
import { User } from '@/user/user.entity';
import { MailerService } from '@/mailer/mailer.service';
import { generateUUID } from '@/base/helper/function.helper';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly loggerService: LoggerService,
  ) {}

  logger = this.loggerService.getLogger(AuthService.name);

  private readonly otps: Map<string, string> = new Map();

  generateOtp(): string {
    const otp = generateUUID();
    return otp;
  }

  storeOtp(email: string, otp: string): void {
    this.otps.set(email, otp);
  }

  getOtp(email: string): string | undefined {
    return this.otps.get(email);
  }

  clearOtp(email: string): void {
    this.otps.delete(email);
  }

  async login(dto: LoginDto): Promise<any> {
    const { email, password } = dto;
    const user = await this.userService.getUserByUniqueKey({ email });
    if (!user || !user.comparePassword(password))
      throw new exc.BadRequest({
        message: 'email or password does not exists',
      });

    const payload: IJWTPayload = {
      sub: user.id,
      uav: new Date().getTime(),
    };
    const tokens: ITokens = await this.getTokens(payload);

    await this.updateRefreshToken(user, tokens.refreshToken);
    return {
      ...user,
      ...tokens,
    };
  }

  async register(dto: RegisterDto) {
    const isExists = await this.userService.getUserByUniqueKey({
      email: dto.email,
    });

    if (isExists) throw new exc.BadRequest({ message: 'email already is use' });
    return this.userService.createUser(dto);
  }

  async updateRefreshToken(user: User, refreshToken: string) {
    user.setRefreshToken(refreshToken);
    // user.refreshToken = refreshToken;
    await this.userService.update(user);
    return;
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.getUserById(userId);
    if (!user || !user.refreshToken)
      throw new exc.Forbidden({ message: 'Access Denied' });

    const refreshTokenMatches = user.compareRefreshToken(refreshToken);
    if (!refreshTokenMatches)
      throw new exc.Forbidden({ message: 'Access Denied 1' });

    const tokens: ITokens = await this.getTokens({ sub: userId }, refreshToken);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  async getTokens(payload: IJWTPayload, oldRefreshToken?: string) {
    let expire: any = null;
    if (oldRefreshToken) {
      expire = this.jwtService.decode(oldRefreshToken);
    }
    // console.log(expire.exp);

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: config.JWT_RT_SECRET,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number) {
    const user = await this.userService.getUser(userId);
    user.refreshToken = '';
    await user.save();
  }

  async forgot(dto: ForgotPasswordDto) {
    const user = await this.userService.getUserByUniqueKey({
      email: dto.email,
    });
    if (!user) throw new exc.BadRequest({ message: 'không tồn tại email này' });
    const otp = this.generateOtp();

    this.storeOtp(dto.email, otp);
    console.log(this.otps);
    await this.mailerService.sendMail(user.email, 'Reset password', otp);
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { email, otp, newPassword } = dto;

    const user = await this.userService.getUserByUniqueKey({
      email: dto.email,
    });
    if (!user) throw new exc.BadRequest({ message: 'không tồn tại email này' });

    console.log(this.otps);

    const storedOtp = this.getOtp(email);
    if (!storedOtp || storedOtp !== otp) {
      throw new exc.BadRequest({ message: 'Invalid OTP.' });
    }

    user.setPassword(newPassword);
    await user.save();
    this.clearOtp(email);
    return true;
  }

  async thirdPartyLogin(data: any) {
    if (data.provider == 'google') {
      let user = await this.userService.getUserByUniqueKey({
        email: data.email,
      });

      if (!user) {
        // user = await this.userService.createUser({...data})
      }

      const payload: IJWTPayload = {
        sub: user.id,
        uav: new Date().getTime(),
      };
      const tokens: ITokens = await this.getTokens(payload);

      await this.updateRefreshToken(user, tokens.refreshToken);
      return {
        ...user,
        ...tokens,
      };
    }
    if (data.provider == 'facebook') {
    }
  }
}
