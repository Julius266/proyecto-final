import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TeacherClassesService } from './teacher-classes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('teacher-classes')
@UseGuards(JwtAuthGuard)
export class TeacherClassesController {
  constructor(private readonly teacherClassesService: TeacherClassesService) {}

  @Get('my-subjects')
  async getMySubjects(@Request() req) {
    return await this.teacherClassesService.getTeacherSubjects(req.user.id);
  }

  @Get('subject/:curriculumSubjectId/students')
  async getSubjectStudents(@Param('curriculumSubjectId') subjectId: string, @Request() req) {
    return await this.teacherClassesService.getSubjectStudents(req.user.id, Number(subjectId));
  }

  @Get('subject/:curriculumSubjectId/activity')
  async getSubjectActivity(
    @Param('curriculumSubjectId') subjectId: string,
    @Query('limit') limit: string,
    @Request() req,
  ) {
    return await this.teacherClassesService.getSubjectActivity(
      req.user.id,
      Number(subjectId),
      limit ? Number(limit) : 20,
    );
  }

  @Get('subject/:curriculumSubjectId/stats')
  async getSubjectStats(@Param('curriculumSubjectId') subjectId: string, @Request() req) {
    return await this.teacherClassesService.getSubjectStats(req.user.id, Number(subjectId));
  }
}
