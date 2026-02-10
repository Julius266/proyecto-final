import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Dar like a un post (requiere autenticación)' })
  @ApiResponse({ status: 201, description: 'Like registrado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 409, description: 'Ya has dado like a este post' })
  likePost(@Body() body: { postId: number; userId: number }) {
    return this.likesService.likePost(body.postId, body.userId);
  }

  @Delete(':postId/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Quitar like de un post (requiere autenticación)' })
  @ApiResponse({ status: 200, description: 'Like eliminado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Like no encontrado' })
  unlikePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.likesService.unlikePost(postId, userId);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Obtener todos los likes de un post' })
  @ApiResponse({ status: 200, description: 'Lista de likes' })
  getLikesByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.likesService.getLikesByPost(postId);
  }

  @Get('post/:postId/count')
  @ApiOperation({ summary: 'Contar likes de un post' })
  @ApiResponse({ status: 200, description: 'Número de likes' })
  countLikes(@Param('postId', ParseIntPipe) postId: number) {
    return this.likesService.countLikesByPost(postId);
  }

  @Get('post/:postId/has-liked/:userId')
  @ApiOperation({ summary: 'Verificar si un usuario dio like a un post' })
  @ApiResponse({ status: 200, description: 'true o false' })
  hasLiked(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.likesService.hasLiked(postId, userId);
  }
}
