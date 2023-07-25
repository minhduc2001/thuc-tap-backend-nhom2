import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { config } from '@/config';
import { LoggerService } from '@base/logger';
import * as exc from '@base/api/exception.reslover';
// import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
@Injectable()
export class MailerService {
  private oauth2Client: any;
  private transporter: any;

  constructor(private readonly loggerService: LoggerService) {
    this.initAsync();
  }

  private async initAsync() {
    this.oauth2Client = new OAuth2Client(
      config.EMAIL_CLIENT_ID,
      config.EMAIL_CLIENT_SECRET,
      config.EMAIL_REDIRECT_URI,
    );

    this.oauth2Client.setCredentials({
      refresh_token: config.EMAIL_REFRESH_TOKEN,
    });

    this.transporter = nodemailer.createTransport({
      // host: 'smtp.gmail.com',
      // port: 465,
      // secure: true,
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config.EMAIL,
        clientId: config.EMAIL_CLIENT_ID,
        clientSecret: config.EMAIL_CLIENT_SECRET,
        refreshToken: config.EMAIL_REFRESH_TOKEN,
        accessToken: await this.oauth2Client.getAccessToken(),
      },
    });
  }

  private logger = this.loggerService.getLogger(MailerService.name);

  async sendMail(to: string, subject: string, body: string) {
    try {
      const mailOptions = {
        from: config.EMAIL,
        to,
        subject,
        html: body,
      };
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (e) {
      this.logger.warn(e);
      throw new exc.BadRequest({ message: e.message });
    }
  }
}
