import { IsNotEmpty, IsString, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeacherVisibility } from '../../students/teacher-profile.entity';

export class CompleteTeacherProfileV2Dto {
  @ApiProperty({ example: [1, 2], description: 'IDs de las mallas en las que dicta clases' })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  curriculumIds: number[];

  @ApiProperty({ 
    example: [1, 5, 12], 
    description: 'IDs de las materias que dicta (CurriculumSubject IDs)' 
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  subjectIds: number[];

  @ApiProperty({ required: false, example: 'profesor@pucemana.edu.ec', description: 'Correo institucional (opcional)' })
  @IsOptional()
  @IsString()
  institutionalEmail?: string;

  @ApiProperty({ required: false, description: 'Descripción profesional (opcional)' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ 
    required: false,
    example: 'all_career',
    enum: TeacherVisibility,
    description: 'Preferencia de visibilidad' 
  })
  @IsOptional()
  @IsEnum(TeacherVisibility)
  visibility?: TeacherVisibility;
}
