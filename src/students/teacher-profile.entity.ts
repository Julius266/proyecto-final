import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './student.entity';

export enum TeacherVisibility {
  MY_STUDENTS = 'my_students', // Ver solo mis estudiantes
  ALL_CAREER = 'all_career', // Ver toda la carrera
  HIGHLIGHTED = 'highlighted', // Ver aportes destacados
}

@Entity('teacher_profiles')
export class TeacherProfile {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', unique: true, name: 'user_id' })
  userId: number;

  @Column({ type: 'text', nullable: true, name: 'institutional_email' })
  institutionalEmail: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  // IDs de las mallas en las que dicta clases
  @Column({ type: 'jsonb', nullable: true, default: '[]', name: 'curriculum_ids' })
  curriculumIds: number[];

  // IDs de los semestres en los que dicta clases
  @Column({ type: 'jsonb', nullable: true, default: '[]', name: 'semester_ids' })
  semesterIds: number[];

  // Preferencia de visibilidad
  @Column({
    type: 'enum',
    enum: TeacherVisibility,
    default: TeacherVisibility.ALL_CAREER,
  })
  visibility: TeacherVisibility;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
