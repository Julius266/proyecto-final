import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exam } from '../exams/exam.entity';
import { Assignment } from '../assignments/assignment.entity';
import { Project } from '../projects/project.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Exam, (exam) => exam.subject)
  exams: Exam[];

  @OneToMany(() => Assignment, (assignment) => assignment.subject)
  assignments: Assignment[];

  @OneToMany(() => Project, (project) => project.subject)
  projects: Project[];
}
