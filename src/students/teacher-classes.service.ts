import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, UserRole } from './student.entity';
import { TeacherSubject } from './teacher-subject.entity';
import { StudentTeacherSubject } from './student-teacher-subject.entity';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';
import { Post, PostType } from '../posts/post.entity';
import { Exam } from '../exams/exam.entity';
import { Assignment } from '../assignments/assignment.entity';
import { Project } from '../projects/project.entity';

@Injectable()
export class TeacherClassesService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(TeacherSubject)
    private teacherSubjectsRepository: Repository<TeacherSubject>,
    @InjectRepository(StudentTeacherSubject)
    private studentTeacherSubjectsRepository: Repository<StudentTeacherSubject>,
    @InjectRepository(CurriculumSubject)
    private curriculumSubjectsRepository: Repository<CurriculumSubject>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Exam)
    private examsRepository: Repository<Exam>,
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  /**
   * Obtener todas las materias que imparte un docente
   */
  async getTeacherSubjects(teacherId: number) {
    const teacher = await this.usersRepository.findOne({ where: { id: teacherId } });
    if (!teacher || teacher.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Solo los docentes pueden acceder a esta información');
    }

    const teacherSubjects = await this.teacherSubjectsRepository.find({
      where: { teacherId, isActive: true },
      relations: ['curriculumSubject', 'curriculumSubject.curriculum'],
    });

    // Obtener cantidad de estudiantes por materia
    const enrichedSubjects = await Promise.all(
      teacherSubjects.map(async (ts) => {
        const studentsCount = await this.studentTeacherSubjectsRepository.count({
          where: { curriculumSubjectId: ts.curriculumSubjectId, isActive: true },
        });

        // Contar publicaciones de estudiantes en esta materia
        const postsCount = await this.postsRepository.count({
          where: { curriculumSubjectId: ts.curriculumSubjectId },
        });

        return {
          ...ts,
          studentsCount,
          postsCount,
        };
      }),
    );

    return enrichedSubjects;
  }

  /**
   * Obtener estudiantes de una materia específica del docente
   */
  async getSubjectStudents(teacherId: number, curriculumSubjectId: number) {
    // Verificar que el docente imparte esta materia
    const teacherSubject = await this.teacherSubjectsRepository.findOne({
      where: { teacherId, curriculumSubjectId, isActive: true },
    });

    if (!teacherSubject) {
      throw new NotFoundException('No impartes esta materia');
    }

    const studentRelations = await this.studentTeacherSubjectsRepository.find({
      where: { curriculumSubjectId, teacherId, isActive: true },
      relations: ['student'],
    });

    return studentRelations.map((rel) => rel.student);
  }

  /**
   * Obtener actividad reciente de estudiantes en una materia
   */
  async getSubjectActivity(teacherId: number, curriculumSubjectId: number, limit: number = 20) {
    // Verificar que el docente imparte esta materia
    const teacherSubject = await this.teacherSubjectsRepository.findOne({
      where: { teacherId, curriculumSubjectId, isActive: true },
    });

    if (!teacherSubject) {
      throw new NotFoundException('No impartes esta materia');
    }

    // Obtener posts de esta materia
    const posts = await this.postsRepository.find({
      where: { curriculumSubjectId },
      relations: ['user', 'highlights', 'highlights.teacher'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    // Enriquecer con datos vinculados
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const enriched: any = { ...post };

        if (post.linkedEntityId) {
          switch (post.type) {
            case PostType.EXAM:
              enriched.linkedEntity = await this.examsRepository.findOne({
                where: { id: post.linkedEntityId },
              });
              break;
            case PostType.ASSIGNMENT:
              enriched.linkedEntity = await this.assignmentsRepository.findOne({
                where: { id: post.linkedEntityId },
              });
              break;
            case PostType.PROJECT:
              enriched.linkedEntity = await this.projectsRepository.findOne({
                where: { id: post.linkedEntityId },
              });
              break;
          }
        }

        return enriched;
      }),
    );

    return enrichedPosts;
  }

  /**
   * Obtener estadísticas de una materia
   */
  async getSubjectStats(teacherId: number, curriculumSubjectId: number) {
    // Verificar que el docente imparte esta materia
    const teacherSubject = await this.teacherSubjectsRepository.findOne({
      where: { teacherId, curriculumSubjectId, isActive: true },
    });

    if (!teacherSubject) {
      throw new NotFoundException('No impartes esta materia');
    }

    const totalStudents = await this.studentTeacherSubjectsRepository.count({
      where: { curriculumSubjectId, isActive: true },
    });

    const totalExams = await this.examsRepository.count({
      where: { curriculumSubjectId },
    });

    const totalAssignments = await this.assignmentsRepository.count({
      where: { curriculumSubjectId },
    });

    const totalProjects = await this.projectsRepository.count({
      where: { curriculumSubjectId },
    });

    const totalPosts = await this.postsRepository.count({
      where: { curriculumSubjectId },
    });

    return {
      totalStudents,
      totalExams,
      totalAssignments,
      totalProjects,
      totalPosts,
    };
  }
}
