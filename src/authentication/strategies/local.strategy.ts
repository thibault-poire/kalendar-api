import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';

import { AuthenticationService } from '../authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth_service: AuthenticationService) {
    super({
      usernameField: 'mail',
      passwordField: 'password',
    });
  }

  async validate(mail: string, password: string) {
    return await this.auth_service.validate_user(mail, password);
  }
}
