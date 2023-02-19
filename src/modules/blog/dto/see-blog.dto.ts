import { CoreOutput } from 'src/dto/core.dto';
import { Pagination } from 'src/dto/pagination.dto';
import { Blog } from '../entities/blog.entity';

export class SeeBlogsByTagInput extends Pagination {
  tagId: number;
}

export class SeeBlogsByKeywordsInput extends Pagination {
  keywords: string;
}
export class SeeBlogsOutput extends CoreOutput {
  blogs?: Blog[];

  blogNum?: number;
}
