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
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../students/student.entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear una nueva publicación (requiere autenticación)' })
  @ApiResponse({ status: 201, description: 'Publicación creada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las publicaciones con filtros' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar en el contenido' })
  @ApiQuery({ name: 'hashtag', required: false, description: 'Filtrar por hashtag' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrar por usuario' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filtrar por tipo de publicación (general, exam, assignment, project, resource)',
  })
  @ApiQuery({ name: 'curriculumSubjectId', required: false, description: 'Filtrar por materia' })
  @ApiResponse({ status: 200, description: 'Lista de publicaciones' })
  findAll(
    @Query('search') search?: string,
    @Query('hashtag') hashtag?: string,
    @Query('userId') userId?: number,
    @Query('type') type?: string,
    @Query('curriculumSubjectId') curriculumSubjectId?: number,
  ) {
    return this.postsService.findAll(search, hashtag, userId, type, curriculumSubjectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una publicación por ID' })
  @ApiResponse({ status: 200, description: 'Publicación encontrada' })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar una publicación (requiere autenticación)' })
  @ApiResponse({ status: 200, description: 'Publicación actualizada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar una publicación (propietario o ADMIN)' })
  @ApiResponse({ status: 200, description: 'Publicación eliminada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para eliminar esta publicación' })
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    // Verificar que el usuario sea el propietario o un admin
    const post = await this.postsService.findOne(id);

    // Convertir a número para comparar correctamente (bigint puede venir como string)
    const postUserId = Number(post.userId);
    const currentUserId = Number(user.userId);

    if (postUserId !== currentUserId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No tienes permisos para eliminar esta publicación');
    }

    return this.postsService.remove(id);
  }
}
