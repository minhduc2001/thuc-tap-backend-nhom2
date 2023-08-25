import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// BASE
import { BaseService } from '@base/service/base.service';
import { LoggerService } from '@base/logger';
import * as exc from '@base/api/exception.reslover';
import { PaginateConfig } from '@base/service/paginate';

// APPS
import { Author } from '@/author/entities/author.entity';
import {
  ListAuthorDto,
  SaveAuthorDto,
  UpdateAuthorDto,
} from '@/author/author.dto';
import { UrlService } from '@/base/helper/url.service';

@Injectable()
export class AuthorService extends BaseService<Author> {
  constructor(
    @InjectRepository(Author)
    protected readonly repository: Repository<Author>,
    private readonly loggerService: LoggerService,
    private readonly urlService: UrlService,
  ) {
    super(repository);
  }

  private logger = this.loggerService.getLogger(AuthorService.name);

  preResponse(authors: Author[]) {
    authors.map((author) => {
      if (author.image) author.image = this.urlService.uploadUrl(author.image);
      if (author?.audioBook?.length > 0) {
        author.audioBook.map((audioBook) => {
          if (audioBook.image)
            audioBook.image = this.urlService.uploadUrl(audioBook.image);
        });
      }
    });
  }

  async listAuthor(query: ListAuthorDto) {
    const config: PaginateConfig<Author> = {
      sortableColumns: ['id'],
      searchableColumns: ['name'],
    };

    const resp = await this.listWithPage(query, config);
    this.preResponse(resp.results);
    return resp;
  }

  async listAuthorAudioBook(query: ListAuthorDto) {
    const config: PaginateConfig<Author> = {
      sortableColumns: ['id'],
      searchableColumns: ['name'],
      relations: ['audioBook'],
    };

    const resp = await this.listWithPage(query, config);
    this.preResponse(resp.results);
    return resp;
  }

  async getAuthor(id: number) {
    const author = await this.repository.findOne({ where: { id: id } });
    if (!author) throw new exc.BadRequest({ message: 'author không tồn tại' });
    this.preResponse([author]);
    return author;
  }

  async saveAuthor(dto: SaveAuthorDto) {
    return this.repository.save({
      name: dto.name,
      description: dto.description ?? '',
      image: dto.image ?? '',
    });
  }

  async updateAuthor(dto: UpdateAuthorDto) {
    const author = await this.getAuthor(dto.id);
    await this.repository.update(author.id, { ...dto });
    return true;
  }
}
