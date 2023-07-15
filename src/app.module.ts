import { Module } from '@nestjs/common';
import { ConfigModule } from './base/config';
import { LoggerModule } from './base/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './base/db';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { AudioBookModule } from './audio-book/audio-book.module';

const baseModules = [ConfigModule, LoggerModule];
const appModules = [AuthModule, UserModule, AudioBookModule];
@Module({
  imports: [...baseModules, ...appModules, TypeOrmModule.forRoot(dbConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
