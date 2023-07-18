import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@GetUser() user: User) {
    return user;
  }
}
