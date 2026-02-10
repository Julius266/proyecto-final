import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @ApiProperty({ example: 1, description: 'ID de la publicación' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  postId: number;

  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 'Muy buen consejo, gracias por compartir' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
