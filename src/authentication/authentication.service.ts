import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare, hash } from 'bcrypt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwt_service: JwtService,
    private readonly users_service: UsersService,
  ) {}

  async account_activation(token: string) {
    try {
      const payload = await this.jwt_service.verifyAsync<{
        sub: string;
        iat: number;
        exp: number;
      }>(token, {
        secret: process.env.JWT_ACTIVATION_SECRET,
      });

      await this.users_service.update_one_by_mail(payload.sub, {
        activation_token: null,
        is_verified: true,
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async create_tokens_and_update_user_refresh_token(user_id: string) {
    const payload = { sub: user_id };

    const access_token = this.jwt_service.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });

    const refresh_token = this.jwt_service.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
    });

    const hashed_refresh_token = await hash(refresh_token, 10);

    await this.users_service.update_one_by_id(user_id, {
      refresh_token: hashed_refresh_token,
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async login(user_id: string) {
    return this.create_tokens_and_update_user_refresh_token(user_id);
  }

  async logout(user_id: string) {
    return await this.users_service.update_one_by_id(user_id, {
      refresh_token: null,
    });
  }

  async refresh_token(user_id: string) {
    return await this.create_tokens_and_update_user_refresh_token(user_id);
  }

  async validate_refresh_token(user_id: string, refresh_token: string) {
    const user =
      await this.users_service.find_one_by_id_with_refresh_token(user_id);

    if (!user.refresh_token) {
      throw new UnauthorizedException();
    }

    const is_valid_refresh_token = await compare(
      refresh_token,
      user.refresh_token,
    );

    if (!is_valid_refresh_token) {
      throw new UnauthorizedException();
    }

    return { id: user._id };
  }

  async validate_user(mail: string, password: string) {
    const user = await this.users_service.find_one_by_mail_with_password(mail);

    if (!user) {
      throw new UnauthorizedException(['invalid credentials']);
    }

    const is_valid_password = await compare(password, user.password);

    if (!is_valid_password) {
      throw new UnauthorizedException(['invalid credentials']);
    }

    if (!user.is_verified) {
      throw new UnauthorizedException(['account not verified']);
    }

    return { id: user._id };
  }
}
