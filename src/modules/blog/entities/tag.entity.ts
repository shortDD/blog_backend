import { CoreEntity } from 'src/entities/core.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
@Entity()
export class Tag extends CoreEntity {
  @Column()
  tagname: string;

  @ManyToMany(() => Blog, (blog) => blog.tags)
  blogs: Blog[];
}
