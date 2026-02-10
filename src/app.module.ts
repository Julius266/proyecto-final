import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ExamsModule } from './exams/exams.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { ProjectsModule } from './projects/projects.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { LikesModule } from './likes/likes.module';
import { HighlightsModule } from './highlights/highlights.module';
import { UploadModule } from './upload/upload.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ProfileModule } from './profile/profile.module';
import { CurriculumModule } from './curriculum/curriculum.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // TEMPORAL: Cambia a false después de crear las tablas
      logging: true,
      ssl: {
        rejectUnauthorized: false, // Necesario para NeonDB
      },
    }),
    AuthModule,
    StudentsModule,
    SubjectsModule,
    ExamsModule,
    AssignmentsModule,
    ProjectsModule,
    PostsModule,
    CommentsModule,
    HashtagsModule,
    LikesModule,
    HighlightsModule,
    UploadModule,
    OnboardingModule,
    ProfileModule,
    CurriculumModule,
  ],
})
export class AppModule {}
