import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

// BASE
import { LoggerService } from '@base/logger';
import * as exc from '@base/api/exception.reslover';
import { FileService } from '@base/helper/file.service';

import {
  checkFileImage,
  checkFilesImage,
} from '@shared/validator/type-file.validator';
import { ParamIdDto } from '@shared/dtos/common.dto';

// APPS
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { AudioBookService } from '@/audio-book/audio-book.service';
import {
  CreateAudioBookDto,
  ListAudioBookDto,
  UpdateAudioBookDto,
} from '@/audio-book/audio-book.dto';
import { Roles } from '@/role/roles.decorator';
import { ERole } from '@/role/enum/roles.enum';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { User } from '@/user/user.entity';
import { RolesGuard } from '@/role/roles.guard';
import * as path from 'path';
import { Public } from '@/auth/decorator/public.decorator';

@Controller('audio-book')
@ApiTags('Audio Book')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AudioBookController {
  constructor(
    private readonly service: AudioBookService,
    private readonly fileService: FileService,
    private readonly loggerService: LoggerService,
  ) {}

  private logger = this.loggerService.getLogger(AudioBookController.name);

  @ApiOperation({ summary: 'lấy danh sách audio book' })
  @Get()
  async listAudioBook(@Query() query: ListAudioBookDto, @GetUser() user: User) {
    return this.service.listAudioBook({ ...query, user: user });
  }

  @Public()
  @Get('/play')
  async play(@Query('songName') songName: string) {
    if (!songName) throw new exc.NotFound({});
    console.log(process.cwd());

    const filePath = path.join(process.cwd(), 'audio', songName);
  }

  @ApiOperation({ summary: 'Lấy chi tiết audio book' })
  @Get(':id')
  async getAudioBook(@Param() param: ParamIdDto, @GetUser() user: User) {
    return this.service.getAudioBook({ ...param, user: user });
  }

  @ApiOperation({ summary: 'Tạo audio book' })
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @UseGuards(RolesGuard)
  @Roles(ERole.Admin)
  async createAudioBook(
    @Body() dto: CreateAudioBookDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File; audio?: Express.Multer.File },
  ) {
    try {
      return this.service.createAudioBook({
        ...dto,
        audio: files?.audio[0]?.filename,
        image: files?.image[0]?.filename,
      });
    } catch (e) {
      this.logger.warn(e.message);
      this.fileService.removeFile(files.audio[0].filename, 'audio');
      this.fileService.removeFile(files.image[0].filename, 'uploads');
      throw new exc.BadRequest({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'yêu thích' })
  @Post('like')
  async like(@Body() dto: ParamIdDto, @GetUser() user: User) {
    return this.service.like(dto.id, user);
  }

  @ApiOperation({ summary: 'sửa audio book' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(ERole.Admin)
  async updateAudioBook(
    @Body() dto: UpdateAudioBookDto,
    @Param() param: ParamIdDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File; audio?: Express.Multer.File },
  ) {
    try {
      return this.service.updateAudioBook({
        ...dto,
        ...param,
        audio: files?.audio?.[0]?.filename,
        image: files?.image?.[0]?.filename,
      });
    } catch (e) {
      this.logger.warn(e.message);

      this.fileService.removeFile(files.audio[0].filename, 'audio');
      this.fileService.removeFile(files.image[0].filename, 'uploads');

      throw new exc.BadRequest({ message: e.message });
    }
  }
}
