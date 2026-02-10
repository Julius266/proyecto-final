import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurriculumService } from './curriculum.service';

@ApiTags('Curriculum')
@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las mallas curriculares' })
  @ApiResponse({ status: 200, description: 'Lista de mallas curriculares' })
  async getAllCurriculums() {
    return this.curriculumService.getAllCurriculums();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una malla curricular por ID' })
  @ApiResponse({ status: 200, description: 'Malla curricular con sus materias' })
  async getCurriculumById(@Param('id') id: string) {
    return this.curriculumService.getCurriculumById(parseInt(id, 10));
  }

  @Get(':id/semesters')
  @ApiOperation({ summary: 'Obtener lista de semestres de una malla' })
  @ApiResponse({ status: 200, description: 'Lista de semestres' })
  async getSemestersByCurriculum(@Param('id') id: string) {
    return this.curriculumService.getSemestersByCurriculum(parseInt(id, 10));
  }

  @Get(':id/subjects')
  @ApiOperation({ summary: 'Obtener todas las materias de una malla' })
  @ApiResponse({ status: 200, description: 'Lista de materias agrupadas por semestre' })
  async getAllSubjectsByCurriculum(@Param('id') id: string) {
    return this.curriculumService.getAllSubjectsByCurriculum(parseInt(id, 10));
  }

  @Get(':id/semester/:semester/subjects')
  @ApiOperation({ summary: 'Obtener materias de un semestre específico' })
  @ApiResponse({ status: 200, description: 'Lista de materias del semestre' })
  async getSubjectsBySemester(
    @Param('id') id: string,
    @Param('semester') semester: string,
  ) {
    return this.curriculumService.getSubjectsByCurriculumAndSemester(
      parseInt(id, 10),
      parseInt(semester, 10),
    );
  }
}
