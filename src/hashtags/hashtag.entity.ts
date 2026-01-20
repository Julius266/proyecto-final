import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity('hashtags')
export class Hashtag {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'text', unique: true })
  name: string;

  @ManyToMany(() => Post, (post) => post.hashtags)
  posts: Post[];
}
