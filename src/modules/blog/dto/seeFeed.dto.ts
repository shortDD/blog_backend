import { CoreOutput } from 'src/dto/core.dto';
import { Pagination } from 'src/dto/pagination.dto';
import { Blog } from '../entities/blog.entity';

export class SeeFeedInput extends Pagination {}

export class SeeFeedOutput extends CoreOutput {
  blogs: Blog[];

  totalBlogs: number;
}
