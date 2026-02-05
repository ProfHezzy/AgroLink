import { Controller, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ResearchService } from './research.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('research')
export class ResearchController {
    constructor(private researchService: ResearchService) { }

    @Get()
    async findAll() {
        return this.researchService.findAll({
            orderBy: { createdAt: 'desc' },
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('stats')
    async getStats(@Request() req: any) {
        if (req.user.role !== 'ADMIN') throw new Error('Unauthorized');
        return this.researchService.getStats();
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req: any) {
        if (req.user.role !== 'ADMIN') throw new Error('Unauthorized');
        return this.researchService.delete(id);
    }
}
