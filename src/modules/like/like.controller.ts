import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthUser } from 'src/authGurd/auth-user.decorator';
import { Roles } from 'src/authGurd/role.decorator';
import { User } from '../user/entities/user.entity';
import { ToggleLikeInput } from './dto/toggle-like.dto';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('toggle')
  @Roles('Client')
  toggleLike(@AuthUser() user: User, @Body() toggleLikeInput: ToggleLikeInput) {
    return this.likeService.toggleLike(user, toggleLikeInput);
  }
}
