import { Module } from '@nestjs/common';
import { LibraryService } from './services/library.service';
import { LibraryController } from './library.controller';
import { AudioBookModule } from '@/audio-book/audio-book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Library } from './entities/library.entity';
import { AudioBookLibrary } from './entities/audio-book-library.entity';
import { AudioBookLibraryService } from './services/audio-book-library.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Library, AudioBookLibrary]),
    AudioBookModule,
  ],
  controllers: [LibraryController],
  providers: [LibraryService, AudioBookLibraryService],
  exports: [LibraryService, AudioBookLibraryService],
})
export class LibraryModule {}
