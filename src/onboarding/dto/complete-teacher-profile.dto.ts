import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SubjectDto {
  @ApiProperty({ example: 'Programación Web', description: 'Nombre de la materia' })
  @IsNotEmpty()
  @IsString()
  subjectName: string;

  @ApiProperty({ required: false, example: 'Curso de desarrollo web full-stack', description: 'Descripción de la materia' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: 'CS301', description: 'Código de la materia' })
  @IsOptional()
  @IsString()
  code?: string;
}

export class CompleteTeacherProfileDto {
  @ApiProperty({ required: false, example: 'Facultad de Ingeniería', description: 'Departamento o facultad' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ required: false, description: 'Biografía del docente' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false, example: 'Edificio A, Oficina 301', description: 'Ubicación de la oficina' })
  @IsOptional()
  @IsString()
  office?: string;

  @ApiProperty({ 
    type: [SubjectDto],
    description: 'Materias que imparte el docente' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  subjects: SubjectDto[];
}
