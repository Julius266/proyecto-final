import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { OnboardingV2Service } from './onboarding-v2.service';
import { CompleteStudentProfileDto } from './dto/complete-student-profile.dto';
import { CompleteTeacherProfileDto } from './dto/complete-teacher-profile.dto';
import { CompleteStudentProfileV2Dto } from './dto/complete-student-profile-v2.dto';
import { CompleteTeacherProfileV2Dto } from './dto/complete-teacher-profile-v2.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Onboarding')
@Controller('onboarding')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OnboardingController {
  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly onboardingV2Service: OnboardingV2Service,
  ) {}

  @Post('student')
  @ApiOperation({ summary: 'Completar perfil de estudiante (primera vez)' })
  @ApiResponse({ status: 201, description: 'Perfil completado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Perfil ya completado' })
  async completeStudentProfile(
    @Request() req,
    @Body() dto: CompleteStudentProfileDto,
  ) {
    return this.onboardingService.completeStudentProfile(req.user.userId, dto);
  }

  @Post('teacher')
  @ApiOperation({ summary: 'Completar perfil de docente (primera vez)' })
  @ApiResponse({ status: 201, description: 'Perfil completado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Perfil ya completado' })
  async completeTeacherProfile(
    @Request() req,
    @Body() dto: CompleteTeacherProfileDto,
  ) {
    return this.onboardingService.completeTeacherProfile(req.user.userId, dto);
  }

  @Get('teachers')
  @ApiOperation({ summary: 'Obtener lista de todos los docentes' })
  @ApiResponse({ status: 200, description: 'Lista de docentes' })
  async getAllTeachers() {
    return this.onboardingService.getAllTeachers();
  }

  @Get('teachers/:id/subjects')
  @ApiOperation({ summary: 'Obtener materias de un docente específico' })
  @ApiResponse({ status: 200, description: 'Lista de materias del docente' })
  @ApiResponse({ status: 404, description: 'Docente no encontrado' })
  async getTeacherSubjects(@Param('id') id: string) {
    return this.onboardingService.getTeacherSubjects(parseInt(id, 10));
  }

  @Get('teachers/:id')
  @ApiOperation({ summary: 'Obtener perfil completo de un docente' })
  @ApiResponse({ status: 200, description: 'Perfil del docente con sus materias' })
  @ApiResponse({ status: 404, description: 'Docente no encontrado' })
  async getTeacherProfile(@Param('id') id: string) {
    return this.onboardingService.getTeacherProfile(parseInt(id, 10));
  }

  // ========== ENDPOINTS V2 (CON MALLAS CURRICULARES) ==========

  @Post('v2/student')
  @ApiOperation({ summary: '[V2] Completar perfil de estudiante con malla curricular' })
  @ApiResponse({ status: 201, description: 'Perfil completado exitosamente con asignación automática' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Perfil ya completado' })
  async completeStudentProfileV2(
    @Request() req,
    @Body() dto: CompleteStudentProfileV2Dto,
  ) {
    return this.onboardingV2Service.completeStudentProfile(req.user.userId, dto);
  }

  @Post('v2/teacher')
  @ApiOperation({ summary: '[V2] Completar perfil de docente con malla curricular' })
  @ApiResponse({ status: 201, description: 'Perfil completado con vinculación automática de estudiantes' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Perfil ya completado' })
  async completeTeacherProfileV2(
    @Request() req,
    @Body() dto: CompleteTeacherProfileV2Dto,
  ) {
    return this.onboardingV2Service.completeTeacherProfile(req.user.userId, dto);
  }
}
