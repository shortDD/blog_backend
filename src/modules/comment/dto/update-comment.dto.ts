import { PartialType, PickType } from '@nestjs/mapped-types';
import { Comment, SubComment } from '../entities/comment.entity';
import { CreateCommentInput } from './create-comment.dto';

export class EditCommentInput extends PickType(Comment, ['content', 'id']) {}

export class EditSubCommentInput extends PickType(SubComment, [
  'content',
  'id',
]) {}
