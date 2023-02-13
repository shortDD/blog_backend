import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.dto';
import { ProfileInput } from './dto/getProfile.dto';
import { LoginInput } from './dto/login.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Post('login')
  login(@Body() loginInput: LoginInput) {
    return this.userService.login(loginInput);
  }

  @Get('profile')
  getProfile(@Query() profileInput: ProfileInput) {
    return this.userService.getProfile(profileInput);
  }
}
