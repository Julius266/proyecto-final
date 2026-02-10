import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.entity';
import { Hashtag } from '../hashtags/hashtag.entity';
import { Comment } from '../comments/comment.entity';
import { Like } from '../likes/like.entity';
import { Highlight } from '../highlights/highlight.entity';
import { Exam } from '../exams/exam.entity';
import { Assignment } from '../assignments/assignment.entity';
import { Project } from '../projects/project.entity';
import { CurriculumSubject } from '../curriculum/curriculum-subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      Hashtag,
      Comment,
      Like,
      Highlight,
      Exam,
      Assignment,
      Project,
      CurriculumSubject,
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
