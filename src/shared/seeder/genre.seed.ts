import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AudioBook } from '@/audio-book/entities/audio-book.entity';
import { AudioBookService } from '@/audio-book/audio-book.service';
import { Genre } from '@/genre/entities/genre.entity';

const data = [
  {
    name: 'Rap',
    id: '1',
  },
  {
    name: 'Reggae',
    id: '2',
  },
  {
    name: 'Hip Hop',
    id: '3',
  },
  {
    name: 'Soul',
    id: '4',
  },
  {
    name: 'Funk',
    id: '5',
  },
  {
    name: 'Rock',
    id: '6',
  },
  {
    name: 'Jazz',
    id: '7',
  },
  {
    name: 'Classical',
    id: '8',
  },
  {
    name: 'Pop',
    id: '9',
  },
  {
    name: 'Non Music',
    id: '10',
  },
];

@Injectable()
export class GenreSeed {
  constructor(
    @InjectRepository(Genre)
    protected readonly repository: Repository<Genre>,
  ) {}

  async seed() {
    const count = await this.repository.count();
    if (!count) {
      for (const genre of data) {
        const { id, ...rest } = genre;
        await this.repository.save(rest);
      }
    }
  }
}
