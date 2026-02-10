import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './student.entity';
import { Curriculum } from '../curriculum/curriculum.entity';

export enum AcademicStatus {
  STUDYING = 'studying',
  GRADUATED = 'graduated',
}

export enum TrazioGoal {
  DOCUMENT = 'document', // Documentar mi trayectoria
  COLLABORATE = 'collaborate', // Trabajos colaborativos
  PORTFOLIO = 'portfolio', // Portafolio académico
  TRACK_PROGRESS = 'track_progress', // Seguimiento del progreso
}

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', unique: true, name: 'user_id' })
  userId: number;

  @Column({ type: 'bigint', name: 'curriculum_id' })
  curriculumId: number;

  @Column({ type: 'integer', name: 'birth_year' })
  birthYear: number;

  @Column({ type: 'integer', name: 'admission_year' })
  admissionYear: number; // Año de ingreso

  @Column({ type: 'integer', name: 'current_semester' })
  currentSemester: number;

  @Column({
    type: 'enum',
    enum: AcademicStatus,
    default: AcademicStatus.STUDYING,
    name: 'academic_status',
  })
  academicStatus: AcademicStatus;

  // Intereses académicos (array de strings)
  @Column({ type: 'jsonb', nullable: true, default: '[]', name: 'academic_interests' })
  academicInterests: string[];

  // Objetivo en TRAZIO
  @Column({
    type: 'enum',
    enum: TrazioGoal,
    nullable: true,
    name: 'trazio_goal',
  })
  trazioGoal: TrazioGoal;

  @Column({ type: 'text', nullable: true })
  bio: string;

  // IDs de materias arrastradas (referencia a CurriculumSubject)
  @Column({ type: 'jsonb', nullable: true, default: '[]', name: 'dragged_subjects' })
  draggedSubjects: number[];

  // Historial de semestres anteriores (JSON)
  @Column({ type: 'jsonb', nullable: true, default: '[]', name: 'semester_history' })
  semesterHistory: Array<{
    semester: number;
    year: number;
    subjects: number[]; // IDs de CurriculumSubject
  }>;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Curriculum)
  @JoinColumn({ name: 'curriculum_id' })
  curriculum: Curriculum;
}
