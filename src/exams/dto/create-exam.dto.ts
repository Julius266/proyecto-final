import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({ example: 1, description: 'ID de la materia' })
  @IsNotEmpty()
  @IsNumber()
  subjectId: number;

  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ example: '2026-02-15', description: 'Fecha del examen' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Examen parcial de programación', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
