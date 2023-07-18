import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// BASE
import * as exc from '@/base/api/exception.reslover';
import { LoggerService } from '@base/logger';
import { BaseService } from '@/base/service/base.service';
import { PaginateConfig } from '@base/service/paginate/paginate';

// APPS
import { User } from '@/user/user.entity';
import {
  ICreateUser,
  IUserGetByUniqueKey,
} from '@/user/interfaces/user.interface';
import { ListUserDto, UploadAvatarDto } from '@/user/dtos/user.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    private readonly loggerService: LoggerService,
  ) {
    super(repository);
  }

  logger = this.loggerService.getLogger(UserService.name);

  getUserByUniqueKey(option: IUserGetByUniqueKey): Promise<User> {
    const findOption: Record<string, any>[] = Object.entries(option).map(
      ([key, value]) => ({ [key]: value }),
    );
    return this.repository
      .createQueryBuilder('user')
      .where(findOption)
      .getOne();
  }

  async findOneUser(userId: number): Promise<User | undefined> {
    const user = this.repository.findOne({ where: { id: userId } });
    if (!user)
      throw new exc.BadRequest({ message: 'người dùng không tồn tại' });
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.repository.findOne({ where: { id: id } });
  }

  async getUser(id: number) {
    const user = await this.getUserById(id);
    if (!user) throw new exc.BadRequest({ message: 'user không tồn tại!' });
    return user;
  }

  async createUser(data: ICreateUser) {
    try {
      const user: User = this.repository.create(data);
      user.setPassword(data.password);
      await user.save();

      return;
    } catch (e) {
      this.logger.warn(e);
      throw new exc.BadRequest({ message: e.message });
    }
  }

  async getAllUser(query: ListUserDto) {
    const config: PaginateConfig<User> = {
      searchableColumns: ['id'],
      sortableColumns: ['id'],
    };

    return this.listWithPage(query, config);
  }

  async uploadAvatar(dto: UploadAvatarDto) {
    console.log(dto);
  }

  public async validRefreshToken(userId: number, refreshToken: string) {
    const user = await this.repository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) return null;

    const compare = user.compareRefreshToken(refreshToken);

    if (!compare)
      throw new exc.Forbidden({ message: 'refresh token is not valid' });

    return user;
  }
}
