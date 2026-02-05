import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    /**
     * GET /users
     * Get all users (Admin only)
     */
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(@Request() req: any) {
        // Check if user is admin
        if (req.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        return this.usersService.findAll();
    }

    /**
     * GET /users/stats
     * Get user statistics (Admin only)
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('stats')
    async getStats(@Request() req: any) {
        if (req.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        return this.usersService.getStats();
    }

    /**
     * GET /users/:id
     * Get a single user by ID
     */
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    /**
     * PUT /users/:id
     * Update a user (Admin only)
     */
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: Prisma.UserUpdateInput,
        @Request() req: any
    ) {
        // Allow if user is admin OR if user is updating their own profile
        if (req.user.role !== 'ADMIN' && req.user.userId !== id) {
            throw new Error('Unauthorized');
        }
        return this.usersService.update(id, data);
    }

    /**
     * DELETE /users/:id
     * Delete a user (Admin only)
     */
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req: any) {
        if (req.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        return this.usersService.delete(id);
    }

    /**
     * Buyer Specific Endpoints
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('buyer/stats')
    async getBuyerStats(@Request() req: any) {
        return this.usersService.getBuyerStats(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('buyer/favorites')
    async getFavorites(@Request() req: any) {
        return this.usersService.getFavorites(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('buyer/favorites/:farmerId')
    async toggleFavorite(@Param('farmerId') farmerId: string, @Request() req: any) {
        return this.usersService.toggleFavorite(req.user.userId, farmerId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('buyer/cart')
    async getCart(@Request() req: any) {
        return this.usersService.getCart(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('buyer/cart')
    async addToCart(@Body() data: { productId: string, quantity?: number }, @Request() req: any) {
        return this.usersService.addToCart(req.user.userId, data.productId, data.quantity);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('buyer/cart/:id')
    async removeFromCart(@Param('id') id: string, @Request() req: any) {
        return this.usersService.removeFromCart(req.user.userId, id);
    }
}
