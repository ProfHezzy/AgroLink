import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    // Inject PrismaService to interact with the database
    constructor(private prisma: PrismaService) { }

    /**
     * Find a user by their unique ID.
     * @param id - The UUID of the user.
     * @returns The user object or null.
     */
    async findOne(id: string): Promise<User | null> {
        // Uses Prisma's findUnique method to look up user by ID
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    /**
     * Find a user by their email address.
     * @param email - The email to search for.
     * @returns The user object or null.
     */
    async findByEmail(email: string): Promise<User | null> {
        // Uses Prisma's findUnique method to look up by email unique constraint
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Create a new user in the database.
     * Handles password hashing before storage.
     * @param data - The user creation data (Prisma generated input type).
     * @returns The newly created user.
     */
    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        // 1. Hash the password with bcrypt (salt rounds: 10)
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // 2. Overwrite the plain password with the hashed one
        const userData = {
            ...data,
            password: hashedPassword,
        };

        // 3. Create the user using Prisma
        return this.prisma.user.create({
            data: userData,
        });
    }

    /**
     * Setup initial admin user if none exists.
     * Useful for seeding or first-run setup.
     */
    async onModuleInit() {
        // Check if there are any users
        const count = await this.prisma.user.count();
        if (count === 0) {
            // If no users, create default admin
            console.log('Seeding default admin user...');
            await this.createUser({
                email: 'admin@agrolink.com',
                password: 'admin', // Will be hashed
                role: 'ADMIN',
                fullName: 'System Admin'
            });
        }
    }

    /**
     * Get all users with pagination
     * @param params - Query parameters
     * @returns Array of users (without passwords)
     */
    async findAll(params?: {
        skip?: number;
        take?: number;
        where?: any;
    }) {
        const { skip, take, where } = params || {};

        const users = await this.prisma.user.findMany({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                location: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        products: true,
                        orders: true,
                    },
                },
            },
        });

        return users;
    }

    /**
     * Get user statistics for admin dashboard
     * @returns Statistics object
     */
    async getStats() {
        const totalUsers = await this.prisma.user.count();
        const usersByRole = await this.prisma.user.groupBy({
            by: ['role'],
            _count: true,
        });

        // Get users created in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUsers = await this.prisma.user.count({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
        });

        // Get active users (users with recent activity)
        const activeUsers = await this.prisma.user.count({
            where: {
                updatedAt: {
                    gte: thirtyDaysAgo,
                },
            },
        });

        return {
            totalUsers,
            newUsers,
            activeUsers,
            usersByRole: usersByRole.reduce((acc, item) => {
                acc[item.role] = item._count;
                return acc;
            }, {} as Record<string, number>),
        };
    }

    /**
     * Update a user
     * @param id - User ID
     * @param data - Update data
     * @returns Updated user
     */
    async update(id: string, data: Prisma.UserUpdateInput) {
        // If password is being updated, hash it
        if (data.password && typeof data.password === 'string') {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                location: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    /**
     * Delete a user
     * @param id - User ID
     * @returns Deleted user
     */
    async delete(id: string) {
        return this.prisma.user.delete({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
            },
        });
    }

    /**
     * Get statistics for buyer dashboard
     */
    async getBuyerStats(userId: string) {
        const cartItems = await this.prisma.cartItem.count({
            where: { userId }
        });

        const orders = await this.prisma.order.findMany({
            where: { buyerId: userId },
            select: {
                total: true,
                status: true
            }
        });

        const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

        const favoriteSellers = await this.prisma.favorite.count({
            where: { userId }
        });

        return {
            cartItems,
            totalOrders,
            totalSpent,
            favoriteSellers,
            pendingOrders
        };
    }

    /**
     * Cart methods
     */
    async getCart(userId: string) {
        return this.prisma.cartItem.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        owner: {
                            select: {
                                fullName: true,
                                location: true
                            }
                        }
                    }
                }
            }
        });
    }

    async addToCart(userId: string, productId: string, quantity: number = 1) {
        return this.prisma.cartItem.upsert({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            },
            update: {
                quantity: {
                    increment: quantity
                }
            },
            create: {
                userId,
                productId,
                quantity
            }
        });
    }

    async removeFromCart(userId: string, cartItemId: string) {
        return this.prisma.cartItem.delete({
            where: {
                id: cartItemId,
                userId // Security check
            }
        });
    }

    /**
     * Favorites methods
     */
    async getFavorites(userId: string) {
        return this.prisma.favorite.findMany({
            where: { userId },
            include: {
                farmer: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                        location: true,
                        _count: {
                            select: {
                                products: true
                            }
                        }
                    }
                }
            }
        });
    }

    async toggleFavorite(userId: string, farmerId: string) {
        const existing = await this.prisma.favorite.findUnique({
            where: {
                userId_farmerId: {
                    userId,
                    farmerId
                }
            }
        });

        if (existing) {
            return this.prisma.favorite.delete({
                where: { id: existing.id }
            });
        }

        return this.prisma.favorite.create({
            data: {
                userId,
                farmerId
            }
        });
    }
}
