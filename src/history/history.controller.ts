import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// BASE
import { LoggerService } from '@base/logger';

// SHARED
import { ParamIdDto } from '@shared/dtos/common.dto';

// APPS
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { HistoryService } from '@/history/history.service';
import { ListHistoryDto, WriteHistoryDto } from '@/history/history.dto';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { User } from '@/user/user.entity';

@Controller('history')
@ApiTags('History')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(
    private readonly service: HistoryService,
    private readonly loggerService: LoggerService,
  ) {}

  logger = this.loggerService.getLogger(HistoryController.name);

  @ApiOperation({ summary: 'lấy danh sách lịch sử' })
  @Get()
  async listHistory(@Query() query: ListHistoryDto, @GetUser() user: User) {
    return this.service.listHistory({ ...query, userId: user.id });
  }

  @ApiOperation({ summary: 'Tạo lịch sử audio book' })
  @Post()
  async writeHistory(@Body() dto: WriteHistoryDto, @GetUser() user: User) {
    return this.service.writeHistory({ ...dto, user: user });
  }
}
