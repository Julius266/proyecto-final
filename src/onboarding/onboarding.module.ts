import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { OnboardingV2Service } from './onboarding-v2.service';
import { User } from '../students/student.entity';
import { StudentProfile } from '../students/student-profile.entity';
import { TeacherProfile } from '../students/teacher-profile.entity';
import { TeacherSubject } from '../students/teacher-subject.entity';
import { StudentTeacherSubject } from '../students/student-teacher-subject.entity';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      StudentProfile,
      TeacherProfile,
      TeacherSubject,
      StudentTeacherSubject,
      CurriculumSubject,
    ]),
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService, OnboardingV2Service],
  exports: [OnboardingService, OnboardingV2Service],
})
export class OnboardingModule {}
