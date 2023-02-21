import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import {
  DataSource,
  EntitySubscriberInterface,
  LoadEvent,
  Repository,
} from 'typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserEntitySubscriber implements EntitySubscriberInterface<User> {
  constructor(
    @InjectDataSource() readonly connection: DataSource,
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async afterLoad(user: User, event?: LoadEvent<User>) {
    const { id, followers, followings } = user;
    if (followers || followings) {
      user.totalFollowers = followers.length;
      user.totalFollowings = followers.length;
    } else {
      user.totalFollowers = await this.userRepository.count({
        where: { followings: { id } },
      });
      user.totalFollowings = await this.userRepository.count({
        where: { followers: { id } },
      });
    }
    user.posts = await this.blogRepository.count({ where: { author: { id } } });
  }
}
