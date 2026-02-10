import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';
import { CloudinaryService } from '../upload/cloudinary.service';
import { Post, PostType } from '../posts/post.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examsRepository: Repository<Exam>,
    @InjectRepository(CurriculumSubject)
    private curriculumSubjectRepository: Repository<CurriculumSubject>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    // Validar que al menos uno de los IDs de materia esté presente
    if (!createExamDto.curriculumSubjectId && !createExamDto.subjectId) {
      throw new BadRequestException('Debes proporcionar curriculumSubjectId o subjectId');
    }

    // Crear el examen
    const exam = this.examsRepository.create(createExamDto);
    const savedExam = await this.examsRepository.save(exam);

    // AUTO-CREAR POST en el feed
    await this.createExamPost(savedExam);

    return savedExam;
  }

  /**
   * Crear automáticamente un post cuando se crea un examen
   */
  private async createExamPost(exam: Exam): Promise<Post> {
    // Obtener nombre de la materia si existe
    let subjectName = 'una materia';
    if (exam.curriculumSubjectId) {
      const subject = await this.curriculumSubjectRepository.findOne({
        where: { id: exam.curriculumSubjectId },
      });
      if (subject) {
        subjectName = subject.name;
      }
    }

    const content = `📝 Nuevo examen documentado en ${subjectName}\n\n${exam.title || 'Examen'}\n\n${exam.description || ''}`.trim();

    const post = this.postsRepository.create({
      userId: exam.userId,
      content,
      type: PostType.EXAM,
      linkedEntityId: exam.id,
      curriculumSubjectId: exam.curriculumSubjectId,
    });

    return await this.postsRepository.save(post);
  }

  async findAll(subjectId?: number, userId?: number, curriculumSubjectId?: number): Promise<Exam[]> {
    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (userId) where.userId = userId;
    if (curriculumSubjectId) where.curriculumSubjectId = curriculumSubjectId;

    return await this.examsRepository.find({
      where,
      relations: ['subject', 'user', 'curriculumSubject'],
      order: { date: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Exam[]> {
    return await this.examsRepository.find({
      where: { userId },
      relations: ['subject', 'user', 'curriculumSubject'],
      order: { date: 'DESC' },
    });
  }

  async findByCurriculumSubject(curriculumSubjectId: number): Promise<Exam[]> {
    return await this.examsRepository.find({
      where: { curriculumSubjectId },
      relations: ['subject', 'user', 'curriculumSubject'],
      order: { date: 'DESC' },
    });
  }

  async findByCurriculumSubjectAndUser(curriculumSubjectId: number, userId: number): Promise<Exam[]> {
    return await this.examsRepository.find({
      where: { curriculumSubjectId, userId },
      relations: ['subject', 'user', 'curriculumSubject'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number, userId?: number): Promise<Exam> {
    const exam = await this.examsRepository.findOne({
      where: { id },
      relations: ['subject', 'user', 'curriculumSubject'],
    });

    if (!exam) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado`);
    }

    // Verificar si el usuario tiene permiso para ver este examen
    // (opcional: puedes agregar lógica más compleja aquí, como permitir a docentes)
    if (userId && exam.userId !== userId) {
      // Por ahora, permitimos ver exámenes de otros usuarios (para el repositorio público)
      // Si quieres restringir, descomenta la siguiente línea:
      // throw new ForbiddenException('No tienes permiso para ver este examen');
    }

    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto, userId: number): Promise<Exam> {
    const exam = await this.findOne(id);
    
    // Verificar que el examen pertenezca al usuario
    if (exam.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para actualizar este examen');
    }

    Object.assign(exam, updateExamDto);
    return await this.examsRepository.save(exam);
  }

  async uploadFiles(id: number, files: Express.Multer.File[], userId: number): Promise<Exam> {
    const exam = await this.findOne(id);
    
    // Verificar que el examen pertenezca al usuario
    if (exam.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para subir archivos a este examen');
    }
    
    const attachments = exam.attachments || [];
    
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
    
    exam.attachments = attachments;
    return await this.examsRepository.save(exam);
  }

  async deleteFile(examId: number, publicId: string, userId: number): Promise<Exam> {
    const exam = await this.findOne(examId);
    
    // Verificar que el examen pertenezca al usuario
    if (exam.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar archivos de este examen');
    }
    
    await this.cloudinaryService.deleteFile(publicId);
    
    exam.attachments = exam.attachments.filter(att => att.publicId !== publicId);
    
    return await this.examsRepository.save(exam);
  }

  async remove(id: number, userId: number): Promise<void> {
    const exam = await this.findOne(id);
    
    // Verificar que el examen pertenezca al usuario
    if (exam.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este examen');
    }
    
    // Eliminar archivos de Cloudinary
    if (exam.attachments && exam.attachments.length > 0) {
      for (const attachment of exam.attachments) {
        try {
          await this.cloudinaryService.deleteFile(attachment.publicId);
        } catch (error) {
          console.error(`Error eliminando archivo: ${attachment.publicId}`, error);
        }
      }
    }
    
    await this.examsRepository.remove(exam);
  }
}
