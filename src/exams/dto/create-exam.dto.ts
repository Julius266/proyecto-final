import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1, description: 'ID de la materia del curriculum', required: false })
  @IsOptional()
  @IsNumber()
  curriculumSubjectId?: number;

  @ApiProperty({ example: 1, description: 'ID de la materia (legacy)', required: false })
  @IsOptional()
  @IsNumber()
  subjectId?: number;

  @ApiProperty({ example: 'Examen Parcial 1', description: 'Título del examen', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Examen parcial de programación', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-02-15', description: 'Fecha del examen' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ 
    example: [], 
    description: 'Archivos adjuntos',
    required: false 
  })
  @IsOptional()
  @IsArray()
  attachments?: Array<{
    url: string;
    publicId: string;
    fileName: string;
    fileType: string;
    uploadedAt: Date;
  }>;
}
