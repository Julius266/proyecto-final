import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 1, description: 'ID de la publicación' })
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 'Muy buen consejo, gracias por compartir' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
