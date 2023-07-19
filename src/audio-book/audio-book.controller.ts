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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

// BASE
import { LoggerService } from '@base/logger';
import * as exc from '@base/api/exception.reslover';
import { FileService } from '@base/helper/file.service';

import { checkFile, checkFiles } from '@shared/validator/type-file.validator';
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
  async listAudioBook(@Query() query: ListAudioBookDto) {
    return this.service.listAudioBook(query);
  }

  @ApiOperation({ summary: 'Lấy chi tiết audio book' })
  @Get(':id')
  async getAudioBook(@Param() param: ParamIdDto) {
    return;
  }

  @ApiOperation({ summary: 'Tạo audio book' })
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  // @Roles(ERole.Admin)
  async createAudioBook(
    @Body() dto: CreateAudioBookDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const fileName = checkFile(file);
      return this.service.createAudioBook({
        ...dto,
        file: fileName,
      });
    } catch (e) {
      this.logger.warn(e.message);
      this.fileService.removeFile(file.filename);
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
  @UseInterceptors(FileInterceptor('file'))
  @Roles(ERole.Admin)
  @Put(':id')
  async updateAudioBook(
    @Body() dto: UpdateAudioBookDto,
    @Param() param: ParamIdDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const fileName = checkFile(file);
      return this.service.updateAudioBook({
        ...dto,
        ...param,
        file: fileName,
      });
    } catch (e) {
      this.logger.warn(e.message);

      this.fileService.removeFile(file.filename);

      throw new exc.BadRequest({ message: e.message });
    }
  }
}
