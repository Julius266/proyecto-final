import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { StudentSubjectsService } from './student-subjects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('student-subjects')
@UseGuards(JwtAuthGuard)
export class StudentSubjectsController {
  constructor(private readonly studentSubjectsService: StudentSubjectsService) {}

  @Get('my-subjects')
  async getMySubjects(@Request() req) {
    return await this.studentSubjectsService.getStudentSubjects(req.user.id);
  }

  @Get('subject/:curriculumSubjectId/activity')
  async getSubjectActivity(@Param('curriculumSubjectId') subjectId: string, @Request() req) {
    return await this.studentSubjectsService.getStudentSubjectActivity(req.user.id, Number(subjectId));
  }
}
