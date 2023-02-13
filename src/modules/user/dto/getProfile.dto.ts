import { PickType, PartialType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/dto/core.dto';
import { User } from '../entities/user.entity';

export class ProfileInput extends PartialType(
  PickType(User, ['id', 'username']),
) {}

export class ProfileOutput extends CoreOutput {
  user?: User;
}
