import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Post } from '../posts/post.entity';
import { User } from '../students/student.entity';

@Entity('highlights')
@Unique(['post', 'teacher']) // Un docente solo puede destacar una vez cada post
export class Highlight {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'post_id' })
  postId: number;

  @Column({ type: 'bigint', name: 'teacher_id' })
  teacherId: number;

  @Column({ type: 'text', nullable: true })
  comment: string; // Comentario opcional del docente al destacar

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;
}
