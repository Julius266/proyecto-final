import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';
import { CloudinaryService } from '../upload/cloudinary.service';
import { Post, PostType } from '../posts/post.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(CurriculumSubject)
    private curriculumSubjectRepository: Repository<CurriculumSubject>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // Validar que al menos uno de los IDs de materia esté presente
    if (!createProjectDto.curriculumSubjectId && !createProjectDto.subjectId) {
      throw new BadRequestException('Debes proporcionar curriculumSubjectId o subjectId');
    }

    // Crear el proyecto
    const project = this.projectsRepository.create(createProjectDto);
    const savedProject = await this.projectsRepository.save(project);

    // AUTO-CREAR POST en el feed
    await this.createProjectPost(savedProject);

    return savedProject;
  }

  /**
   * Crear automáticamente un post cuando se crea un proyecto
   */
  private async createProjectPost(project: Project): Promise<Post> {
    // Obtener nombre de la materia si existe
    let subjectName = 'una materia';
    if (project.curriculumSubjectId) {
      const subject = await this.curriculumSubjectRepository.findOne({
        where: { id: project.curriculumSubjectId },
      });
      if (subject) {
        subjectName = subject.name;
      }
    }

    const content = `💻 Nuevo proyecto documentado en ${subjectName}\n\n${project.title || 'Proyecto'}\n\n${project.description || ''}`.trim();

    const post = this.postsRepository.create({
      userId: project.userId,
      content,
      type: PostType.PROJECT,
      linkedEntityId: project.id,
      curriculumSubjectId: project.curriculumSubjectId,
    });

    return await this.postsRepository.save(post);
  }

  async findAll(subjectId?: number, userId?: number, curriculumSubjectId?: number): Promise<Project[]> {
    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (userId) where.userId = userId;
    if (curriculumSubjectId) where.curriculumSubjectId = curriculumSubjectId;

    return await this.projectsRepository.find({
      where,
      relations: ['subject', 'user', 'curriculumSubject'],
      order: { dueDate: 'ASC' },
    });
  }

  async findByUser(userId: number): Promise<Project[]> {
    return await this.projectsRepository.find({
      where: { userId },
      relations: ['subject', 'user', 'curriculumSubject'],
      order: { dueDate: 'ASC' },
    });
  }

  async findByCurriculumSubject(curriculumSubjectId: number): Promise<Project[]> {
    return await this.projectsRepository.find({
      where: { curriculumSubjectId },
      relations: ['subject', 'user', 'curriculumSubject'],
      order: { dueDate: 'ASC' },
    });
  }

  async findByCurriculumSubjectAndUser(curriculumSubjectId: number, userId: number): Promise<Project[]> {
    return await this.projectsRepository.find({
      where: { curriculumSubjectId, userId },
      relations: ['subject', 'user', 'curriculumSubject'],
      order: { dueDate: 'ASC' },
    });
  }

  async findOne(id: number, userId?: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['subject', 'user', 'curriculumSubject'],
    });

    if (!project) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number): Promise<Project> {
    const project = await this.findOne(id);
    
    if (project.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para actualizar este proyecto');
    }

    Object.assign(project, updateProjectDto);
    return await this.projectsRepository.save(project);
  }

  async uploadFiles(id: number, files: Express.Multer.File[], userId: number): Promise<Project> {
    const project = await this.findOne(id);
    
    if (project.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para subir archivos a este proyecto');
    }
    
    const attachments = project.attachments || [];
    
    for (const file of files) {
      let fileType: 'image' | 'video' | 'document';
      
      if (file.mimetype.startsWith('image/')) {
        fileType = 'image';
      } else if (file.mimetype.startsWith('video/')) {
        fileType = 'video';
      } else {
        fileType = 'document';
      }
      
      const result = await this.cloudinaryService.uploadFile(file, fileType);
      
      attachments.push({
        url: result.secure_url,
        publicId: result.public_id,
        fileName: file.originalname,
        fileType,
        uploadedAt: new Date(),
      });
    }
    
    project.attachments = attachments;
    return await this.projectsRepository.save(project);
  }

  async deleteFile(projectId: number, publicId: string, userId: number): Promise<Project> {
    const project = await this.findOne(projectId);
    
    if (project.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar archivos de este proyecto');
    }
    
    await this.cloudinaryService.deleteFile(publicId);
    
    project.attachments = project.attachments.filter(att => att.publicId !== publicId);
    
    return await this.projectsRepository.save(project);
  }

  async remove(id: number, userId: number): Promise<void> {
    const project = await this.findOne(id);
    
    if (project.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este proyecto');
    }
    
    // Eliminar archivos de Cloudinary
    if (project.attachments && project.attachments.length > 0) {
      for (const attachment of project.attachments) {
        try {
          await this.cloudinaryService.deleteFile(attachment.publicId);
        } catch (error) {
          console.error(`Error eliminando archivo: ${attachment.publicId}`, error);
        }
      }
    }
    
    await this.projectsRepository.remove(project);
  }
}
