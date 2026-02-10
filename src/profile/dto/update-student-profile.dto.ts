import { IsOptional, IsNumber, IsString, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class TeacherSubjectUpdateDto {
  @ApiProperty({ example: 1, description: 'ID del docente' })
  @IsNumber()
  teacherId: number;

  @ApiProperty({ example: [1, 2], description: 'IDs de las materias' })
  @IsArray()
  @IsNumber({}, { each: true })
  subjectIds: number[];
}

export class UpdateStudentProfileDto {
  @ApiProperty({ required: false, example: 21, description: 'Edad del estudiante' })
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(100)
  age?: number;

  @ApiProperty({ required: false, example: 2005, description: 'Año de nacimiento' })
  @IsOptional()
  @IsNumber()
  @Min(1920)
  @Max(2020)
  birthYear?: number;

  @ApiProperty({ required: false, example: 6, description: 'Semestre actual' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  currentSemester?: number;

  @ApiProperty({ required: false, example: 'Ingeniería en Sistemas', description: 'Carrera' })
  @IsOptional()
  @IsString()
  career?: string;

  @ApiProperty({ required: false, description: 'Biografía' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ 
    required: false,
    type: [TeacherSubjectUpdateDto],
    description: 'Actualizar docentes y materias' 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeacherSubjectUpdateDto)
  teachersAndSubjects?: TeacherSubjectUpdateDto[];
}
