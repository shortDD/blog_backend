import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/authGurd/role.decorator';
import { CreateUserInput } from './dto/create-user.dto';
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

  @Get('test')
  @Roles('Client')
  test() {
    return 'role';
  }
}
