import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hashtag } from './hashtag.entity';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtag)
    private hashtagsRepository: Repository<Hashtag>,
  ) {}

  async findAll(): Promise<Hashtag[]> {
    return await this.hashtagsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Hashtag> {
    const hashtag = await this.hashtagsRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    
    if (!hashtag) {
      throw new NotFoundException(`Hashtag con ID ${id} no encontrado`);
    }
    
    return hashtag;
  }

  async findByName(name: string): Promise<Hashtag> {
    const cleanName = name.toLowerCase().replace('#', '');
    const hashtag = await this.hashtagsRepository.findOne({
      where: { name: cleanName },
      relations: ['posts'],
    });
    
    if (!hashtag) {
      throw new NotFoundException(`Hashtag "${name}" no encontrado`);
    }
    
    return hashtag;
  }

  async getPopular(limit: number = 10): Promise<any[]> {
    const result = await this.hashtagsRepository
      .createQueryBuilder('hashtag')
      .leftJoin('hashtag.posts', 'post')
      .select('hashtag.id', 'id')
      .addSelect('hashtag.name', 'name')
      .addSelect('COUNT(post.id)', 'postCount')
      .groupBy('hashtag.id')
      .orderBy('COUNT(post.id)', 'DESC')
      .limit(limit)
      .getRawMany();

    return result;
  }
}
