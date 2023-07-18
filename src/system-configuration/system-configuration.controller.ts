import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SystemConfigurationService } from './system-configuration.service';
import { CreateSystemConfigurationDto } from './dto/create-system-configuration.dto';
import { UpdateSystemConfigurationDto } from './dto/update-system-configuration.dto';

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
