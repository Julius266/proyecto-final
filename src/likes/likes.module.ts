import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Like } from './like.entity';
import { Post } from '../posts/post.entity';
import { User } from '../students/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Post, User])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
