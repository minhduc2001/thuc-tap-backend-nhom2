import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginateConfig } from '@base/service/paginate';
import { BaseService } from '@base/service/base.service';
import { LoggerService } from '@base/logger';
import * as exc from '@base/api/exception.reslover';

import { Comment } from '@/comment/entities/comment.entity';
import { CreateCommentDto, ListCommentDto } from '@/comment/comment.dto';
import { UserService } from '@/user/user.service';
import { AudioBookService } from '@/audio-book/audio-book.service';

@Injectable()
export class CommentService extends BaseService<Comment> {
  constructor(
    @InjectRepository(Comment)
    protected readonly repository: Repository<Comment>,
    private readonly audioBookService: AudioBookService,
    private readonly userService: UserService,
    private readonly loggerService: LoggerService,
  ) {
    super(repository);
  }

  logger = this.loggerService.getLogger(CommentService.name);

  async listComment(query: ListCommentDto) {
    const config: PaginateConfig<Comment> = {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      where: [{ audioBook: { id: query.audioBookId } }],
      relations: ['author', 'reply'],
    };

    return this.listWithPage(query, config);
  }

  async createComment(dto: CreateCommentDto) {
    const audioBook = await this.audioBookService.getAudioBookWithoutImage(
      dto.audioBook,
    );

    // get reply user
    let user = null;
    if (dto.reply) {
      user = await this.userService.getUserById(dto.reply);
    }

    console.log(dto.user);

    return this.repository.save({
      content: dto.content,
      audioBook: audioBook,
      author: dto.user,
      reply: user,
      parentCommentId: dto.parentCommentId ?? null,
    });
  }

  async deleteComment(id: number) {
    return this.repository.delete(id);
  }
}
