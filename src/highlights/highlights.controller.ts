import { Controller, Post, Delete, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { HighlightsService } from './highlights.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('highlights')
@UseGuards(JwtAuthGuard)
export class HighlightsController {
  constructor(private readonly highlightsService: HighlightsService) {}

  @Post()
  async highlight(
    @Body('postId') postId: number,
    @Body('comment') comment: string,
    @Request() req,
  ) {
    return await this.highlightsService.highlightPost(postId, req.user.id, comment);
  }

  @Delete(':postId')
  async removeHighlight(@Param('postId') postId: string, @Request() req) {
    await this.highlightsService.removeHighlight(Number(postId), req.user.id);
    return { message: 'Destacado eliminado' };
  }

  @Get('post/:postId')
  async getPostHighlights(@Param('postId') postId: string) {
    return await this.highlightsService.getPostHighlights(Number(postId));
  }

  @Get('post/:postId/count')
  async countHighlights(@Param('postId') postId: string) {
    return await this.highlightsService.countHighlights(Number(postId));
  }

  @Get('post/:postId/has-highlighted')
  async hasHighlighted(@Param('postId') postId: string, @Request() req) {
    return await this.highlightsService.hasHighlighted(Number(postId), req.user.id);
  }

  @Get('teacher/:teacherId')
  async getTeacherHighlights(@Param('teacherId') teacherId: string) {
    return await this.highlightsService.getTeacherHighlights(Number(teacherId));
  }
}
