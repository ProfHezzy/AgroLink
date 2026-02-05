import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all products with optional filtering
     * @param params - Query parameters for filtering
     * @returns Array of products
     */
    async findAll(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.ProductWhereInput;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
    }): Promise<Product[]> {
        const { skip, take, where, orderBy } = params || {};

        return this.prisma.product.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        location: true,
                        avatar: true,
                    },
                },
            },
        });
    }

    /**
     * Get a single product by ID
     * @param id - Product UUID
     * @returns Product or null
     */
    async findOne(id: string): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        location: true,
                        avatar: true,
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });
    }

    /**
     * Create a new product
     * @param data - Product creation data
     * @returns Newly created product
     */
    async create(data: Prisma.ProductCreateInput): Promise<Product> {
        return this.prisma.product.create({
            data,
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        location: true,
                    },
                },
            },
        });
    }

    /**
     * Update an existing product
     * @param id - Product UUID
     * @param data - Update data
     * @returns Updated product
     */
    async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    /**
     * Delete a product
     * @param id - Product UUID
     * @returns Deleted product
     */
    async delete(id: string): Promise<Product> {
        return this.prisma.product.delete({
            where: { id },
        });
    }

    /**
     * Search products by name or category
     * @param query - Search query string
     * @returns Matching products
     */
    async search(query: string): Promise<Product[]> {
        return this.prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { category: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        location: true,
                    },
                },
            },
        });
    }

    /**
     * Get statistics for a specific farmer
     * @param farmerId - Farmer (User) ID
     */
    async getFarmerStats(farmerId: string) {
        const totalProducts = await this.prisma.product.count({
            where: { ownerId: farmerId }
        });

        const activeProducts = await this.prisma.product.count({
            where: { ownerId: farmerId, quantity: { gt: 0 } }
        });

        const orders = await this.prisma.order.findMany({
            where: {
                items: {
                    some: {
                        product: { ownerId: farmerId }
                    }
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        let totalEarnings = 0;
        let totalOrders = orders.length;
        let pendingOrders = orders.filter(o => o.status === 'PENDING').length;

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.product.ownerId === farmerId) {
                    totalEarnings += Number(item.price) * item.quantity;
                }
            });
        });

        const reviews = await this.prisma.review.aggregate({
            where: { product: { ownerId: farmerId } },
            _avg: { rating: true },
            _count: true
        });

        return {
            totalProducts,
            activeProducts,
            totalOrders,
            totalEarnings,
            pendingOrders,
            avgRating: reviews._avg.rating || 0,
            reviewCount: reviews._count || 0
        };
    }
}
