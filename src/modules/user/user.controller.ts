import { Controller, Get, Post, Body, Query, Param, Req } from '@nestjs/common';
import { AuthUser } from 'src/authGurd/auth-user.decorator';
import { Roles } from 'src/authGurd/role.decorator';
import { CreateUserInput } from './dto/create-user.dto';
import { ProfileInput } from './dto/getProfile.dto';
import { LoginInput } from './dto/login.dto';
import { SeeFollowersInput, SeeFollowingsInput } from './dto/seeFollow.dto';
import { UpdateUserInput } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Post('update')
  @Roles('Client')
  update(@Body() updateUserInput: UpdateUserInput, @AuthUser() user) {
    return this.userService.editUser(user, updateUserInput);
  }
  @Post('login')
  login(@Body() loginInput: LoginInput) {
    return this.userService.login(loginInput);
  }

  @Get('profile')
  userProfile(@Query() profileInput: ProfileInput) {
    return this.userService.userProfile(profileInput);
  }

  @Post('follow')
  @Roles('Client')
  followUser(@AuthUser() user: User, @Body('id') id: number) {
    return this.userService.follow(user, id);
  }

  @Get('me')
  @Roles('Client')
  me(@AuthUser() user: User) {
    return user;
  }

  @Get('following')
  seeFollowing(@Query() seeFollowings: SeeFollowingsInput) {
    return this.userService.seeFollowings(seeFollowings);
  }
  @Get('follower')
  seeFollower(@Query() seeFollowersInput: SeeFollowersInput) {
    return this.userService.seeFollowers(seeFollowersInput);
  }
}
