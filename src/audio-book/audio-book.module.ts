import { Module } from '@nestjs/common';
import { AudioBookService } from './audio-book.service';
import { AudioBookController } from './audio-book.controller';
import { GenreModule } from '@/genre/genre.module';
import { AuthorModule } from '@/author/author.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioBook } from './entities/audio-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AudioBook]), AuthorModule, GenreModule],
  controllers: [AudioBookController],
  providers: [AudioBookService],
  exports: [AudioBookService],
})
export class AudioBookModule {}
