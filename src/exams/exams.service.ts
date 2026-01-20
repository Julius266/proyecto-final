import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examsRepository: Repository<Exam>,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const exam = this.examsRepository.create(createExamDto);
    return await this.examsRepository.save(exam);
  }

  async findAll(subjectId?: number, userId?: number): Promise<Exam[]> {
    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (userId) where.userId = userId;

    return await this.examsRepository.find({
      where,
      relations: ['subject', 'user'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Exam> {
    const exam = await this.examsRepository.findOne({
      where: { id },
      relations: ['subject', 'user'],
    });

    if (!exam) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado`);
    }

    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(id);
    Object.assign(exam, updateExamDto);
    return await this.examsRepository.save(exam);
  }

  async remove(id: number): Promise<void> {
    const exam = await this.findOne(id);
    await this.examsRepository.remove(exam);
  }
}
