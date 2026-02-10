import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './student.entity';
import { StudentTeacherSubject } from './student-teacher-subject.entity';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';
import { Post } from '../posts/post.entity';

@Injectable()
export class StudentSubjectsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(StudentTeacherSubject)
    private studentTeacherSubjectsRepository: Repository<StudentTeacherSubject>,
    @InjectRepository(CurriculumSubject)
    private curriculumSubjectsRepository: Repository<CurriculumSubject>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  /**
   * Obtener todas las materias de un estudiante
   */
  async getStudentSubjects(studentId: number) {
    const student = await this.usersRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const studentSubjects = await this.studentTeacherSubjectsRepository.find({
      where: { studentId, isActive: true },
      relations: ['curriculumSubject', 'curriculumSubject.curriculum', 'teacher'],
    });

    // Enriquecer con conteo de posts por materia
    const enrichedSubjects = await Promise.all(
      studentSubjects.map(async (ss) => {
        const postsCount = await this.postsRepository.count({
          where: {
            userId: studentId,
            curriculumSubjectId: ss.curriculumSubjectId,
          },
        });

        return {
          ...ss,
          postsCount,
        };
      }),
    );

    return enrichedSubjects;
  }

  /**
   * Obtener actividad de un estudiante en una materia específica
   */
  async getStudentSubjectActivity(studentId: number, curriculumSubjectId: number) {
    const posts = await this.postsRepository.find({
      where: {
        userId: studentId,
        curriculumSubjectId,
      },
      relations: ['highlights', 'highlights.teacher'],
      order: { createdAt: 'DESC' },
    });

    return posts;
  }
}
