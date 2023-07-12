import { Module } from '@nestjs/common';
import { ConfigModule } from './base/config';
import { LoggerModule } from './base/logger/logger.module';

const baseModules = [ConfigModule, LoggerModule];
const appModules = [];
@Module({
  imports: [...baseModules, ...appModules],
  controllers: [],
  providers: [],
})
export class AppModule {}
