import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './curriculum.service';
import { Curriculum } from './curriculum.entity';
import { CurriculumSubject } from './curriculum-subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curriculum, CurriculumSubject])],
  controllers: [CurriculumController],
  providers: [CurriculumService],
  exports: [CurriculumService],
})
export class CurriculumModule {}
