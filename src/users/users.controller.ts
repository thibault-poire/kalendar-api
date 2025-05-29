import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';

import { JwtAuthenticationGuard } from 'src/authentication/guards/jwt.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { FindUserByIdDto } from './dto/find-user-by-id.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly users_service: UsersService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get(':user_id')
  async find_user_by_id(@Param() parameter: FindUserByIdDto) {
    return await this.users_service.find_one_by_id(parameter.user_id);
  }

  @Post()
  async create_user(@Body() user: CreateUserDto) {
    return await this.users_service.create(user);
  }
}
