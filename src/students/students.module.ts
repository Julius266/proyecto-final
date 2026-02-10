import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TeacherClassesService } from './teacher-classes.service';
import { TeacherClassesController } from './teacher-classes.controller';
import { StudentSubjectsService } from './student-subjects.service';
import { StudentSubjectsController } from './student-subjects.controller';
import { User } from './student.entity';
import { TeacherSubject } from './teacher-subject.entity';
import { StudentTeacherSubject } from './student-teacher-subject.entity';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';
import { Post } from '../posts/post.entity';
import { Exam } from '../exams/exam.entity';
import { Assignment } from '../assignments/assignment.entity';
import { Project } from '../projects/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      TeacherSubject,
      StudentTeacherSubject,
      CurriculumSubject,
      Post,
      Exam,
      Assignment,
      Project,
    ]),
  ],
  controllers: [StudentsController, TeacherClassesController, StudentSubjectsController],
  providers: [StudentsService, TeacherClassesService, StudentSubjectsService],
  exports: [StudentsService, TeacherClassesService, StudentSubjectsService],
})
export class StudentsModule {}
