import { CoreEntity } from 'src/entities/core.entity';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class User extends CoreEntity {
  @Column({ unique: true, length: 500 })
  username: string;

  @Column({ select: false })
  password: number;

  @Column({ nullable: true })
  avatar?: string;

  @ManyToMany(() => User, (user) => user.followings)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  followings: User[];
}
