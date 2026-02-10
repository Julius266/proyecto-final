import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Post } from '../posts/post.entity';
import { User } from '../students/student.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Dar like a un post
  async likePost(postId: number, userId: number): Promise<Like> {
    // Verificar que el post existe
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post con ID ${postId} no encontrado`);
    }

    // Verificar que el usuario existe
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Verificar si ya existe el like
    const existingLike = await this.likesRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (existingLike) {
      throw new ConflictException('Ya has dado like a este post');
    }

    // Crear el like
    const like = this.likesRepository.create({
      post,
      user,
    });

    return await this.likesRepository.save(like);
  }

  // Quitar like de un post
  async unlikePost(postId: number, userId: number): Promise<void> {
    const like = await this.likesRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (!like) {
      throw new NotFoundException('Like no encontrado');
    }

    await this.likesRepository.remove(like);
  }

  // Obtener todos los likes de un post
  async getLikesByPost(postId: number): Promise<Like[]> {
    return await this.likesRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  // Contar likes de un post
  async countLikesByPost(postId: number): Promise<number> {
    return await this.likesRepository.count({
      where: { post: { id: postId } },
    });
  }

  // Verificar si un usuario dio like a un post
  async hasLiked(postId: number, userId: number): Promise<boolean> {
    const like = await this.likesRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    return !!like;
  }
}
