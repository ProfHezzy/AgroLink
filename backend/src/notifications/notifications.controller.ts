import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) { }

    @Get()
    async findAll(@Request() req: any, @Query('all') all?: string) {
        // Admins can request "all" notifications, otherwise only personal ones
        if (req.user.role === 'ADMIN' && all === 'true') {
            return this.notificationsService.findAll();
        }
        return this.notificationsService.findAll({ userId: req.user.userId });
    }

    @Post('broadcast')
    async broadcast(@Body() data: { title: string; message: string }, @Request() req: any) {
        if (req.user.role !== 'ADMIN') throw new Error('Unauthorized');
        return this.notificationsService.broadcast(data.title, data.message);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req: any) {
        // Security: Only admin can delete arbitrary notifications
        if (req.user.role !== 'ADMIN') throw new Error('Unauthorized');
        return this.notificationsService.delete(id);
    }
}
