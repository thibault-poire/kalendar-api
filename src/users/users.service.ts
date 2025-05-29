import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { hash } from 'bcrypt';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/schemas/user.schema';

import { CreateUserDto } from './dto/create-user..dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly user_model: Model<User>,
  ) {}

  async create(user: CreateUserDto) {
    const hashed_password = await hash(user.password, 12);

    try {
      await this.user_model.create<UserDocument>({
        email: user.email,
        password: hashed_password,
        username: user.username,
      });
    } catch {
      throw new BadRequestException(['email already exists']);
    }
  }

  async find_one_by_id(user_id: string) {
    const user = await this.user_model
      .findById<UserDocument>(user_id)
      .select('-password');

    if (!user) {
      throw new NotFoundException();
    }

    return user.toObject();
  }

  async find_one_by_email(email: string) {
    const user = await this.user_model
      .findOne<UserDocument>({ email })
      .select('-password');

    if (!user) {
      throw new NotFoundException();
    }

    return user.toObject();
  }

  async find_one_by_email_with_password(email: string) {
    const user = await this.user_model.findOne<UserDocument>({ email });

    if (!user) {
      throw new NotFoundException();
    }

    return user.toObject();
  }

  async update_one_by_id(user_id: string, updates: Partial<User>) {
    const user = await this.user_model.findByIdAndUpdate(user_id, updates);

    if (!user) {
      throw new NotFoundException();
    }
  }
}
