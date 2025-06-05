import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtActivationStrategy extends PassportStrategy(
  Strategy,
  'jwt-activation',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('activation-token'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACTIVATION_SECRET,
    });
  }

  validate(payload: { sub: string; username: string }) {
    console.log(payload);
    return { mail: payload.sub };
  }
}
