import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthenticationController } from './authentication.controller';

import { UsersModule } from 'src/users/users.module';

import { AuthenticationService } from './authentication.service';

import { JwtActivationStrategy } from './strategies/jwt-activation.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthenticationController],

  imports: [UsersModule, PassportModule, JwtModule],

  providers: [
    AuthenticationService,
    JwtActivationStrategy,
    JwtRefreshStrategy,
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AuthenticationModule {}
