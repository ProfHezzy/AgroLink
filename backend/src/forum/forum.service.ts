import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ForumService {
    constructor(private prisma: PrismaService) { }

    async findAllThreads(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.ForumThreadWhereInput;
        orderBy?: Prisma.ForumThreadOrderByWithRelationInput;
    }) {
        const { skip, take, where, orderBy } = params || {};
        return this.prisma.forumThread.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                author: {
                    select: {
                        fullName: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
        });
    }

    async findOneThread(id: string) {
        return this.prisma.forumThread.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        fullName: true,
                        avatar: true,
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                fullName: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }

    async deleteThread(id: string) {
        // Delete comments first or rely on cascade if configured (Prisma needs explicit delete usually if not specified in schema)
        await this.prisma.comment.deleteMany({ where: { threadId: id } });
        return this.prisma.forumThread.delete({ where: { id } });
    }

    async deleteComment(id: string) {
        return this.prisma.comment.delete({ where: { id } });
    }

    async getModerationStats() {
        const threadCount = await this.prisma.forumThread.count();
        const commentCount = await this.prisma.comment.count();
        return {
            totalThreads: threadCount,
            totalComments: commentCount,
        };
    }
}
