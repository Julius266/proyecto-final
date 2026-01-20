import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = this.subjectsRepository.create(createSubjectDto);
    return await this.subjectsRepository.save(subject);
  }

  async findAll(): Promise<Subject[]> {
    return await this.subjectsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectsRepository.findOne({
      where: { id },
      relations: ['exams', 'assignments', 'projects'],
    });
    
    if (!subject) {
      throw new NotFoundException(`Materia con ID ${id} no encontrada`);
    }
    
    return subject;
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findOne(id);
    Object.assign(subject, updateSubjectDto);
    return await this.subjectsRepository.save(subject);
  }

  async remove(id: number): Promise<void> {
    const subject = await this.findOne(id);
    await this.subjectsRepository.remove(subject);
  }
}
