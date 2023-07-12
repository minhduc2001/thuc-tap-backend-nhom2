import { Module } from '@nestjs/common';
import { ConfigModule } from './base/config';
import { LoggerModule } from './base/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './base/db';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

const baseModules = [ConfigModule, LoggerModule];
const appModules = [];
@Module({
  imports: [
    ...baseModules,
    ...appModules,
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
