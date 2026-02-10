import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Subject } from '../subjects/subject.entity';
import { User } from '../students/student.entity';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  // Referencia a la materia del curriculum (integración con onboarding)
  @Column({ type: 'bigint', name: 'curriculum_subject_id', nullable: true })
  curriculumSubjectId: number;

  // Mantener compatibilidad con el sistema anterior
  @Column({ type: 'bigint', name: 'subject_id', nullable: true })
  subjectId: number;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  // Tecnologías utilizadas
  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  technologies: string[];

  // URLs del proyecto
  @Column({ type: 'text', nullable: true, name: 'repository_url' })
  repositoryUrl: string;

  @Column({ type: 'text', nullable: true, name: 'demo_url' })
  demoUrl: string;

  // Colaboradores (otros estudiantes)
  @Column({ type: 'jsonb', nullable: true, default: '[]', name: 'collaborators' })
  collaborators: number[]; // IDs de usuarios

  // Archivos adjuntos (URLs de Cloudinary)
  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  attachments: Array<{
    url: string;
    publicId: string;
    fileName: string;
    fileType: string; // 'image', 'video', 'document'
    uploadedAt: Date;
  }>;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Subject, (subject) => subject.projects, { nullable: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => CurriculumSubject, { nullable: true })
  @JoinColumn({ name: 'curriculum_subject_id' })
  curriculumSubject: CurriculumSubject;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
