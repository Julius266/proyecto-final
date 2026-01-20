import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Post } from './post.entity';
import { Hashtag } from '../hashtags/hashtag.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Hashtag)
    private hashtagsRepository: Repository<Hashtag>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { hashtags, ...postData } = createPostDto;

    const post = this.postsRepository.create(postData);

    // Process hashtags
    if (hashtags && hashtags.length > 0) {
      const hashtagEntities = await Promise.all(
        hashtags.map(async (name) => {
          const cleanName = name.toLowerCase().replace('#', '');
          let hashtag = await this.hashtagsRepository.findOne({ where: { name: cleanName } });

          if (!hashtag) {
            hashtag = this.hashtagsRepository.create({ name: cleanName });
            hashtag = await this.hashtagsRepository.save(hashtag);
          }

          return hashtag;
        }),
      );

      post.hashtags = hashtagEntities;
    }

    return await this.postsRepository.save(post);
  }

  async findAll(search?: string, hashtag?: string, userId?: number): Promise<Post[]> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.hashtags', 'hashtag')
      .leftJoinAndSelect('post.comments', 'comment');

    if (search) {
      queryBuilder.where('post.content ILIKE :search', { search: `%${search}%` });
    }

    if (hashtag) {
      queryBuilder.andWhere('hashtag.name = :hashtag', {
        hashtag: hashtag.toLowerCase().replace('#', ''),
      });
    }

    if (userId) {
      queryBuilder.andWhere('post.userId = :userId', { userId });
    }

    return await queryBuilder.orderBy('post.createdAt', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user', 'hashtags', 'comments', 'comments.user'],
    });

    if (!post) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    const { hashtags, ...postData } = updatePostDto;

    Object.assign(post, postData);

    // Update hashtags if provided
    if (hashtags) {
      const hashtagEntities = await Promise.all(
        hashtags.map(async (name) => {
          const cleanName = name.toLowerCase().replace('#', '');
          let hashtag = await this.hashtagsRepository.findOne({ where: { name: cleanName } });

          if (!hashtag) {
            hashtag = this.hashtagsRepository.create({ name: cleanName });
            hashtag = await this.hashtagsRepository.save(hashtag);
          }

          return hashtag;
        }),
      );

      post.hashtags = hashtagEntities;
    }

    return await this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postsRepository.remove(post);
  }
}
