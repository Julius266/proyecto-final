import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, IsIn, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PostType } from '../post.entity';

export class CreatePostDto {
  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 'Consejos para el examen de programación #examen #programacion' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: 'general', enum: PostType, required: false, default: 'general' })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @ApiProperty({ example: 123, description: 'ID del examen/tarea/proyecto vinculado', required: false })
  @IsOptional()
  @IsNumber()
  linkedEntityId?: number;

  @ApiProperty({ example: 5, description: 'ID de la materia del curriculum', required: false })
  @IsOptional()
  @IsNumber()
  curriculumSubjectId?: number;

  @ApiProperty({ example: 'https://res.cloudinary.com/...', required: false })
  @IsOptional()
  @IsString()
  filePath?: string;

  @ApiProperty({ example: 'image', required: false, enum: ['image', 'video', 'document'] })
  @IsOptional()
  @IsString()
  @IsIn(['image', 'video', 'document'])
  fileType?: string;

  @ApiProperty({ example: 'mi-archivo.pdf', required: false })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ example: ['examen', 'programacion'], required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];
}
