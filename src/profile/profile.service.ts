import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, UserRole } from '../students/student.entity';
import { StudentProfile } from '../students/student-profile.entity';
import { TeacherProfile } from '../students/teacher-profile.entity';
import { TeacherSubject } from '../students/teacher-subject.entity';
import { StudentTeacherSubject } from '../students/student-teacher-subject.entity';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(StudentProfile)
    private studentProfileRepository: Repository<StudentProfile>,
    @InjectRepository(TeacherProfile)
    private teacherProfileRepository: Repository<TeacherProfile>,
    @InjectRepository(TeacherSubject)
    private teacherSubjectRepository: Repository<TeacherSubject>,
    @InjectRepository(StudentTeacherSubject)
    private studentTeacherSubjectRepository: Repository<StudentTeacherSubject>,
  ) {}

  async getMyProfile(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'email', 'role', 'profileCompleted', 'registrationDate', 'profileImage'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.role === UserRole.STUDENT) {
      const studentProfile = await this.studentProfileRepository.findOne({
        where: { userId },
        relations: ['curriculum'],
      });

      // Obtener las relaciones con docentes y materias activas
      const activeRelations = await this.studentTeacherSubjectRepository.find({
        where: { studentId: userId, isActive: true },
        relations: ['teacher', 'curriculumSubject'],
      });

      return {
        ...user,
        profile: studentProfile,
        currentSubjects: activeRelations,
      };
    } else if (user.role === UserRole.TEACHER) {
      const teacherProfile = await this.teacherProfileRepository.findOne({
        where: { userId },
      });

      const teacherSubjects = await this.teacherSubjectRepository.find({
        where: { teacherId: userId, isActive: true },
        relations: ['curriculumSubject', 'curriculumSubject.curriculum'],
      });

      // Contar estudiantes asignados por materia
      const subjectsWithStudentCount = await Promise.all(
        teacherSubjects.map(async (ts) => {
          const studentCount = await this.studentTeacherSubjectRepository.count({
            where: { 
              curriculumSubjectId: ts.curriculumSubjectId, 
              teacherId: userId,
              isActive: true 
            },
          });
          return {
            ...ts,
            studentCount,
          };
        })
      );

      return {
        ...user,
        profile: teacherProfile,
        subjects: subjectsWithStudentCount,
      };
    }

    return user;
  }

  async updateStudentProfile(userId: number, dto: UpdateStudentProfileDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.role !== UserRole.STUDENT) {
      throw new BadRequestException('Solo los estudiantes pueden actualizar este perfil');
    }

    const studentProfile = await this.studentProfileRepository.findOne({
      where: { userId },
    });

    if (!studentProfile) {
      throw new NotFoundException('Perfil de estudiante no encontrado');
    }

    // Si está cambiando de semestre, guardar el historial
    if (dto.currentSemester && dto.currentSemester !== studentProfile.currentSemester) {
      // Obtener materias del semestre anterior
      const previousSemesterSubjects = await this.studentTeacherSubjectRepository.find({
        where: { studentId: userId, semester: studentProfile.currentSemester, isActive: true },
        relations: ['teacherSubject'],
      });

      // Agregar al historial
      const historyEntry = {
        semester: studentProfile.currentSemester,
        year: new Date().getFullYear(),
        subjects: previousSemesterSubjects.map(rel => rel.curriculumSubjectId),
      };

      const currentHistory = studentProfile.semesterHistory || [];
      studentProfile.semesterHistory = [...currentHistory, historyEntry];

      // Desactivar materias del semestre anterior
      for (const relation of previousSemesterSubjects) {
        relation.isActive = false;
        relation.completedAt = new Date();
        await this.studentTeacherSubjectRepository.save(relation);
      }
    }

    // Actualizar datos básicos del perfil
    if (dto.birthYear !== undefined) studentProfile.birthYear = dto.birthYear;
    if (dto.currentSemester !== undefined) studentProfile.currentSemester = dto.currentSemester;
    if (dto.bio !== undefined) studentProfile.bio = dto.bio;

    await this.studentProfileRepository.save(studentProfile);

    // Si se proporcionaron nuevas relaciones con docentes/materias
    if (dto.teachersAndSubjects && dto.teachersAndSubjects.length > 0) {
      for (const teacherData of dto.teachersAndSubjects) {
        const teacher = await this.usersRepository.findOne({
          where: { id: teacherData.teacherId, role: UserRole.TEACHER },
        });

        if (!teacher) {
          throw new NotFoundException(`Docente con ID ${teacherData.teacherId} no encontrado`);
        }

        const teacherSubjects = await this.teacherSubjectRepository.find({
          where: {
            id: In(teacherData.subjectIds),
            teacherId: teacherData.teacherId,
          },
        });

        if (teacherSubjects.length !== teacherData.subjectIds.length) {
          throw new BadRequestException('Algunas materias no existen o no pertenecen al docente');
        }

        for (const subject of teacherSubjects) {
          const existingRelation = await this.studentTeacherSubjectRepository.findOne({
            where: {
              studentId: userId,
              teacherId: teacherData.teacherId,
              curriculumSubjectId: subject.id,
              isActive: true,
            },
          });

          if (!existingRelation) {
            const relation = this.studentTeacherSubjectRepository.create({
              studentId: userId,
              teacherId: teacherData.teacherId,
              curriculumSubjectId: subject.id,
              semester: dto.currentSemester || studentProfile.currentSemester,
              isActive: true,
            });

            await this.studentTeacherSubjectRepository.save(relation);
          }
        }
      }
    }

    return {
      message: 'Perfil actualizado exitosamente',
      profile: studentProfile,
    };
  }

  async updateProfileImage(userId: number, imageUrl: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.profileImage = imageUrl;
    await this.usersRepository.save(user);

    return {
      message: 'Foto de perfil actualizada exitosamente',
      profileImage: imageUrl,
    };
  }

  async updateTeacherProfile(userId: number, updateData: { institutionalEmail?: string; bio?: string }) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.role !== UserRole.TEACHER) {
      throw new BadRequestException('Solo los docentes pueden actualizar este perfil');
    }

    const teacherProfile = await this.teacherProfileRepository.findOne({
      where: { userId },
    });

    if (!teacherProfile) {
      throw new NotFoundException('Perfil de docente no encontrado');
    }

    if (updateData.institutionalEmail !== undefined) {
      teacherProfile.institutionalEmail = updateData.institutionalEmail;
    }

    if (updateData.bio !== undefined) {
      teacherProfile.bio = updateData.bio;
    }

    await this.teacherProfileRepository.save(teacherProfile);

    return {
      message: 'Perfil de docente actualizado exitosamente',
      profile: teacherProfile,
    };
  }

  async getStudentHistory(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== UserRole.STUDENT) {
      throw new BadRequestException('Solo los estudiantes tienen historial de materias');
    }

    const studentProfile = await this.studentProfileRepository.findOne({
      where: { userId },
    });

    if (!studentProfile) {
      throw new NotFoundException('Perfil de estudiante no encontrado');
    }

    // Obtener todas las relaciones (activas e inactivas)
    const allRelations = await this.studentTeacherSubjectRepository.find({
      where: { studentId: userId },
      relations: ['teacher', 'teacherSubject'],
      order: { createdAt: 'DESC' },
    });

    return {
      currentSemester: studentProfile.currentSemester,
      semesterHistory: studentProfile.semesterHistory || [],
      allSubjectsTaken: allRelations,
    };
  }

  async getPublicProfile(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'email', 'role', 'registrationDate', 'profileImage'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.role === UserRole.STUDENT) {
      const studentProfile = await this.studentProfileRepository.findOne({
        where: { userId },
        relations: ['curriculum'],
      });

      const activeRelations = await this.studentTeacherSubjectRepository.find({
        where: { studentId: userId, isActive: true },
        relations: ['teacher', 'curriculumSubject'],
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        registrationDate: user.registrationDate,
        profileImage: user.profileImage,
        profile: studentProfile,
        currentSubjects: activeRelations,
      };
    } else if (user.role === UserRole.TEACHER) {
      const teacherProfile = await this.teacherProfileRepository.findOne({
        where: { userId },
      });

      const teacherSubjects = await this.teacherSubjectRepository.find({
        where: { teacherId: userId, isActive: true },
        relations: ['curriculumSubject', 'curriculumSubject.curriculum'],
      });

      // Contar estudiantes asignados por materia
      const subjectsWithStudentCount = await Promise.all(
        teacherSubjects.map(async (ts) => {
          const studentCount = await this.studentTeacherSubjectRepository.count({
            where: { 
              curriculumSubjectId: ts.curriculumSubjectId, 
              teacherId: userId,
              isActive: true 
            },
          });
          return {
            ...ts,
            studentCount,
          };
        })
      );

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        registrationDate: user.registrationDate,
        profileImage: user.profileImage,
        profile: teacherProfile,
        subjects: subjectsWithStudentCount,
      };
    }

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      registrationDate: user.registrationDate,
      profileImage: user.profileImage,
    };
  }
}
