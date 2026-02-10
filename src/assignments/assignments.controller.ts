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
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('assignments')
@Controller('assignments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea en mi repositorio' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente' })
  create(@Request() req, @Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create({ ...createAssignmentDto, userId: req.user.userId });
  }

  @Get('my-repository')
  @ApiOperation({ summary: 'Obtener MI repositorio de tareas (privado)' })
  @ApiResponse({ status: 200, description: 'Mis tareas' })
  getMyRepository(@Request() req) {
    return this.assignmentsService.findByUser(req.user.userId);
  }

  @Get('user/:userId/repository')
  @ApiOperation({ summary: 'Ver el repositorio público de tareas de otro usuario' })
  @ApiResponse({ status: 200, description: 'Tareas del usuario' })
  getUserRepository(@Param('userId', ParseIntPipe) userId: number) {
    return this.assignmentsService.findByUser(userId);
  }

  @Get('curriculum-subject/:curriculumSubjectId')
  @ApiOperation({ summary: 'Obtener MIS tareas de una materia específica' })
  @ApiResponse({ status: 200, description: 'Mis tareas de la materia' })
  findByCurriculumSubject(
    @Request() req,
    @Param('curriculumSubjectId', ParseIntPipe) curriculumSubjectId: number
  ) {
    return this.assignmentsService.findByCurriculumSubjectAndUser(curriculumSubjectId, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada' })
  update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentsService.update(id, updateAssignmentDto, req.user.userId);
  }

  @Post(':id/upload')
  @ApiOperation({ summary: 'Subir archivos a MI tarea' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Archivos subidos exitosamente' })
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadFiles(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.assignmentsService.uploadFiles(id, files, req.user.userId);
  }

  @Delete(':id/file/:publicId')
  @ApiOperation({ summary: 'Eliminar un archivo de MI tarea' })
  @ApiResponse({ status: 200, description: 'Archivo eliminado exitosamente' })
  deleteFile(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Param('publicId') publicId: string,
  ) {
    return this.assignmentsService.deleteFile(id, publicId, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar MI tarea' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.remove(id, req.user.userId);
  }
}
