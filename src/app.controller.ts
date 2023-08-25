import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import * as path from 'path';
import * as process from 'process';
import { Response } from 'express';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { ERole } from '@/role/enum/roles.enum';
import { User } from '@/user/user.entity';
import { AudioBookService } from '@/audio-book/audio-book.service';

@Controller()
export class AppController {
  constructor(private readonly audioService: AudioBookService) {}
  @Get('uploads/:name')
  uploads(@Param('name') name: string, @Res() res: Response) {
    res.sendFile(path.join(process.cwd(), '/uploads', `/${name}`));
  }

  @UseGuards(JwtAuthGuard)
  @Get('audio/:folder/:name')
  async audio(
    @Param('folder') folder: string,
    @Param('name') name: string,
    @Res() res: Response,
    @GetUser() user: User,
  ) {
    if (name.includes('.m3u8')) {
      const audioBook = await this.audioService.getAudioBookUrl(name, user);
      if (user.role == ERole.Admin || user.packageId || !audioBook.free)
        res.sendFile(path.join(process.cwd(), '/audio', `/${folder}/${name}`));
      else res.status(404).json(false);
    } else {
      res.sendFile(path.join(process.cwd(), '/audio', `/${folder}/${name}`));
    }
  }
}
