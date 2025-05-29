import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthenticationModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb://${process.env.DATABASE_HOST}`, {
      authSource: 'admin',
      dbName: process.env.DATABASE_NAME,
      pass: process.env.DATABASE_USER_PASSWORD,
      user: process.env.DATABASE_USER_USERNAME,
    }),
    UsersModule,
  ],
})
export class AppModule {}
