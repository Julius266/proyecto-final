import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';
import { CloudinaryService } from '../upload/cloudinary.service';
import { Post, PostType } from '../posts/post.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(CurriculumSubject)
    private curriculumSubjectRepository: Repository<CurriculumSubject>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    // Validar que al menos uno de los IDs de materia esté presente
    if (!createAssignmentDto.curriculumSubjectId && !createAssignmentDto.subjectId) {
      throw new BadRequestException('Debes proporcionar curriculumSubjectId o subjectId');
    }

    // Crear la tarea
    const assignment = this.assignmentsRepository.create(createAssignmentDto);
    const savedAssignment = await this.assignmentsRepository.save(assignment);

    // AUTO-CREAR POST en el feed
    await this.createAssignmentPost(savedAssignment);

    return savedAssignment;
  }

  /**
   * Crear automáticamente un post cuando se crea una tarea
   */
  private async createAssignmentPost(assignment: Assignment): Promise<Post> {
    // Obtener nombre de la materia si existe
    let subjectName = 'una materia';
    if (assignment.curriculumSubjectId) {
      const subject = await this.curriculumSubjectRepository.findOne({
        where: { id: assignment.curriculumSubjectId },
      });
      if (subject) {
        subjectName = subject.name;
      }
    }

    const content = `📄 Nueva tarea documentada en ${subjectName}\n\n${assignment.title || 'Tarea'}\n\n${assignment.description || ''}`.trim();

    const post = this.postsRepository.create({
      userId: assignment.userId,
      content,
      type: PostType.ASSIGNMENT,
      linkedEntityId: assignment.id,
      curriculumSubjectId: assignment.curriculumSubjectId,
    });

    return await this.postsRepository.save(post);
  }

  async findAll(subjectId?: number, userId?: number, curriculumSubjectId?: number): Promise<Assignment[]> {
    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (userId) where.userId = userId;
    if (curriculumSubjectId) where.curriculumSubjectId = curriculumSubjectId;

    return await this.assignmentsRepository.find({
      where,
      relations: ['subject', 'user', 'curriculumSubject'],
      order: { dueDate: 'ASC' },
    });
  }

  async findByUser(userId: number): Promise<Assignment[]> {
    return await this.assignmentsRepository.find({
      where: { userId },
      relations: ['subject', 'user', 'curriculumSubject'],
      order: { dueDate: 'ASC' },
    });
  }

  async findByCurriculumSubject(curriculumSubjectId: number): Promise<Assignment[]> {
    return await this.assignmentsRepository.find({
      where: { curriculumSubjectId },
      relations: ['subject', 'user', 'curriculumSubject'],
      order: { dueDate: 'ASC' },
    });
  }

  async findByCurriculumSubjectAndUser(curriculumSubjectId: number, userId: number): Promise<Assignment[]> {
    return await this.assignmentsRepository.find({
      where: { curriculumSubjectId, userId },
      relations: ['subject', 'user', 'curriculumSubject'],
      order: { dueDate: 'ASC' },
    });
  }

  async findOne(id: number, userId?: number): Promise<Assignment> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['subject', 'user', 'curriculumSubject'],
    });

    if (!assignment) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return assignment;
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto, userId: number): Promise<Assignment> {
    const assignment = await this.findOne(id);
    
    if (assignment.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para actualizar esta tarea');
    }

    Object.assign(assignment, updateAssignmentDto);
    return await this.assignmentsRepository.save(assignment);
  }

  async uploadFiles(id: number, files: Express.Multer.File[], userId: number): Promise<Assignment> {
    const assignment = await this.findOne(id);
    
    if (assignment.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para subir archivos a esta tarea');
    }
    
    const attachments = assignment.attachments || [];
    
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
    
    assignment.attachments = attachments;
    return await this.assignmentsRepository.save(assignment);
  }

  async deleteFile(assignmentId: number, publicId: string, userId: number): Promise<Assignment> {
    const assignment = await this.findOne(assignmentId);
    
    if (assignment.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar archivos de esta tarea');
    }
    
    await this.cloudinaryService.deleteFile(publicId);
    
    assignment.attachments = assignment.attachments.filter(att => att.publicId !== publicId);
    
    return await this.assignmentsRepository.save(assignment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const assignment = await this.findOne(id);
    
    if (assignment.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta tarea');
    }
    
    // Eliminar archivos de Cloudinary
    if (assignment.attachments && assignment.attachments.length > 0) {
      for (const attachment of assignment.attachments) {
        try {
          await this.cloudinaryService.deleteFile(attachment.publicId);
        } catch (error) {
          console.error(`Error eliminando archivo: ${attachment.publicId}`, error);
        }
      }
    }
    
    await this.assignmentsRepository.remove(assignment);
  }
}
