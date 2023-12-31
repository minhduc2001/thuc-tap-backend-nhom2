import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// BASE
import { LoggerService } from '@base/logger';
import * as exc from '@base/api/exception.reslover';

// APPS
import { LibraryService } from '@/library/services/library.service';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import {
  CreateAudioBookLibraryDto,
  CreateLibraryDto,
  ListAudioBookLibraryDto,
  ListLibraryDto,
  UpdateLibrary,
} from '@/library/library.dto';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { User } from '@/user/user.entity';
import { AudioBookLibraryService } from '@/library/services/audio-book-library.service';

// SHARED
import { ParamIdDto } from '@shared/dtos/common.dto';

@Controller('library')
@ApiTags('Library')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(
    private readonly service: LibraryService,
    private readonly audioBookLibraryService: AudioBookLibraryService,
    private readonly loggerService: LoggerService,
  ) {}

  logger = this.loggerService.getLogger(LibraryController.name);

  @ApiOperation({ summary: 'Lấy danh sách thư viện' })
  @Get()
  async listLibrary(@Query() query: ListLibraryDto, @GetUser() user: User) {
    return this.service.listLibrary({ ...query, userId: user.id });
  }

  @ApiOperation({ summary: 'Lấy danh sách các audio book trong thư viện' })
  @Get(':id/list')
  async listAudioBookLibrary(
    @Query() query: ListAudioBookLibraryDto,
    @Param() param: ParamIdDto,
  ) {
    return this.audioBookLibraryService.listAudioBookLibrary({
      ...query,
      libraryId: param.id,
    });
  }

  @ApiOperation({ summary: 'Tạo thư viện' })
  @Post('create-library')
  async createLibrary(@Body() dto: CreateLibraryDto, @GetUser() user: User) {
    return this.service.createLibrary({ ...dto, user: user });
  }

  @ApiOperation({ summary: 'Lưu audio book vào thư viện' })
  @Post('create-audio-book-library')
  async createAudioBookLibrary(@Body() dto: CreateAudioBookLibraryDto) {
    return this.audioBookLibraryService.createAudioBookLibrary(dto);
  }

  @ApiOperation({ summary: 'Sửa thư viện' })
  @Put(':id')
  async updateLibrary(@Param() param: ParamIdDto, @Body() dto: UpdateLibrary) {
    return this.service.updateLibrary({ ...param, ...dto });
  }

  @ApiOperation({ summary: 'Xóa thư viện' })
  @Delete(':id')
  async deleteLibrary(@Param() param: ParamIdDto) {
    return this.service.deleteLibrary(param.id);
  }

  @ApiOperation({ summary: 'Xóa nội dung trong thư viện' })
  @Delete(':id/audio-book')
  async deleteAudioBookLibrary(@Param() param: ParamIdDto) {
    return this.audioBookLibraryService.deleteAudioBookLibrary(param.id);
  }
}
