import { Module } from '@nestjs/common';
import { SystemConfigurationService } from './system-configuration.service';
import { SystemConfigurationController } from './system-configuration.controller';

@Module({
  controllers: [SystemConfigurationController],
  providers: [SystemConfigurationService]
})
export class SystemConfigurationModule {}
