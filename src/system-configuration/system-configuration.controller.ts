import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SystemConfigurationService } from './system-configuration.service';
import { CreateSystemConfigurationDto } from './dto/create-system-configuration.dto';
import { UpdateSystemConfigurationDto } from './dto/update-system-configuration.dto';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('System Configuration')
@ApiBearerAuth()
@Controller('system-configuration')
export class SystemConfigurationController {
  constructor(
    private readonly systemConfigurationService: SystemConfigurationService,
  ) {}

  @Get()
  findAll() {
    return this.systemConfigurationService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSystemConfigurationDto: UpdateSystemConfigurationDto,
  ) {
    return this.systemConfigurationService.updateSystem(
      +id,
      updateSystemConfigurationDto,
    );
  }
}
