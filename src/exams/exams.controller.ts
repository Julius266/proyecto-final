import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@ApiTags('exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo examen' })
  @ApiResponse({ status: 201, description: 'Examen creado exitosamente' })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los exámenes' })
  @ApiQuery({ name: 'subjectId', required: false, description: 'Filtrar por materia' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrar por usuario' })
  @ApiResponse({ status: 200, description: 'Lista de exámenes' })
  findAll(@Query('subjectId') subjectId?: number, @Query('userId') userId?: number) {
    return this.examsService.findAll(subjectId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un examen por ID' })
  @ApiResponse({ status: 200, description: 'Examen encontrado' })
  @ApiResponse({ status: 404, description: 'Examen no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un examen' })
  @ApiResponse({ status: 200, description: 'Examen actualizado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un examen' })
  @ApiResponse({ status: 200, description: 'Examen eliminado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.remove(id);
  }
}
