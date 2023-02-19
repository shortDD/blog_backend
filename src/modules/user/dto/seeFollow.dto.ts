import { IsNotEmpty } from 'class-validator';
import { CoreOutput } from 'src/dto/core.dto';
import { Pagination } from 'src/dto/pagination.dto';
import { User } from '../entities/user.entity';

export class SeeFollowingsInput extends Pagination {
  @IsNotEmpty({ message: 'userId不能为空' })
  userId: number;
}

export class SeeFollowingsOutput extends CoreOutput {
  followings?: User[];
}

export class SeeFollowersInput extends Pagination {
  @IsNotEmpty({ message: 'userId不能为空' })
  userId: number;
}

export class SeeFollowersOutput extends CoreOutput {
  followers?: User[];
}
