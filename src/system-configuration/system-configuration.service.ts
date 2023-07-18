import { Injectable } from '@nestjs/common';
import { UpdateSystemConfigurationDto } from './dto/update-system-configuration.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemConfiguration } from './entities/system-configuration.entity';
import { BaseService } from '@/base/service/base.service';

@Injectable()
export class SystemConfigurationService extends BaseService<SystemConfiguration> {
  constructor(
    @InjectRepository(SystemConfiguration)
    protected readonly repository: Repository<SystemConfiguration>,
  ) {
    super(repository);
  }

  updateSystem(
    id: number,
    updateSystemConfigurationDto: UpdateSystemConfigurationDto,
  ) {
    return `This action updates a #${id} systemConfiguration`;
  }
}
