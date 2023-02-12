import { PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/dto/core.dto';
import { User } from '../entities/user.entity';

export class LoginInput extends PickType(User, ['username', 'password']) {}
export class LoginOutput extends CoreOutput {
  token?: string;
}
