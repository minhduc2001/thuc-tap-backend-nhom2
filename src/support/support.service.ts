import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base.service';
import { Support } from './entities/support.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlService } from '@/base/helper/url.service';
import { PaginateConfig } from '@/base/service/paginate';
import { ListSupportDto } from './support.dto';
import { User } from '@/user/user.entity';
import * as exc from '@base/api/exception.reslover';

@Injectable()
export class SupportService extends BaseService<Support> {
  constructor(
    @InjectRepository(Support)
    protected readonly repository: Repository<Support>,
    private readonly urlServide: UrlService,
  ) {
    super(repository);
  }

  preResponse(supports: Support[]) {
    supports.map((support) => {
      if (support.images)
        support.images = this.urlServide.uploadUrls(support.images);
    });
  }

  async getAll(query: ListSupportDto) {
    const config: PaginateConfig<Support> = {
      sortableColumns: ['id'],
      defaultSortBy: [['updatedAt', 'DESC']],
      relations: ['subject'],
      where: [{ user: { id: query.user.id } }],
    };

    if (query.user.role === 'admin') {
      delete config.where;
    }

    return this.listWithPage(query, config);
  }

  async getOne(code: string, user: User) {
    let support: Support;
    if (user.role === 'admin') {
      support = await this.findOne({
        where: { code: code },
        relations: ['user', 'subject'],
      });
      this.preResponse([support]);
      return support;
    }
    support = await this.findOne({
      where: { code: code, user: { id: user.id } },
      relations: ['subject'],
    });
    if (!support)
      throw new exc.BadRequest({ message: 'Không có yêu cầu hỗ trợ này!' });
    this.preResponse([support]);
    return support;
  }
}
