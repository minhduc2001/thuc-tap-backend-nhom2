import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MailerService } from '@/mailer/mailer.service';

@Controller('mailer')
@ApiTags('Mailer')
export class MailerController {
  constructor(private readonly mailService: MailerService) {}

  @Get()
  test() {
    return this.mailService.sendMail(
      'minhduc4600@gmail.com',
      'Test mail',
      'anh yeu em',
    );
  }
}
