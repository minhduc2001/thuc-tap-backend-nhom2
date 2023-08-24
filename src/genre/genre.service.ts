import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// BASE
import { BaseService } from '@base/service/base.service';
import { LoggerService } from '@base/logger';
import * as exc from '@base/api/exception.reslover';
import { PaginateConfig } from '@base/service/paginate';

// APPS
import { Genre } from '@/genre/entities/genre.entity';
import { ListGenreDto } from '@/genre/genre.dto';
import { UrlService } from '@base/helper/url.service';

@Injectable()
export class GenreService extends BaseService<Genre> {
  constructor(
    @InjectRepository(Genre)
    protected readonly repository: Repository<Genre>,
    private readonly loggerService: LoggerService,
    private readonly urlService: UrlService,
  ) {
    super(repository);
  }

  private logger = this.loggerService.getLogger(GenreService.name);

  preResponse(genres: Genre[]) {
    genres.map((genre: Genre) => {
      if (genre.audioBook.length > 0) {
        genre.audioBook.map((audio) => {
          if (audio.image) audio.image = this.urlService.uploadUrl(audio.image);
        });
      }
    });
  }

  async listGenre(query: ListGenreDto) {
    const config: PaginateConfig<Genre> = {
      sortableColumns: ['id'],
    };

    return this.listWithPage(query, config);
  }

  async listGenreWithAudioBook(query: ListGenreDto) {
    const config: PaginateConfig<Genre> = {
      sortableColumns: ['id'],
      relations: ['audioBook'],
      searchableColumns: ['name'],
    };

    const data = await this.listWithPage(query, config);
    this.preResponse(data.results);
    return data;
  }

  async getGenre(id: number) {
    const genre = await this.repository.findOne({ where: { id: id } });
    if (!genre) throw new exc.BadRequest({ message: 'genre không tồn tại' });
    return genre;
  }
}
