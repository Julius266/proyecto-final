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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
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
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: any) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las publicaciones con filtros' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar en el contenido' })
  @ApiQuery({ name: 'hashtag', required: false, description: 'Filtrar por hashtag' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrar por usuario' })
  @ApiResponse({ status: 200, description: 'Lista de publicaciones' })
  findAll(
    @Query('search') search?: string,
    @Query('hashtag') hashtag?: string,
    @Query('userId') userId?: number,
  ) {
    return this.postsService.findAll(search, hashtag, userId);
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar una publicación (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Publicación eliminada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No tienes permisos (requiere rol ADMIN)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
