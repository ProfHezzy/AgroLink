import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResearchService {
    constructor(private prisma: PrismaService) { }

    async findAll(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.ResearchPostWhereInput;
        orderBy?: Prisma.ResearchPostOrderByWithRelationInput;
    }) {
        const { skip, take, where, orderBy } = params || {};
        return this.prisma.researchPost.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                author: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
    }

    async getStats() {
        const totalPosts = await this.prisma.researchPost.count();
        return { totalPosts };
    }

    async delete(id: string) {
        return this.prisma.researchPost.delete({ where: { id } });
    }
}
