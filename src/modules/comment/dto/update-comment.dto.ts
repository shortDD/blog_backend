import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentInput } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentInput) {}
