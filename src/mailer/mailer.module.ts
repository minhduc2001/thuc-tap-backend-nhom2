import { Global, Module } from '@nestjs/common';
import { MailerController } from '@/mailer/mailer.controller';
import { MailerService } from '@/mailer/mailer.service';

@Global()
@Module({
  imports: [],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
