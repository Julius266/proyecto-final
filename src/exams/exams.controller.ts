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
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('exams')
@Controller('exams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo examen en mi repositorio' })
  @ApiResponse({ status: 201, description: 'Examen creado exitosamente' })
  create(@Request() req, @Body() createExamDto: CreateExamDto) {
    // El examen se crea automáticamente para el usuario autenticado
    return this.examsService.create({ ...createExamDto, userId: req.user.userId });
  }

  @Get('my-repository')
  @ApiOperation({ summary: 'Obtener MI repositorio de exámenes (privado)' })
  @ApiResponse({ status: 200, description: 'Mis exámenes' })
  getMyRepository(@Request() req) {
    // Solo devuelve los exámenes del usuario autenticado
    return this.examsService.findByUser(req.user.userId);
  }

  @Get('user/:userId/repository')
  @ApiOperation({ summary: 'Ver el repositorio público de exámenes de otro usuario' })
  @ApiResponse({ status: 200, description: 'Exámenes del usuario' })
  getUserRepository(@Param('userId', ParseIntPipe) userId: number) {
    // Permite ver los exámenes de otro usuario (para docentes o colaboradores)
    return this.examsService.findByUser(userId);
  }

  @Get('curriculum-subject/:curriculumSubjectId')
  @ApiOperation({ summary: 'Obtener MIS exámenes de una materia específica' })
  @ApiResponse({ status: 200, description: 'Mis exámenes de la materia' })
  findByCurriculumSubject(
    @Request() req,
    @Param('curriculumSubjectId', ParseIntPipe) curriculumSubjectId: number
  ) {
    // Solo devuelve los exámenes del usuario autenticado para esa materia
    return this.examsService.findByCurriculumSubjectAndUser(curriculumSubjectId, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un examen por ID' })
  @ApiResponse({ status: 200, description: 'Examen encontrado' })
  @ApiResponse({ status: 404, description: 'Examen no encontrado' })
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    // Permite ver el examen si es del usuario o si tiene permisos
    return this.examsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un examen' })
  @ApiResponse({ status: 200, description: 'Examen actualizado' })
  update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateExamDto: UpdateExamDto) {
    // Solo el dueño puede actualizar su examen
    return this.examsService.update(id, updateExamDto, req.user.userId);
  }

  @Post(':id/upload')
  @ApiOperation({ summary: 'Subir archivos a MI examen' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Archivos subidos exitosamente' })
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadFiles(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Solo el dueño puede subir archivos a su examen
    return this.examsService.uploadFiles(id, files, req.user.userId);
  }

  @Delete(':id/file/:publicId')
  @ApiOperation({ summary: 'Eliminar un archivo de MI examen' })
  @ApiResponse({ status: 200, description: 'Archivo eliminado exitosamente' })
  deleteFile(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Param('publicId') publicId: string,
  ) {
    // Solo el dueño puede eliminar archivos de su examen
    return this.examsService.deleteFile(id, publicId, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar MI examen' })
  @ApiResponse({ status: 200, description: 'Examen eliminado' })
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    // Solo el dueño puede eliminar su examen
    return this.examsService.remove(id, req.user.userId);
  }
}
