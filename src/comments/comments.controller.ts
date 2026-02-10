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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../students/student.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear un nuevo comentario (requiere autenticación)' })
  @ApiResponse({ status: 201, description: 'Comentario creado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los comentarios' })
  @ApiQuery({ name: 'postId', required: false, description: 'Filtrar por publicación' })
  @ApiResponse({ status: 200, description: 'Lista de comentarios' })
  findAll(@Query('postId') postId?: number) {
    return this.commentsService.findAll(postId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un comentario por ID' })
  @ApiResponse({ status: 200, description: 'Comentario encontrado' })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar un comentario (requiere autenticación)' })
  @ApiResponse({ status: 200, description: 'Comentario actualizado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar un comentario (propietario o ADMIN)' })
  @ApiResponse({ status: 200, description: 'Comentario eliminado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para eliminar este comentario' })
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    // Verificar que el usuario sea el propietario o un admin
    const comment = await this.commentsService.findOne(id);

    // Convertir a número para comparar correctamente (bigint puede venir como string)
    const commentUserId = Number(comment.userId);
    const currentUserId = Number(user.userId);

    if (commentUserId !== currentUserId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No tienes permisos para eliminar este comentario');
    }

    return this.commentsService.remove(id);
  }
}
