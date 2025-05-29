import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';

import { Request as ExpressRequest } from 'express';

import { AuthenticationService } from './authentication.service';

import { JwtRefreshAuthenticationGuard } from './guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from './guards/local.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authentication_service: AuthenticationService) {}

  @HttpCode(200)
  @Post('login')
  @UseGuards(LocalAuthenticationGuard)
  login(@Request() request: ExpressRequest) {
    return this.authentication_service.login(request.user as string);
  }

  @HttpCode(200)
  @Post('refresh')
  @UseGuards(JwtRefreshAuthenticationGuard)
  refresh_token(@Request() request: ExpressRequest) {
    return this.authentication_service.refresh_token(request.user as string);
  }
}
