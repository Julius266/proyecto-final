import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HighlightsController } from './highlights.controller';
import { HighlightsService } from './highlights.service';
import { Highlight } from './highlight.entity';
import { Post } from '../posts/post.entity';
import { User } from '../students/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Highlight, Post, User])],
  controllers: [HighlightsController],
  providers: [HighlightsService],
  exports: [HighlightsService],
})
export class HighlightsModule {}
