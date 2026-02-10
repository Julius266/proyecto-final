import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsString, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 1, description: 'ID del usuario', required: false })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ example: 1, description: 'ID de la materia del curriculum', required: false })
  @IsOptional()
  @IsNumber()
  curriculumSubjectId?: number;

  @ApiProperty({ example: 1, description: 'ID de la materia (legacy)', required: false })
  @IsOptional()
  @IsNumber()
  subjectId?: number;

  @ApiProperty({ example: 'Proyecto Final: Sistema Web', description: 'Título del proyecto', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Proyecto final de la materia', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-03-01', description: 'Fecha de entrega' })
  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: ['React', 'Node.js', 'PostgreSQL'], description: 'Tecnologías utilizadas', required: false })
  @IsOptional()
  @IsArray()
  technologies?: string[];

  @ApiProperty({ example: 'https://github.com/user/repo', description: 'URL del repositorio', required: false })
  @IsOptional()
  @IsUrl()
  repositoryUrl?: string;

  @ApiProperty({ example: 'https://demo.vercel.app', description: 'URL de la demo', required: false })
  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @ApiProperty({ example: [2, 3], description: 'IDs de colaboradores', required: false })
  @IsOptional()
  @IsArray()
  collaborators?: number[];

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
