import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Order } from '@prisma/client';
import { WalletsService } from '../wallets/wallets.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private walletsService: WalletsService,
        private notificationsService: NotificationsService
    ) { }

    async create(userId: string, data: any) {
        const { items, total } = data;
        const wallet = await this.walletsService.getOrCreateWallet(userId);
        const canPay = wallet.balance.toNumber() >= total;

        // Use a transaction to ensure all or nothing
        return this.prisma.$transaction(async (tx) => {
            // 1. Create the Order
            const order = await tx.order.create({
                data: {
                    buyerId: userId,
                    total: total,
                    status: 'PENDING',
                    paymentStatus: canPay ? 'PAID_HELD' : 'UNPAID',
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });

            // 2. Clear the cart for this user
            await tx.cartItem.deleteMany({
                where: { userId },
            });

            // 3. Move funds to escrow if paid
            if (canPay) {
                await this.walletsService.holdEscrow(userId, total, order.id);
            }

            return order;
        });
    }

    async payOrder(orderId: string, userId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order || order.buyerId !== userId) {
            throw new Error('Order not found or unauthorized');
        }

        if (order.paymentStatus !== 'UNPAID') {
            throw new Error('Order is already paid or in process');
        }

        // Move funds to escrow
        await this.walletsService.holdEscrow(userId, order.total.toNumber(), order.id);

        // Update Order Payment Status
        return this.prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'PAID_HELD' }
        });
    }

    async approveOrder(orderId: string, farmerId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } }
        });

        if (!order) throw new Error('Order not found');
        const ownsSomeItems = order.items.some(item => item.product.ownerId === farmerId);
        if (!ownsSomeItems) throw new Error('Unauthorized');

        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'APPROVED' }
        });

        // Notify Buyer
        await this.notificationsService.create({
            userId: order.buyerId,
            title: 'Order Approved',
            message: `Your order #${orderId.slice(-6)} has been approved and is being prepared.`
        });

        return updatedOrder;
    }

    async shipOrder(orderId: string, farmerId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } }
        });

        if (!order) throw new Error('Order not found');
        const ownsSomeItems = order.items.some(item => item.product.ownerId === farmerId);
        if (!ownsSomeItems) throw new Error('Unauthorized');

        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'SHIPPED' }
        });

        // Notify Buyer
        await this.notificationsService.create({
            userId: order.buyerId,
            title: 'Order Shipped',
            message: `Your order #${orderId.slice(-6)} has been shipped! You can track it now.`
        });

        return updatedOrder;
    }

    async confirmDelivery(orderId: string, userId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } }
        });

        if (!order || order.buyerId !== userId) {
            throw new Error('Unauthorized or order not found');
        }

        if (order.status !== 'SHIPPED') {
            throw new Error('Order must be in SHIPPED status to confirm delivery');
        }

        // 1. Release funds from escrow
        await this.walletsService.releaseEscrow(orderId);

        // 2. Update status to DELIVERED
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'DELIVERED' }
        });

        // Notify Farmers
        const farmerIds = Array.from(new Set(order.items.map(i => i.product.ownerId)));
        for (const fId of farmerIds) {
            await this.notificationsService.create({
                userId: fId,
                title: 'Payment Released',
                message: `Funds for order #${orderId.slice(-6)} have been released to your wallet.`
            });
        }

        return updatedOrder;
    }

    async findAll(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.OrderWhereInput;
        orderBy?: Prisma.OrderOrderByWithRelationInput;
    }) {
        const { skip, take, where, orderBy } = params || {};
        return this.prisma.order.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                buyer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.order.findUnique({
            where: { id },
            include: {
                buyer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            include: {
                                owner: {
                                    select: {
                                        fullName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async update(id: string, data: Prisma.OrderUpdateInput) {
        return this.prisma.order.update({
            where: { id },
            data,
            include: {
                buyer: true,
            },
        });
    }

    async delete(id: string) {
        return this.prisma.order.delete({
            where: { id },
        });
    }

    async getStats() {
        const totalOrders = await this.prisma.order.count();
        const revenue = await this.prisma.order.aggregate({
            _sum: {
                total: true,
            },
        });

        const ordersByStatus = await this.prisma.order.groupBy({
            by: ['status'],
            _count: true,
        });

        return {
            totalOrders,
            totalRevenue: revenue._sum.total || 0,
            ordersByStatus: ordersByStatus.reduce((acc, item) => {
                acc[item.status] = item._count;
                return acc;
            }, {} as Record<string, number>),
        };
    }
}
