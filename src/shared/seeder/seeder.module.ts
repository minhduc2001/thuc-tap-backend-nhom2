import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/user.entity';
import { SeederService } from './seeder.service';
import { UserSeed } from './user.seed';
import { PermissionSeed } from './permission.seed';
import { AudioBookSeed } from './audio-book.seed';
import { AudioBookModule } from '@/audio-book/audio-book.module';
import { Permission } from '@/role/entities/permission.entity';
import { AudioBook } from '@/audio-book/entities/audio-book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Permission, AudioBook]),
    AudioBookModule,
  ],
  providers: [SeederService, UserSeed, PermissionSeed, AudioBookSeed],
})
export class SeedersModule {}
