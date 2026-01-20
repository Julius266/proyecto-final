import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Subject } from '../subjects/subject.entity';
import { User } from '../students/student.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'subject_id' })
  subjectId: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Subject, (subject) => subject.projects)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
