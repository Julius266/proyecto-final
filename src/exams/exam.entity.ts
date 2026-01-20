import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Subject } from '../subjects/subject.entity';
import { User } from '../students/student.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'subject_id' })
  subjectId: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Subject, (subject) => subject.exams)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => User, (user) => user.exams)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
