import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { HashtagsService } from './hashtags.service';

@ApiTags('hashtags')
@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los hashtags' })
  @ApiResponse({ status: 200, description: 'Lista de hashtags' })
  findAll() {
    return this.hashtagsService.findAll();
  }

  @Get('popular')
  @ApiOperation({ summary: 'Obtener hashtags más populares' })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de hashtags a retornar' })
  @ApiResponse({ status: 200, description: 'Lista de hashtags populares' })
  getPopular(@Query('limit') limit?: number) {
    return this.hashtagsService.getPopular(limit);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Buscar hashtag por nombre' })
  @ApiResponse({ status: 200, description: 'Hashtag encontrado' })
  @ApiResponse({ status: 404, description: 'Hashtag no encontrado' })
  findByName(@Param('name') name: string) {
    return this.hashtagsService.findByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un hashtag por ID' })
  @ApiResponse({ status: 200, description: 'Hashtag encontrado' })
  @ApiResponse({ status: 404, description: 'Hashtag no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagsService.findOne(id);
  }
}
