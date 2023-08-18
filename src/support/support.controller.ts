import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { ListSupportDto } from './support.dto';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { User } from '@/user/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';

@Controller('support')
@ApiTags('Support')
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('')
  getAll(@Query() query: ListSupportDto, @GetUser() user: User) {
    return this.supportService.getAll({ ...query, user: user });
  }

  @Get(':code')
  getSupport(@Param() param: { code: string }, @GetUser() user: User) {
    return this.supportService.getOne(param.code, user);
  }
}
