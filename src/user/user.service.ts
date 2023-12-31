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
import { LibraryService } from '@/library/services/library.service';
import { UrlService } from '@/base/helper/url.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@/mailer/mailer.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    private readonly loggerService: LoggerService,
    private readonly libraryService: LibraryService,
    private readonly urlService: UrlService,
    private readonly mailerService: MailerService,
  ) {
    super(repository);
  }

  logger = this.loggerService.getLogger(UserService.name);

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async rejectPackegeUser() {
    const currentTime = new Date();
    const users = await this.repository
      .createQueryBuilder('user')
      .where(`user.packageExpire BETWEEN :gt1 AND :gt2`, {
        gt1: currentTime.getTime() - currentTime.getHours() * 3600 * 1000,
        gt2:
          currentTime.getTime() + (24 - currentTime.getHours()) * 3600 * 1000,
      })
      .getMany();

    for (const user of users) {
      await this.mailerService.sendMail(
        user.email,
        'Thông báo hết hạn gói cước',
        `Gói cước của bạn hết hạn vào lúc ${new Date(user.packageExpire)}`,
      );
    }

    // await this.subscriptionService.createSubscription({
    //   userId: user.id,
    //   delay: Number(user.packageExpire) - date,
    // });

    console.log(users);
  }

  preResponse(users: User[]) {
    users.map((user) => {
      if (user.avatar) {
        user.avatar = this.urlService.uploadUrl(user.avatar);
      }
    });
  }

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
    const user = await this.repository.findOne({ where: { id: id } });
    this.preResponse([user]);
    return user;
  }

  async getUser(id: number) {
    const user = await this.getUserById(id);
    if (!user) throw new exc.BadRequest({ message: 'user không tồn tại!' });
    return user;
  }

  async activeUser(id: number) {
    await this.repository.update(id, { verified: true });
    return true;
  }

  async createUser(data: ICreateUser) {
    try {
      const user: User = this.repository.create(data);
      if (user.password) user.setPassword(data.password);
      const lib = await this.libraryService.createLibrary({
        name: 'Yêu thích',
        user: user,
      });
      user.library = [lib];
      await user.save();

      return user;
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
