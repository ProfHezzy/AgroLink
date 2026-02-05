import { Controller, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ForumService } from './forum.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('forum')
export class ForumController {
    constructor(private forumService: ForumService) { }

    @Get('threads')
    async findAllThreads() {
        return this.forumService.findAllThreads({
            orderBy: { createdAt: 'desc' },
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('stats')
    async getStats(@Request() req: any) {
        if (req.user.role !== 'ADMIN') throw new Error('Unauthorized');
        return this.forumService.getModerationStats();
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('threads/:id')
    async deleteThread(@Param('id') id: string, @Request() req: any) {
        if (req.user.role !== 'ADMIN') throw new Error('Unauthorized');
        return this.forumService.deleteThread(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('comments/:id')
    async deleteComment(@Param('id') id: string, @Request() req: any) {
        if (req.user.role !== 'ADMIN') throw new Error('Unauthorized');
        return this.forumService.deleteComment(id);
    }
}
