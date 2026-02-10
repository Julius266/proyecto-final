import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class TeacherSubjectSelectionDto {
  @ApiProperty({ example: 1, description: 'ID del docente' })
  @IsNotEmpty()
  @IsNumber()
  teacherId: number;

  @ApiProperty({ example: [1, 2, 3], description: 'IDs de las materias que cursa con este docente' })
  @IsArray()
  @IsNumber({}, { each: true })
  subjectIds: number[];
}

export class CompleteStudentProfileDto {
  @ApiProperty({ example: 20, description: 'Edad del estudiante' })
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(100)
  age?: number;

  @ApiProperty({ example: 2005, description: 'Año de nacimiento' })
  @IsOptional()
  @IsNumber()
  @Min(1920)
  @Max(2020)
  birthYear?: number;

  @ApiProperty({ example: 5, description: 'Semestre actual' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(20)
  currentSemester: number;

  @ApiProperty({ example: 'Ingeniería en Sistemas', description: 'Carrera que estudia' })
  @IsNotEmpty()
  @IsString()
  career: string;

  @ApiProperty({ required: false, description: 'Biografía del estudiante' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ 
    type: [TeacherSubjectSelectionDto],
    description: 'Docentes y materias que cursa' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeacherSubjectSelectionDto)
  teachersAndSubjects: TeacherSubjectSelectionDto[];
}
