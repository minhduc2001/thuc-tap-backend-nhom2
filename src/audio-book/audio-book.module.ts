import { Module } from '@nestjs/common';
import { AudioBookService } from './audio-book.service';
import { AudioBookController } from './audio-book.controller';

@Module({
  controllers: [AudioBookController],
  providers: [AudioBookService],
})
export class AudioBookModule {}
