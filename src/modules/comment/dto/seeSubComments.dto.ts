import { CoreOutput } from 'src/dto/core.dto';
import { Pagination } from 'src/dto/pagination.dto';
import { Comment, SubComment } from '../entities/comment.entity';

export class SeeSubCommentsInput extends Pagination {
  rootCommentId: number;
}

export class SeeSubCommentsOutput extends CoreOutput {
  subComments?: SubComment[];
}
