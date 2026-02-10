import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from './student.entity';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';

@Entity('teacher_subjects')
@Unique(['curriculumSubjectId']) // Solo un docente por materia específica
export class TeacherSubject {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'teacher_id' })
  teacherId: number;

  @Column({ type: 'bigint', name: 'curriculum_subject_id' })
  curriculumSubjectId: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => CurriculumSubject)
  @JoinColumn({ name: 'curriculum_subject_id' })
  curriculumSubject: CurriculumSubject;
}
