import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Curriculum } from './curriculum.entity';

@Entity('curriculum_subjects')
export class CurriculumSubject {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'curriculum_id' })
  curriculumId: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'integer' })
  semester: number;

  @Column({ type: 'text', nullable: true })
  code: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Curriculum, (curriculum) => curriculum.subjects)
  @JoinColumn({ name: 'curriculum_id' })
  curriculum: Curriculum;
}
