import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { CurriculumSubject } from './curriculum-subject.entity';

export enum CurriculumType {
  NEW = 'new', // Malla nueva (repotenciada)
  OLD = 'old', // Malla antigua
}

@Entity('curriculums')
export class Curriculum {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({
    type: 'enum',
    enum: CurriculumType,
  })
  type: CurriculumType;

  @Column({ type: 'text', default: 'PUCE Manabí' })
  university: string;

  @Column({ type: 'text', default: 'Ingeniería de Software' })
  career: string;

  @Column({ type: 'integer', default: 8, name: 'total_semesters' })
  totalSemesters: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => CurriculumSubject, (subject) => subject.curriculum)
  subjects: CurriculumSubject[];
}
