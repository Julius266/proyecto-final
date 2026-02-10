import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Post } from './post.entity';
import { Hashtag } from '../hashtags/hashtag.entity';
import { Comment } from '../comments/comment.entity';
import { Like as LikeEntity } from '../likes/like.entity';
import { Highlight } from '../highlights/highlight.entity';
import { Exam } from '../exams/exam.entity';
import { Assignment } from '../assignments/assignment.entity';
import { Project } from '../projects/project.entity';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Hashtag)
    private hashtagsRepository: Repository<Hashtag>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(LikeEntity)
    private likesRepository: Repository<LikeEntity>,
    @InjectRepository(Highlight)
    private highlightsRepository: Repository<Highlight>,
    @InjectRepository(Exam)
    private examsRepository: Repository<Exam>,
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(CurriculumSubject)
    private curriculumSubjectsRepository: Repository<CurriculumSubject>,
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

  async findAll(
    search?: string,
    hashtag?: string,
    userId?: number,
    type?: string,
    curriculumSubjectId?: number,
  ): Promise<Post[]> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.hashtags', 'hashtag')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('comment.user', 'commentUser')
      .leftJoinAndSelect('post.highlights', 'highlights')
      .leftJoinAndSelect('highlights.teacher', 'teacher');

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

    if (type) {
      queryBuilder.andWhere('post.type = :type', { type });
    }

    if (curriculumSubjectId) {
      queryBuilder.andWhere('post.curriculumSubjectId = :curriculumSubjectId', {
        curriculumSubjectId,
      });
    }

    const posts = await queryBuilder.orderBy('post.createdAt', 'DESC').getMany();

    // Cargar datos vinculados (examen/tarea/proyecto)
    return await this.loadLinkedEntities(posts);
  }

  /**
   * Cargar entidades vinculadas (examen, tarea, proyecto) y materia
   */
  private async loadLinkedEntities(posts: Post[]): Promise<any[]> {
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const enriched: any = { ...post };

        // Cargar materia si existe
        if (post.curriculumSubjectId) {
          enriched.subject = await this.curriculumSubjectsRepository.findOne({
            where: { id: post.curriculumSubjectId },
          });
        }

        // Cargar entidad vinculada según el tipo
        if (post.linkedEntityId) {
          switch (post.type) {
            case 'exam':
              enriched.linkedEntity = await this.examsRepository.findOne({
                where: { id: post.linkedEntityId },
                relations: ['user', 'curriculumSubject'],
              });
              break;
            case 'assignment':
              enriched.linkedEntity = await this.assignmentsRepository.findOne({
                where: { id: post.linkedEntityId },
                relations: ['user', 'curriculumSubject'],
              });
              break;
            case 'project':
              enriched.linkedEntity = await this.projectsRepository.findOne({
                where: { id: post.linkedEntityId },
                relations: ['user', 'curriculumSubject', 'subject'],
              });
              break;
          }
        }

        return enriched;
      }),
    );

    return enrichedPosts;
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: [
        'user',
        'hashtags',
        'comments',
        'comments.user',
        'highlights',
        'highlights.teacher',
      ],
    });

    if (!post) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }

    // Cargar datos vinculados
    const enriched = await this.loadLinkedEntities([post]);
    return enriched[0];
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
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['comments', 'likes', 'hashtags'],
    });

    if (!post) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }

    // Eliminar comentarios relacionados
    if (post.comments && post.comments.length > 0) {
      await this.commentsRepository.remove(post.comments);
    }

    // Eliminar likes relacionados
    if (post.likes && post.likes.length > 0) {
      await this.likesRepository.remove(post.likes);
    }

    // Limpiar relación con hashtags (no elimina los hashtags, solo la relación)
    post.hashtags = [];
    await this.postsRepository.save(post);

    // Ahora eliminar el post
    await this.postsRepository.remove(post);
  }
}
