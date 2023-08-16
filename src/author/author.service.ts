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
import { ListAuthorDto } from '@/author/author.dto';
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
    });
  }

  async listAuthor(query: ListAuthorDto) {
    const config: PaginateConfig<Author> = {
      sortableColumns: ['id'],
      searchableColumns: ['name'],
    };

    return this.listWithPage(query, config);
  }

  async getAuthor(id: number) {
    const author = await this.repository.findOne({ where: { id: id } });
    if (!author) throw new exc.BadRequest({ message: 'author không tồn tại' });
    return author;
  }
}
