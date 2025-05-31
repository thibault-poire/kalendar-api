import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthenticationService } from '../authentication.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly auth_service: AuthenticationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: { sub: string }) {
    const refresh_token = request
      .get('authorization')
      .replace('Bearer', '')
      .trim();

    return this.auth_service.validate_refresh_token(payload.sub, refresh_token);
  }
}
