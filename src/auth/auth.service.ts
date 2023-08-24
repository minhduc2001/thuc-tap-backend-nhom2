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
  ActiveUserDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dtos/auth.dto';
import { User } from '@/user/user.entity';
import { MailerService } from '@/mailer/mailer.service';
import { generateUUID } from '@/base/helper/function.helper';
import { RedisService } from '@/base/redis/redis.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly loggerService: LoggerService,
    private readonly redisService: RedisService,
  ) {}

  logger = this.loggerService.getLogger(AuthService.name);

  generateOtp(): string {
    const otp = generateUUID();
    return otp;
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
    const user = await this.userService.createUser(dto);
    const otp = this.generateOtp();
    await this.redisService.setWithExpiration(`ACTIVE${user.id}`, otp, 600);
    await this.mailerService.sendMail(
      user.email,
      'Kich hoat tai khoan',
      `Ma se het han sau 10 phut : ${otp}`,
    );

    return true;
  }

  async activeUser(dto: ActiveUserDto) {
    const otp = await this.redisService.get(`ACTIVE${dto.id}`);
    if (!otp || otp !== dto.otp)
      throw new exc.BadRequest({ message: 'Invalid OTP' });
    await this.redisService.del(`ACTIVE${dto.id}`);
    const user = await this.userService.getUserById(dto.id);
    await this.userService.activeUser(user.id);
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

    await this.redisService.setWithExpiration(dto.email, otp, 600);

    await this.mailerService.sendMail(user.email, 'Reset password', otp);
    return true;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { email, otp, newPassword } = dto;

    const user = await this.userService.getUserByUniqueKey({
      email: dto.email,
    });
    if (!user) throw new exc.BadRequest({ message: 'không tồn tại email này' });

    const storedOtp = await this.redisService.get(email);
    if (!storedOtp || storedOtp !== otp) {
      throw new exc.BadRequest({ message: 'Invalid OTP.' });
    }

    user.setPassword(newPassword);
    await user.save();
    await this.redisService.del(email);
    return true;
  }

  async thirdPartyLogin(data: any) {
    if (data.provider == 'google') {
      let user = await this.userService.getUserByUniqueKey({
        email: data.email,
      });

      if (!user) {
        user = await this.userService.createUser({ ...data, verified: true });
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
