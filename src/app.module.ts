import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { MailerModule } from './mailer/mailer.module';
import { SeedersModule } from './shared/seeder/seeder.module';
import { UploadFileModule } from './base/multer/multer.module';
import { RoleModule } from './role/role.module';
import { SupportModule } from './support/support.module';
import { RedisModule } from './base/redis/redis.module';
import { StaticMiddleware } from '@base/middlewares/static.middleware';
import { AppController } from '@/app.controller';

const baseModules = [
  ConfigModule,
  LoggerModule,
  HelperModule,
  UploadFileModule,
  SeedersModule,
  RedisModule,
];
const appModules = [
  AuthModule,
  UserModule,
  RoleModule,
  AudioBookModule,
  AuthorModule,
  GenreModule,
  CommentModule,
  LibraryModule,
  HistoryModule,
  SystemConfigurationModule,
  PaymentModule,
  PackageModule,
];
@Module({
  imports: [
    ...baseModules,
    ...appModules,
    TypeOrmModule.forRoot(dbConfig),
    CommentModule,
    MailerModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StaticMiddleware).forRoutes('/audio');
  }
}
