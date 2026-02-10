import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from '../students/student.entity';
import { Comment } from '../comments/comment.entity';
import { Hashtag } from '../hashtags/hashtag.entity';
import { Like } from '../likes/like.entity';
import { Highlight } from '../highlights/highlight.entity';

export enum PostType {
  GENERAL = 'general',
  EXAM = 'exam',
  ASSIGNMENT = 'assignment',
  PROJECT = 'project',
  RESOURCE = 'resource',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.GENERAL,
  })
  type: PostType;

  @Column({ type: 'bigint', nullable: true, name: 'linked_entity_id' })
  linkedEntityId: number; // ID del exam/assignment/project vinculado

  @Column({ type: 'bigint', nullable: true, name: 'curriculum_subject_id' })
  curriculumSubjectId: number; // Materia relacionada

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'text', nullable: true, name: 'file_path' })
  filePath: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'file_type' })
  fileType: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'file_name' })
  fileName: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post, { cascade: true })
  likes: Like[];

  @OneToMany(() => Highlight, (highlight) => highlight.post, { cascade: true })
  highlights: Highlight[];

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.posts)
  @JoinTable({
    name: 'post_hashtags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'hashtag_id', referencedColumnName: 'id' },
  })
  hashtags: Hashtag[];
}
