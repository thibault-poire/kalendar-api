import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor(private readonly mailer_service: MailerService) {}

  async send_account_activation_mail(mail: string, token: string) {
    await this.mailer_service.sendMail({
      from: process.env.MAIL_HOST_SENDER,
      to: mail,
      subject: 'Account activation',
      html: `<a href="${process.env.BASE_URL}/authentication/account-activation?activation-token=${token}">Activate your account</a>`,
    });
  }
}
