import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { userId: string; title: string; message: string }) {
        return this.prisma.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
            },
        });
    }

    async findAll(params?: {
        userId?: string;
        skip?: number;
        take?: number;
    }) {
        return this.prisma.notification.findMany({
            where: params?.userId ? { userId: params.userId } : {},
            skip: params?.skip,
            take: params?.take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
    }

    async broadcast(title: string, message: string) {
        const users = await this.prisma.user.findMany({ select: { id: true } });
        const notifications = users.map(user => ({
            userId: user.id,
            title,
            message,
        }));
        return this.prisma.notification.createMany({
            data: notifications,
        });
    }

    async delete(id: string) {
        return this.prisma.notification.delete({ where: { id } });
    }
}
