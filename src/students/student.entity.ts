import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Exam } from '../exams/exam.entity';
import { Assignment } from '../assignments/assignment.entity';
import { Project } from '../projects/project.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
import { Like } from '../likes/like.entity';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', select: false }) // No se devuelve por defecto en las consultas
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ type: 'boolean', default: false, name: 'profile_completed' })
  profileCompleted: boolean;

  @Column({ type: 'text', nullable: true, name: 'profile_image' })
  profileImage: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'registration_date' })
  registrationDate: Date;

  @OneToMany(() => Exam, (exam) => exam.user)
  exams: Exam[];

  @OneToMany(() => Assignment, (assignment) => assignment.user)
  assignments: Assignment[];

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
