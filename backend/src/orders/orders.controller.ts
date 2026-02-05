import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
        return this.ordersService.create(req.user.userId, createOrderDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(@Request() req: any, @Query('skip') skip?: string, @Query('take') take?: string) {
        // Admins see all, others only see their own
        let where: Prisma.OrderWhereInput = {};

        if (req.user.role === 'ADMIN') {
            where = {};
        } else if (req.user.role === 'FARMER') {
            // Farmers see orders that contain at least one of their products
            where = {
                items: {
                    some: {
                        product: {
                            ownerId: req.user.userId
                        }
                    }
                }
            };
        } else {
            // Buyers see their own orders
            where = { buyerId: req.user.userId };
        }

        return this.ordersService.findAll({
            skip: skip ? parseInt(skip) : undefined,
            take: take ? parseInt(take) : undefined,
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('stats')
    async getStats(@Request() req: any) {
        if (req.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        return this.ordersService.getStats();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req: any) {
        const order = await this.ordersService.findOne(id);
        if (!order) return null;

        // Security: Only admin or the buyer/seller of the items can see it
        if (req.user.role !== 'ADMIN' && order.buyerId !== req.user.userId) {
            // Logic for farmers who own products in the order could be added here
            throw new Error('Unauthorized');
        }

        return order;
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: Prisma.OrderUpdateInput, @Request() req: any) {
        // Admins can update everything
        if (req.user.role === 'ADMIN') {
            return this.ordersService.update(id, data);
        }

        // Farmers can update status if they own products in the order
        if (req.user.role === 'FARMER') {
            const order = await this.ordersService.findOne(id);
            if (!order) throw new Error('Order not found');

            const ownsProduct = order.items.some(item => item.product.ownerId === req.user.userId);
            if (!ownsProduct) throw new Error('Unauthorized');

            // Farmers are only allowed to update the status
            return this.ordersService.update(id, {
                status: data.status
            });
        }

        throw new Error('Unauthorized');
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/approve')
    async approve(@Param('id') id: string, @Request() req: any) {
        if (req.user.role !== 'FARMER' && req.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        return this.ordersService.approveOrder(id, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/ship')
    async ship(@Param('id') id: string, @Request() req: any) {
        if (req.user.role !== 'FARMER' && req.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        return this.ordersService.shipOrder(id, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/pay')
    async pay(@Param('id') id: string, @Request() req: any) {
        return this.ordersService.payOrder(id, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/confirm')
    async confirm(@Param('id') id: string, @Request() req: any) {
        return this.ordersService.confirmDelivery(id, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req: any) {
        if (req.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        return this.ordersService.delete(id);
    }
}
