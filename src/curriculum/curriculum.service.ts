import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curriculum } from './curriculum.entity';
import { CurriculumSubject } from './curriculum-subject.entity';
import { CURRICULUM_DATA } from './curriculum-data';

@Injectable()
export class CurriculumService implements OnModuleInit {
  private readonly logger = new Logger(CurriculumService.name);

  constructor(
    @InjectRepository(Curriculum)
    private curriculumRepository: Repository<Curriculum>,
    @InjectRepository(CurriculumSubject)
    private curriculumSubjectRepository: Repository<CurriculumSubject>,
  ) {}

  async onModuleInit() {
    await this.seedCurriculums();
  }

  private async seedCurriculums() {
    try {
      const existingCount = await this.curriculumRepository.count();
      
      if (existingCount > 0) {
        this.logger.log('Curriculums already seeded');
        return;
      }

      this.logger.log('Seeding curriculums...');

      for (const curriculumData of CURRICULUM_DATA) {
        // Crear la malla curricular
        const curriculum = this.curriculumRepository.create({
          name: curriculumData.name,
          type: curriculumData.type,
          university: 'PUCE Manabí',
          career: 'Ingeniería de Software',
          totalSemesters: 8,
          isActive: true,
        });

        const savedCurriculum = await this.curriculumRepository.save(curriculum);

        // Crear las materias de esta malla
        const subjects = curriculumData.subjects.map((subjectData) =>
          this.curriculumSubjectRepository.create({
            curriculumId: savedCurriculum.id,
            name: subjectData.name,
            semester: subjectData.semester,
            code: subjectData.code,
            isActive: true,
          }),
        );

        await this.curriculumSubjectRepository.save(subjects);

        this.logger.log(
          `Seeded curriculum "${curriculumData.name}" with ${subjects.length} subjects`,
        );
      }

      this.logger.log('Curriculums seeded successfully');
    } catch (error) {
      this.logger.error('Error seeding curriculums', error);
    }
  }

  async getAllCurriculums() {
    return this.curriculumRepository.find({
      where: { isActive: true },
      order: { type: 'DESC' }, // NEW primero, OLD después
    });
  }

  async getCurriculumById(id: number) {
    return this.curriculumRepository.findOne({
      where: { id },
      relations: ['subjects'],
    });
  }

  async getSubjectsByCurriculumAndSemester(curriculumId: number, semester: number) {
    return this.curriculumSubjectRepository.find({
      where: {
        curriculumId,
        semester,
        isActive: true,
      },
      order: { name: 'ASC' },
    });
  }

  async getAllSubjectsByCurriculum(curriculumId: number) {
    return this.curriculumSubjectRepository.find({
      where: {
        curriculumId,
        isActive: true,
      },
      order: { semester: 'ASC', name: 'ASC' },
    });
  }

  async getSemestersByCurriculum(curriculumId: number) {
    const curriculum = await this.curriculumRepository.findOne({
      where: { id: curriculumId },
    });

    if (!curriculum) {
      return [];
    }

    // Retornar array [1, 2, 3, ..., 8]
    return Array.from({ length: curriculum.totalSemesters }, (_, i) => i + 1);
  }
}
