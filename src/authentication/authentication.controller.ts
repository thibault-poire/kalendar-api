import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';

import { Request as ExpressRequest } from 'express';

import { AuthenticationService } from './authentication.service';

import { JwtRefreshAuthenticationGuard } from './guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from './guards/local.guard';
import { JwtAuthenticationGuard } from './guards/jwt.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authentication_service: AuthenticationService) {}

  @HttpCode(200)
  @Post('login')
  @UseGuards(LocalAuthenticationGuard)
  login(@Request() request: ExpressRequest & { user: { id: string } }) {
    return this.authentication_service.login(request.user.id);
  }

  @HttpCode(200)
  @Post('refresh')
  @UseGuards(JwtRefreshAuthenticationGuard)
  refresh_token(@Request() request: ExpressRequest & { user: { id: string } }) {
    return this.authentication_service.refresh_token(request.user.id);
  }

  @HttpCode(204)
  @Post('logout')
  @UseGuards(JwtAuthenticationGuard)
  logout(@Request() request: ExpressRequest & { user: { id: string } }) {
    return this.authentication_service.logout(request.user.id);
  }
}
