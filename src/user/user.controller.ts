import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { PERMISSIONS } from '@shared/constants/permission.constant';

// APPS
import { User } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { Roles } from '@/role/roles.decorator';
import { ERole } from '@/role/enum/roles.enum';
import { Public } from '@/auth/decorator/public.decorator';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { ListUserDto, UploadAvatarDto } from '@/user/dtos/user.dto';
import { Permissions } from '@/role/permission.decorator';
import { GetUser } from '@/auth/decorator/get-user.decorator';

@Controller('users')
@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'get me' })
  @Get('get-me')
  async getMe(@GetUser() user: User) {
    return user;
  }

  // @Public()
  @Get()
  // @Roles(ERole.Admin)
  // @Permissions(PERMISSIONS.DELETE_USER)
  getAllUser(@Query() query: ListUserDto) {
    return this.userService.getAllUser(query);
  }

  @Post()
  @Public()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() dto: UploadAvatarDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar({ ...dto, file: file.filename });
  }
}
