import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';

import { JwtModule } from '@nestjs/jwt';
import { MailsModule } from 'src/mails/mails.module';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';

import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  controllers: [UsersController],

  exports: [UsersService],

  imports: [
    JwtModule,
    MailsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],

  providers: [UsersService],
})
export class UsersModule {}
