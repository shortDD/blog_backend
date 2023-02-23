import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/dto/core.dto';
import { Repository } from 'typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { Comment, SubComment } from '../comment/entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { ToggleLikeInput } from './dto/toggle-like.dto';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(SubComment)
    private readonly subCommentRepository: Repository<SubComment>,
  ) {}

  async toggleLike(
    user: User,
    { blogId, commentId, subCommentId }: ToggleLikeInput,
  ): Promise<CoreOutput> {
    const like = await this.likeRepository.findOne({
      where: {
        user: { id: user.id },
        ...(blogId && { blog: { id: blogId } }),
        ...(commentId && { comment: { id: commentId } }),
        ...(subCommentId && { subComment: { id: subCommentId } }),
      },
    });
    if (like) {
      // 存在 则取消
      await this.likeRepository.remove(like);
    } else {
      // 不存在 则创建
      if (commentId && !subCommentId && !blogId) {
        const comment = await this.commentRepository.findOneBy({
          id: commentId,
        });
        await this.likeRepository.save(
          this.likeRepository.create({ user, comment }),
        );
      } else if (!commentId && subCommentId && !blogId) {
        const subComment = await this.subCommentRepository.findOneBy({
          id: subCommentId,
        });
        await this.likeRepository.save(
          this.likeRepository.create({ user, subComment }),
        );
      } else if (!commentId && !subCommentId && blogId) {
        const blog = await this.blogRepository.findOneBy({
          id: blogId,
        });
        await this.likeRepository.save(
          this.likeRepository.create({ user, blog }),
        );
      }
    }
    return {
      ok: true,
    };
    try {
    } catch {
      throw new InternalServerErrorException('点赞功能报错');
    }
  }
}
