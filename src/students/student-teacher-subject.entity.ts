import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './student.entity';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';

@Entity('student_teacher_subjects')
export class StudentTeacherSubject {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'student_id' })
  studentId: number;

  @Column({ type: 'bigint', nullable: true, name: 'teacher_id' })
  teacherId: number; // Puede ser null si aún no hay docente asignado

  @Column({ type: 'bigint', name: 'curriculum_subject_id' })
  curriculumSubjectId: number;

  @Column({ type: 'integer' })
  semester: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_dragged' })
  isDragged: boolean; // Si es materia arrastrada

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'completed_at' })
  completedAt: Date;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => CurriculumSubject)
  @JoinColumn({ name: 'curriculum_subject_id' })
  curriculumSubject: CurriculumSubject;
}
