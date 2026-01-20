import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const assignment = this.assignmentsRepository.create(createAssignmentDto);
    return await this.assignmentsRepository.save(assignment);
  }

  async findAll(subjectId?: number, userId?: number): Promise<Assignment[]> {
    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (userId) where.userId = userId;

    return await this.assignmentsRepository.find({
      where,
      relations: ['subject', 'user'],
      order: { dueDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['subject', 'user'],
    });

    if (!assignment) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return assignment;
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment> {
    const assignment = await this.findOne(id);
    Object.assign(assignment, updateAssignmentDto);
    return await this.assignmentsRepository.save(assignment);
  }

  async remove(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentsRepository.remove(assignment);
  }
}
