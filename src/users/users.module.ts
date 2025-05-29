import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';

import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  controllers: [UsersController],

  exports: [UsersService],

  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],

  providers: [UsersService],
})
export class UsersModule {}
