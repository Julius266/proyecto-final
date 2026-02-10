import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, UserRole } from '../students/student.entity';
import { StudentProfile } from '../students/student-profile.entity';
import { TeacherProfile, TeacherVisibility } from '../students/teacher-profile.entity';
import { TeacherSubject } from '../students/teacher-subject.entity';
import { StudentTeacherSubject } from '../students/student-teacher-subject.entity';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';
import { CompleteStudentProfileV2Dto } from './dto/complete-student-profile-v2.dto';
import { CompleteTeacherProfileV2Dto } from './dto/complete-teacher-profile-v2.dto';

@Injectable()
export class OnboardingV2Service {
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
    @InjectRepository(CurriculumSubject)
    private curriculumSubjectRepository: Repository<CurriculumSubject>,
  ) {}

  /**
   * ONBOARDING DE ESTUDIANTE
   * Flujo completo automatizado
   */
  async completeStudentProfile(userId: number, dto: CompleteStudentProfileV2Dto) {
    // 1. Verificar usuario
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    
    // Permitir que usuarios sin rol asignado puedan completar como estudiante
    if (user.profileCompleted) {
      throw new ConflictException('El perfil ya ha sido completado');
    }

    // Actualizar el rol a STUDENT si no lo es
    if (user.role !== UserRole.STUDENT) {
      user.role = UserRole.STUDENT;
    }

    // 2. Obtener materias del semestre actual
    const currentSemesterSubjects = await this.curriculumSubjectRepository.find({
      where: {
        curriculumId: dto.curriculumId,
        semester: dto.currentSemester,
        isActive: true,
      },
    });

    if (currentSemesterSubjects.length === 0) {
      throw new BadRequestException('No se encontraron materias para este semestre');
    }

    // 3. Crear perfil del estudiante
    const studentProfile = new StudentProfile();
    studentProfile.userId = userId;
    studentProfile.curriculumId = dto.curriculumId;
    studentProfile.birthYear = dto.birthYear;
    studentProfile.admissionYear = dto.admissionYear;
    studentProfile.currentSemester = dto.currentSemester;
    studentProfile.academicStatus = dto.academicStatus;
    studentProfile.academicInterests = dto.academicInterests || [];
    studentProfile.trazioGoal = dto.trazioGoal;
    studentProfile.bio = dto.bio;
    studentProfile.draggedSubjects = dto.draggedSubjectIds || [];

    await this.studentProfileRepository.save(studentProfile);

    // 4. Asignar AUTOMÁTICAMENTE todas las materias del semestre actual
    for (const subject of currentSemesterSubjects) {
      await this.assignSubjectToStudent(userId, subject.id, dto.currentSemester, false);
    }

    // 5. Asignar materias arrastradas (si las hay)
    if (dto.hasDraggedSubjects && dto.draggedSubjectIds && dto.draggedSubjectIds.length > 0) {
      for (const subjectId of dto.draggedSubjectIds) {
        const subject = await this.curriculumSubjectRepository.findOne({
          where: { id: subjectId },
        });

        if (subject) {
          await this.assignSubjectToStudent(userId, subjectId, subject.semester, true);
        }
      }
    }

    // 6. Marcar perfil como completado
    user.profileCompleted = true;
    await this.usersRepository.save(user);

    return {
      message: 'Perfil de estudiante completado exitosamente',
      profile: studentProfile,
      assignedSubjects: currentSemesterSubjects.length + (dto.draggedSubjectIds?.length || 0),
    };
  }

  /**
   * Asignar una materia a un estudiante y vincular automáticamente con docente si existe
   */
  private async assignSubjectToStudent(
    studentId: number,
    curriculumSubjectId: number,
    semester: number,
    isDragged: boolean,
  ) {
    // Buscar si existe un docente que dicta esta materia
    const teacherSubject = await this.teacherSubjectRepository.findOne({
      where: { curriculumSubjectId, isActive: true },
    });

    // Crear la relación estudiante-materia (y docente si existe)
    const relation = this.studentTeacherSubjectRepository.create({
      studentId,
      teacherId: teacherSubject?.teacherId || null,
      curriculumSubjectId,
      semester,
      isActive: true,
      isDragged,
    });

    await this.studentTeacherSubjectRepository.save(relation);
  }

  /**
   * ONBOARDING DE DOCENTE
   * Flujo completo automatizado
   */
  async completeTeacherProfile(userId: number, dto: CompleteTeacherProfileV2Dto) {
    // 1. Verificar usuario
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    
    // Permitir que usuarios sin rol asignado o con rol student puedan convertirse en teacher
    // El rol se asigna/actualiza durante el onboarding
    if (user.profileCompleted) {
      throw new ConflictException('El perfil ya ha sido completado');
    }

    // Actualizar el rol a TEACHER si no lo es
    if (user.role !== UserRole.TEACHER) {
      user.role = UserRole.TEACHER;
    }

    // 2. Verificar que las materias existen
    const subjects = await this.curriculumSubjectRepository.find({
      where: {
        id: In(dto.subjectIds),
        isActive: true,
      },
    });

    if (subjects.length !== dto.subjectIds.length) {
      throw new BadRequestException('Algunas materias no existen');
    }

    // 3. Crear perfil del docente
    const teacherProfile = new TeacherProfile();
    teacherProfile.userId = userId;
    teacherProfile.curriculumIds = dto.curriculumIds;
    teacherProfile.institutionalEmail = dto.institutionalEmail;
    teacherProfile.bio = dto.bio;
    teacherProfile.visibility = dto.visibility || TeacherVisibility.ALL_CAREER;
    
    // Extraer los semestres únicos de las materias seleccionadas
    const uniqueSemesters = [...new Set(subjects.map(s => s.semester))];
    teacherProfile.semesterIds = uniqueSemesters;

    await this.teacherProfileRepository.save(teacherProfile);

    // 4. Registrar las materias que dicta
    const teacherSubjects = [];
    for (const subjectId of dto.subjectIds) {
      const teacherSubject = this.teacherSubjectRepository.create({
        teacherId: userId,
        curriculumSubjectId: subjectId,
        isActive: true,
      });

      const saved = await this.teacherSubjectRepository.save(teacherSubject);
      teacherSubjects.push(saved);
    }

    // 5. ASIGNACIÓN AUTOMÁTICA: Vincular con estudiantes existentes que tengan esas materias
    const studentsToUpdate = await this.studentTeacherSubjectRepository.find({
      where: {
        curriculumSubjectId: In(dto.subjectIds),
        teacherId: null, // Solo estudiantes sin docente asignado
      },
    });

    for (const relation of studentsToUpdate) {
      relation.teacherId = userId;
      await this.studentTeacherSubjectRepository.save(relation);
    }

    // 6. Marcar perfil como completado
    user.profileCompleted = true;
    await this.usersRepository.save(user);

    return {
      message: 'Perfil de docente completado exitosamente',
      profile: teacherProfile,
      subjects: teacherSubjects.length,
      studentsLinked: studentsToUpdate.length,
    };
  }
}
