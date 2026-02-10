import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AcademicStatus, TrazioGoal } from '../../students/student-profile.entity';

export enum AcademicInterest {
  WEB_DEV = 'Desarrollo Web',
  DATABASES = 'Bases de Datos',
  AI = 'IA',
  DATA_SCIENCE = 'Ciencia de Datos',
  VIDEOGAMES = 'Videojuegos',
  CYBERSECURITY = 'Ciberseguridad',
  CLOUD_DEVOPS = 'Cloud / DevOps',
  IOT = 'IoT',
}

export class CompleteStudentProfileV2Dto {
  @ApiProperty({ example: 1, description: 'ID de la malla curricular' })
  @IsNotEmpty()
  @IsNumber()
  curriculumId: number;

  @ApiProperty({ example: 5, description: 'Semestre actual (1-8)' })
  @IsNotEmpty()
  @IsNumber()
  currentSemester: number;

  @ApiProperty({ example: 2005, description: 'Año de nacimiento' })
  @IsNotEmpty()
  @IsNumber()
  birthYear: number;

  @ApiProperty({ example: 2023, description: 'Año de ingreso a la universidad' })
  @IsNotEmpty()
  @IsNumber()
  admissionYear: number;

  @ApiProperty({ example: 'studying', enum: AcademicStatus })
  @IsNotEmpty()
  @IsEnum(AcademicStatus)
  academicStatus: AcademicStatus;

  @ApiProperty({ required: false, example: true, description: '¿Está arrastrando materias?' })
  @IsOptional()
  @IsBoolean()
  hasDraggedSubjects?: boolean;

  @ApiProperty({ 
    required: false, 
    example: [1, 2, 3], 
    description: 'IDs de materias arrastradas (CurriculumSubject IDs)' 
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  draggedSubjectIds?: number[];

  @ApiProperty({ 
    required: false,
    example: ['Desarrollo Web', 'IA'], 
    description: 'Intereses académicos' 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  academicInterests?: string[];

  @ApiProperty({ 
    required: false,
    example: 'document',
    enum: TrazioGoal,
    description: 'Objetivo en TRAZIO' 
  })
  @IsOptional()
  @IsEnum(TrazioGoal)
  trazioGoal?: TrazioGoal;

  @ApiProperty({ required: false, description: 'Biografía (opcional)' })
  @IsOptional()
  @IsString()
  bio?: string;
}
