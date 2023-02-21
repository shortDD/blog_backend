import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserEntitySubscriber } from './user-subscriber';
import { Blog } from '../blog/entities/blog.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Blog])],
  controllers: [UserController],
  providers: [UserService, UserEntitySubscriber],
  exports: [UserService],
})
export class UserModule {}
