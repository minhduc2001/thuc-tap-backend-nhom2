import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { AudioBookModule } from '@/audio-book/audio-book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History]), AudioBookModule],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
