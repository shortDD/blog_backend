import { IsNotEmpty } from 'class-validator';

export class ToggleLikeInput {
  blogId?: number;

  commentId?: number;

  subCommentId?: number;
}
