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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proyecto en mi repositorio' })
  @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente' })
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create({ ...createProjectDto, userId: req.user.userId });
  }

  @Get('my-repository')
  @ApiOperation({ summary: 'Obtener MI repositorio de proyectos (privado)' })
  @ApiResponse({ status: 200, description: 'Mis proyectos' })
  getMyRepository(@Request() req) {
    return this.projectsService.findByUser(req.user.userId);
  }

  @Get('user/:userId/repository')
  @ApiOperation({ summary: 'Ver el repositorio público de proyectos de otro usuario' })
  @ApiResponse({ status: 200, description: 'Proyectos del usuario' })
  getUserRepository(@Param('userId', ParseIntPipe) userId: number) {
    return this.projectsService.findByUser(userId);
  }

  @Get('curriculum-subject/:curriculumSubjectId')
  @ApiOperation({ summary: 'Obtener MIS proyectos de una materia específica' })
  @ApiResponse({ status: 200, description: 'Mis proyectos de la materia' })
  findByCurriculumSubject(
    @Request() req,
    @Param('curriculumSubjectId', ParseIntPipe) curriculumSubjectId: number
  ) {
    return this.projectsService.findByCurriculumSubjectAndUser(curriculumSubjectId, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proyecto por ID' })
  @ApiResponse({ status: 200, description: 'Proyecto encontrado' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto actualizado' })
  update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto, req.user.userId);
  }

  @Post(':id/upload')
  @ApiOperation({ summary: 'Subir archivos a MI proyecto' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Archivos subidos exitosamente' })
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadFiles(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.projectsService.uploadFiles(id, files, req.user.userId);
  }

  @Delete(':id/file/:publicId')
  @ApiOperation({ summary: 'Eliminar un archivo de MI proyecto' })
  @ApiResponse({ status: 200, description: 'Archivo eliminado exitosamente' })
  deleteFile(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Param('publicId') publicId: string,
  ) {
    return this.projectsService.deleteFile(id, publicId, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar MI proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto eliminado' })
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id, req.user.userId);
  }
}
