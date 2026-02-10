import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener mi perfil completo' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario autenticado' })
  async getMyProfile(@Request() req) {
    return this.profileService.getMyProfile(req.user.userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Obtener historial de materias del estudiante' })
  @ApiResponse({ status: 200, description: 'Historial de materias' })
  async getStudentHistory(@Request() req) {
    return this.profileService.getStudentHistory(req.user.userId);
  }

  @Put('student')
  @ApiOperation({ summary: 'Actualizar perfil de estudiante' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateStudentProfile(
    @Request() req,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    return this.profileService.updateStudentProfile(req.user.userId, dto);
  }

  @Put('teacher')
  @ApiOperation({ summary: 'Actualizar perfil de docente' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateTeacherProfile(
    @Request() req,
    @Body() dto: { institutionalEmail?: string; bio?: string },
  ) {
    return this.profileService.updateTeacherProfile(req.user.userId, dto);
  }

  @Put('image')
  @ApiOperation({ summary: 'Actualizar foto de perfil' })
  @ApiResponse({ status: 200, description: 'Foto actualizada exitosamente' })
  async updateProfileImage(
    @Request() req,
    @Body() body: { imageUrl: string },
  ) {
    return this.profileService.updateProfileImage(req.user.userId, body.imageUrl);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil público de un usuario' })
  @ApiResponse({ status: 200, description: 'Perfil público del usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getPublicProfile(@Param('id') id: string) {
    return this.profileService.getPublicProfile(parseInt(id, 10));
  }
}
