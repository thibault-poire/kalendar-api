import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailsService } from './mails.service';

@Module({
  exports: [MailsService],

  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config_service: ConfigService) => ({
        transport: {
          auth: {
            user: config_service.get('MAIL_USER_USERNAME'),
            pass: config_service.get('MAIL_USER_PASSWORD'),
          },
          host: config_service.get('MAIL_HOST'),
          port: config_service.get('MAIL_HOST_PORT'),
          secure: config_service.get('MAIL_HOST_IS_SECURE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],

  providers: [MailsService],
})
export class MailsModule {}
