import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@ApiTags('subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva materia' })
  @ApiResponse({ status: 201, description: 'Materia creada exitosamente' })
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las materias' })
  @ApiResponse({ status: 200, description: 'Lista de materias' })
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una materia por ID' })
  @ApiResponse({ status: 200, description: 'Materia encontrada' })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una materia' })
  @ApiResponse({ status: 200, description: 'Materia actualizada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una materia' })
  @ApiResponse({ status: 200, description: 'Materia eliminada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.remove(id);
  }
}
