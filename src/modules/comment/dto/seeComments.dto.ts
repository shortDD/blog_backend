import { CoreOutput } from 'src/dto/core.dto';
import { Pagination } from 'src/dto/pagination.dto';
import { Comment } from '../entities/comment.entity';

export class SeeCommentsInput extends Pagination {
  blogId: number;
}

export class SeeCommentsOutput extends CoreOutput {
  comments?: Comment[];

  commentNum?: number;
}
