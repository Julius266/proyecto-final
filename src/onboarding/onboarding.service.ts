import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, UserRole } from '../students/student.entity';
import { StudentProfile } from '../students/student-profile.entity';
import { TeacherProfile } from '../students/teacher-profile.entity';
import { TeacherSubject } from '../students/teacher-subject.entity';
import { StudentTeacherSubject } from '../students/student-teacher-subject.entity';
import { CompleteStudentProfileDto } from './dto/complete-student-profile.dto';
import { CompleteTeacherProfileDto } from './dto/complete-teacher-profile.dto';

@Injectable()
export class OnboardingService {
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

  async completeStudentProfile(userId: number, dto: CompleteStudentProfileDto) {
    // Verificar que el usuario existe
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si ya completó el perfil
    if (user.profileCompleted) {
      throw new ConflictException('El perfil ya ha sido completado');
    }

    // Actualizar el rol a STUDENT si no lo es
    if (user.role !== UserRole.STUDENT) {
      user.role = UserRole.STUDENT;
    }

    // Verificar que exista un perfil de estudiante, si no crearlo
    let studentProfile = await this.studentProfileRepository.findOne({
      where: { userId },
    });

    if (studentProfile) {
      // Actualizar perfil existente
      Object.assign(studentProfile, {
        birthYear: dto.birthYear,
        currentSemester: dto.currentSemester,
        bio: dto.bio,
      });
    } else {
      // Crear nuevo perfil
      studentProfile = this.studentProfileRepository.create({
        userId: userId,
        curriculumId: 1, // Default malla
        birthYear: dto.birthYear || 2000,
        admissionYear: new Date().getFullYear(),
        currentSemester: dto.currentSemester,
        academicStatus: 'studying' as any,
        bio: dto.bio,
      });
    }

    await this.studentProfileRepository.save(studentProfile);

    // Procesar las relaciones con docentes y materias
    for (const teacherData of dto.teachersAndSubjects) {
      // Verificar que el docente existe
      const teacher = await this.usersRepository.findOne({
        where: { id: teacherData.teacherId, role: UserRole.TEACHER },
      });

      if (!teacher) {
        throw new NotFoundException(`Docente con ID ${teacherData.teacherId} no encontrado`);
      }

      // Verificar que las materias existen y pertenecen al docente
      const teacherSubjects = await this.teacherSubjectRepository.find({
        where: {
          id: In(teacherData.subjectIds),
          teacherId: teacherData.teacherId,
        },
      });

      if (teacherSubjects.length !== teacherData.subjectIds.length) {
        throw new BadRequestException('Algunas materias no existen o no pertenecen al docente seleccionado');
      }

      // Crear las relaciones estudiante-docente-materia
      for (const subject of teacherSubjects) {
        // Verificar si ya existe la relación
        const existingRelation = await this.studentTeacherSubjectRepository.findOne({
          where: {
            studentId: userId,
            teacherId: teacherData.teacherId,
            curriculumSubjectId: subject.id,
          },
        });

        if (!existingRelation) {
          const relation = this.studentTeacherSubjectRepository.create({
            studentId: userId,
            teacherId: teacherData.teacherId,
            curriculumSubjectId: subject.id,
            semester: dto.currentSemester,
            isActive: true,
          });

          await this.studentTeacherSubjectRepository.save(relation);
        }
      }
    }

    // Marcar el perfil como completado
    user.profileCompleted = true;
    await this.usersRepository.save(user);

    return {
      message: 'Perfil de estudiante completado exitosamente',
      profile: studentProfile,
    };
  }

  async completeTeacherProfile(userId: number, dto: CompleteTeacherProfileDto) {
    // Verificar que el usuario existe
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si ya completó el perfil
    if (user.profileCompleted) {
      throw new ConflictException('El perfil ya ha sido completado');
    }

    // Actualizar el rol a TEACHER si no lo es
    if (user.role !== UserRole.TEACHER) {
      user.role = UserRole.TEACHER;
    }

    // Crear o actualizar perfil de docente
    let teacherProfile = await this.teacherProfileRepository.findOne({
      where: { userId },
    });

    if (teacherProfile) {
      Object.assign(teacherProfile, {
        institutionalEmail: dto.department, // Temporal
        bio: dto.bio,
      });
    } else {
      teacherProfile = this.teacherProfileRepository.create({
        userId: userId,
        institutionalEmail: dto.department,
        bio: dto.bio,
        curriculumIds: [1], // Default
        visibility: 'all_career' as any,
      });
    }

    await this.teacherProfileRepository.save(teacherProfile);

    // Crear las materias del docente (V1 - texto libre, no funciona con V2)
    const createdSubjects = [];
    for (const subjectDto of dto.subjects) {
      const teacherSubject = this.teacherSubjectRepository.create({
        teacherId: userId,
        curriculumSubjectId: 1, // Placeholder - V1 no usa mallas
        isActive: true,
      });

      const saved = await this.teacherSubjectRepository.save(teacherSubject);
      createdSubjects.push(saved);
    }

    // Marcar el perfil como completado
    user.profileCompleted = true;
    await this.usersRepository.save(user);

    return {
      message: 'Perfil de docente completado exitosamente',
      profile: teacherProfile,
      subjects: createdSubjects,
    };
  }

  async getAllTeachers() {
    const teachers = await this.usersRepository.find({
      where: { role: UserRole.TEACHER, profileCompleted: true },
      select: ['id', 'name', 'email'],
    });

    return teachers;
  }

  async getTeacherSubjects(teacherId: number) {
    const teacher = await this.usersRepository.findOne({
      where: { id: teacherId, role: UserRole.TEACHER },
    });

    if (!teacher) {
      throw new NotFoundException('Docente no encontrado');
    }

    const subjects = await this.teacherSubjectRepository.find({
      where: { teacherId, isActive: true },
    });

    return subjects;
  }

  async getTeacherProfile(teacherId: number) {
    const teacher = await this.usersRepository.findOne({
      where: { id: teacherId, role: UserRole.TEACHER },
      select: ['id', 'name', 'email'],
    });

    if (!teacher) {
      throw new NotFoundException('Docente no encontrado');
    }

    const profile = await this.teacherProfileRepository.findOne({
      where: { userId: teacherId },
    });

    const subjects = await this.teacherSubjectRepository.find({
      where: { teacherId, isActive: true },
    });

    return {
      ...teacher,
      profile,
      subjects,
    };
  }
}
