import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { AudioBookModule } from '@/audio-book/audio-book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Library } from './entities/library.entity';
import { AudioBookLibrary } from './entities/audio-book-library.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Library, AudioBookLibrary]),
    AudioBookModule,
  ],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
