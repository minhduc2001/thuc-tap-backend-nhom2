import { Module } from '@nestjs/common';
import { ConfigModule } from './base/config';
import { LoggerModule } from './base/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './base/db';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { AudioBookModule } from './audio-book/audio-book.module';
import { AuthorModule } from './author/author.module';
import { PackageModule } from './package/package.module';
import { PaymentModule } from './payment/payment.module';
import { GenreModule } from './genre/genre.module';
import { HistoryModule } from './history/history.module';
import { LibraryModule } from './library/library.module';
import { HomeModule } from './home/home.module';
import { SystemConfigurationModule } from './system-configuration/system-configuration.module';
import { CommentModule } from './comment/comment.module';
import { HelperModule } from './base/helper/helper.module';

const baseModules = [ConfigModule, LoggerModule, HelperModule];
const appModules = [
  AuthModule,
  UserModule,
  AudioBookModule,
  AuthorModule,
  GenreModule,
  CommentModule,
  LibraryModule,
  HistoryModule,
  SystemConfigurationModule,
];
@Module({
  imports: [
    ...baseModules,
    ...appModules,
    TypeOrmModule.forRoot(dbConfig),
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
