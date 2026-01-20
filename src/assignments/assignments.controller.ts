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
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@ApiTags('assignments')
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente' })
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas' })
  @ApiQuery({ name: 'subjectId', required: false, description: 'Filtrar por materia' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrar por usuario' })
  @ApiResponse({ status: 200, description: 'Lista de tareas' })
  findAll(@Query('subjectId') subjectId?: number, @Query('userId') userId?: number) {
    return this.assignmentsService.findAll(subjectId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.remove(id);
  }
}
