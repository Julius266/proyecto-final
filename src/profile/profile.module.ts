import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { User } from '../students/student.entity';
import { StudentProfile } from '../students/student-profile.entity';
import { TeacherProfile } from '../students/teacher-profile.entity';
import { TeacherSubject } from '../students/teacher-subject.entity';
import { StudentTeacherSubject } from '../students/student-teacher-subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      StudentProfile,
      TeacherProfile,
      TeacherSubject,
      StudentTeacherSubject,
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
