import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';

import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { AuthenticationService } from './authentication.service';

import { JwtActivationAuthenticationGuard } from './guards/jwt-activation.guard';
import { JwtAuthenticationGuard } from './guards/jwt.guard';
import { JwtRefreshAuthenticationGuard } from './guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from './guards/local.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authentication_service: AuthenticationService) {}

  @HttpCode(200)
  @Get('account-activation')
  @UseGuards(JwtActivationAuthenticationGuard)
  accout_activation(
    @Request() request: ExpressRequest & { user: { mail: string } },
  ) {
    return this.authentication_service.account_activation(request.user.mail);
  }

  @HttpCode(200)
  @Post('login')
  @UseGuards(LocalAuthenticationGuard)
  login(
    @Request() request: ExpressRequest & { user: { id: string } },
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    return this.authentication_service.login(request.user.id, response);
  }

  @HttpCode(204)
  @Post('logout')
  @UseGuards(JwtAuthenticationGuard)
  logout(
    @Request() request: ExpressRequest & { user: { id: string } },
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    return this.authentication_service.logout(request.user.id, response);
  }

  @HttpCode(200)
  @Post('refresh')
  @UseGuards(JwtRefreshAuthenticationGuard)
  refresh_token(
    @Request() request: ExpressRequest & { user: { id: string } },
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    return this.authentication_service.refresh_token(request.user.id, response);
  }
}
