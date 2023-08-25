import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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

// BASE
import { LoggerService } from '@base/logger';

// APPS
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { AuthorService } from '@/author/author.service';
import {
  ListAuthorDto,
  SaveAuthorDto,
  UpdateAuthorDto,
} from '@/author/author.dto';
import { ParamIdDto } from '@shared/dtos/common.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('author')
@ApiTags('Author')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AuthorController {
  constructor(
    private readonly service: AuthorService,
    private readonly loggerService: LoggerService,
  ) {}

  logger = this.loggerService.getLogger(AuthorController.name);

  @ApiOperation({ summary: 'Lấy danh sách tác giả' })
  @Get()
  async listAuthor(@Query() query: ListAuthorDto) {
    return this.service.listAuthor(query);
  }

  @ApiOperation({ summary: 'Lấy danh sách tác giả' })
  @Get('search')
  async search(@Query() query: ListAuthorDto) {
    return this.service.listAuthorAudioBook(query);
  }

  @ApiOperation({ summary: 'Lấy ra 1 tác giả' })
  @Get(':id')
  async getAuthor(@Param() param: ParamIdDto) {
    return this.service.getAuthor(param.id);
  }

  @ApiOperation({ summary: '' })
  @Post('')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  saveAuthor(
    @Body() dto: SaveAuthorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.saveAuthor({ ...dto, image: file.filename });
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  updateAuthor(
    @Param() param: ParamIdDto,
    @Body() dto: UpdateAuthorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.updateAuthor({
      ...param,
      ...dto,
      image: file.filename,
    });
  }
}
