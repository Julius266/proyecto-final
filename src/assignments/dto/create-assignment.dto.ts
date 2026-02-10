import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
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

  @ApiProperty({ example: 'Tarea 1: Algoritmos', description: 'Título de la tarea', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Tarea sobre estructuras de datos', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-02-20', description: 'Fecha de entrega' })
  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

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
