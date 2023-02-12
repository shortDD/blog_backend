import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class CreateUserInput extends PickType(User, [
  'username',
  'password',
  'bio',
  'avatar',
]) {}
