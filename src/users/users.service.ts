import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { hash } from 'bcrypt';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/schemas/user.schema';

import { CreateUserDto } from './dto/create-user.dto';

import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwt_service: JwtService,
    private readonly mails_services: MailsService,
    @InjectModel(User.name) private readonly user_model: Model<User>,
  ) {}

  async create(user: CreateUserDto) {
    const hashed_password = await hash(user.password, 12);

    const activation_token = this.jwt_service.sign(
      {
        sub: user.mail,
      },
      {
        secret: process.env.JWT_ACTIVATION_SECRET,
        expiresIn: process.env.JWT_ACTIVATION_EXPIRATION_TIME,
      },
    );

    try {
      await this.user_model.create<UserDocument>({
        mail: user.mail,
        password: hashed_password,
        username: user.username,
        activation_token,
      });
    } catch {
      throw new BadRequestException(['mail already exists']);
    }

    await this.mails_services.send_account_activation_mail(
      user.mail,
      activation_token,
    );
  }

  async find_one_by_id(user_id: string) {
    const user = await this.user_model
      .findById<UserDocument>(user_id)
      .select('-activation_token -is_verified -password -refresh_token');

    if (!user) {
      throw new NotFoundException(['user not found']);
    }

    return user.toObject();
  }

  async find_one_by_mail(mail: string) {
    const user = await this.user_model
      .findOne<UserDocument>({ mail })
      .select('-activation_token -is_verified -password -refresh_token');

    if (!user) {
      throw new NotFoundException(['user not found']);
    }

    return user.toObject();
  }

  async find_one_by_mail_with_password(mail: string) {
    const user = await this.user_model
      .findOne<UserDocument>({ mail })
      .select('-refresh_token');

    if (!user) {
      throw new NotFoundException(['user not found']);
    }

    return user.toObject();
  }

  async find_one_by_id_with_refresh_token(user_id: string) {
    const user = await this.user_model
      .findById<UserDocument>(user_id)
      .select('-password');

    if (!user) {
      throw new NotFoundException(['user not found']);
    }

    return user.toObject();
  }

  async update_one_by_mail(mail: string, updates: Partial<User>) {
    const user = await this.user_model.findOneAndUpdate({ mail }, updates);

    if (!user) {
      throw new NotFoundException(['user not found']);
    }
  }

  async update_one_by_id(user_id: string, updates: Partial<User>) {
    const user = await this.user_model.findByIdAndUpdate(user_id, updates);

    if (!user) {
      throw new NotFoundException(['user not found']);
    }
  }
}
