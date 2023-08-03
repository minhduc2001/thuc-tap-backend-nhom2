import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserSeed } from '@shared/seeder/user.seed';
import { PermissionSeed } from '@shared/seeder/permission.seed';
import { AudioBookSeed } from './audio-book.seed';
import { GenreSeed } from './genre.seed';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    private readonly userSeed: UserSeed,
    private readonly permissionSeed: PermissionSeed,
    private readonly audioBookSeed: AudioBookSeed,
    private readonly genreSeed: GenreSeed,
  ) {}

  async onModuleInit() {
    console.info('loading seed ...');
    await this.permissionSeed.seed();
    await this.userSeed.seed();
    await this.audioBookSeed.seed();
    await this.genreSeed.seed();
    console.info('done!!!!');
  }
}
