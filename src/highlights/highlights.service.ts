import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Highlight } from './highlight.entity';
import { Post } from '../posts/post.entity';
import { User, UserRole } from '../students/student.entity';

@Injectable()
export class HighlightsService {
  constructor(
    @InjectRepository(Highlight)
    private highlightsRepository: Repository<Highlight>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Destacar un post (solo docentes)
   */
  async highlightPost(postId: number, teacherId: number, comment?: string): Promise<Highlight> {
    // Verificar que el usuario es docente
    const teacher = await this.usersRepository.findOne({ where: { id: teacherId } });
    if (!teacher || teacher.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Solo los docentes pueden destacar publicaciones');
    }

    // Verificar que el post existe
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // Verificar si ya destacó este post
    const existing = await this.highlightsRepository.findOne({
      where: { postId, teacherId },
    });

    if (existing) {
      throw new BadRequestException('Ya has destacado esta publicación');
    }

    const highlight = this.highlightsRepository.create({
      postId,
      teacherId,
      comment,
    });

    return await this.highlightsRepository.save(highlight);
  }

  /**
   * Quitar destacado
   */
  async removeHighlight(postId: number, teacherId: number): Promise<void> {
    const highlight = await this.highlightsRepository.findOne({
      where: { postId, teacherId },
    });

    if (!highlight) {
      throw new NotFoundException('Destacado no encontrado');
    }

    await this.highlightsRepository.remove(highlight);
  }

  /**
   * Obtener destacados de un post
   */
  async getPostHighlights(postId: number): Promise<Highlight[]> {
    return await this.highlightsRepository.find({
      where: { postId },
      relations: ['teacher'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Contar destacados de un post
   */
  async countHighlights(postId: number): Promise<number> {
    return await this.highlightsRepository.count({ where: { postId } });
  }

  /**
   * Verificar si un docente destacó un post
   */
  async hasHighlighted(postId: number, teacherId: number): Promise<boolean> {
    const count = await this.highlightsRepository.count({
      where: { postId, teacherId },
    });
    return count > 0;
  }

  /**
   * Obtener todos los destacados de un docente
   */
  async getTeacherHighlights(teacherId: number): Promise<Highlight[]> {
    return await this.highlightsRepository.find({
      where: { teacherId },
      relations: ['post', 'post.user'],
      order: { createdAt: 'DESC' },
    });
  }
}
