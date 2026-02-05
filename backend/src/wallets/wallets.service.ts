import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class WalletsService {
    constructor(private prisma: PrismaService) { }

    async getOrCreateWallet(userId: string) {
        let wallet = await this.prisma.wallet.findUnique({
            where: { userId },
            include: {
                transactions: { orderBy: { createdAt: 'desc' }, take: 10 },
                cards: true,
                payoutMethods: true
            }
        });

        if (!wallet) {
            // Generate unique 10-digit account number
            const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

            wallet = await this.prisma.wallet.create({
                data: {
                    userId,
                    balance: 0,
                    escrowBalance: 0,
                    accountNumber
                },
                include: {
                    transactions: true,
                    cards: true,
                    payoutMethods: true
                }
            });
        }
        return wallet;
    }

    async deposit(userId: string, amount: number, reference?: string) {
        const wallet = await this.getOrCreateWallet(userId);

        return this.prisma.$transaction(async (tx) => {
            const updatedWallet = await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: { increment: amount } }
            });

            await tx.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount,
                    type: TransactionType.DEPOSIT,
                    reference,
                    status: 'COMPLETED'
                }
            });

            return updatedWallet;
        });
    }

    async holdEscrow(buyerId: string, amount: number, orderId: string) {
        const wallet = await this.getOrCreateWallet(buyerId);
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } }
        });

        if (!order) throw new NotFoundException('Order not found');
        if (wallet.balance.lessThan(amount)) {
            throw new BadRequestException('Insufficient balance for escrow hold');
        }

        return this.prisma.$transaction(async (tx) => {
            // 1. Deduct from Buyer balance, add to Buyer escrow
            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: { decrement: amount },
                    escrowBalance: { increment: amount }
                }
            });

            // 2. Increment escrowBalance for all Farmers involved
            const commissionRate = 0.05;
            for (const item of order.items) {
                const itemTotal = item.price.toNumber() * item.quantity;
                const farmerAmount = itemTotal * (1 - commissionRate);

                await tx.wallet.update({
                    where: { userId: item.product.ownerId },
                    data: { escrowBalance: { increment: farmerAmount } }
                });
            }

            await tx.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount: -amount,
                    type: TransactionType.ESCROW_HOLD,
                    reference: orderId,
                    status: 'COMPLETED'
                }
            });

            return { success: true };
        });
    }

    async releaseEscrow(orderId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { product: true } },
                buyer: { include: { wallet: true } }
            }
        });

        if (!order || order.paymentStatus !== 'PAID_HELD') {
            throw new BadRequestException('Order not in escrow or not found');
        }

        // Calculate commission (e.g., 5% fixed for now or dynamic based on Farmer type)
        const total = order.total.toNumber();
        const commissionRate = 0.05; // 5%
        const commissionAmount = total * commissionRate;
        const farmerAmount = total - commissionAmount;

        // Group items by owner to handle multiple farmers in one order? 
        // Currently, Order doesn't track per-item status well for multi-farmer release.
        // For simplicity, let's assume one farmer per order for now or a single major farmer.
        // Actually, let's map items to owners.
        const ownerReleases = new Map<string, number>();
        for (const item of order.items) {
            const ownerId = item.product.ownerId;
            const itemTotal = item.price.toNumber() * item.quantity;
            const itemCommission = itemTotal * commissionRate;
            const itemFarmerAmount = itemTotal - itemCommission;

            ownerReleases.set(ownerId, (ownerReleases.get(ownerId) || 0) + itemFarmerAmount);
        }

        return this.prisma.$transaction(async (tx) => {
            // 1. Deduct from Buyer's escrow balance
            await tx.wallet.update({
                where: { userId: order.buyerId },
                data: { escrowBalance: { decrement: total } }
            });

            // 2. Add to each Farmer's balance and deduct from their escrow
            for (const [ownerId, amount] of ownerReleases.entries()) {
                let farmerWallet = await tx.wallet.findUnique({ where: { userId: ownerId } });
                if (!farmerWallet) {
                    farmerWallet = await tx.wallet.create({ data: { userId: ownerId, balance: 0, escrowBalance: 0 } });
                }

                await tx.wallet.update({
                    where: { id: farmerWallet.id },
                    data: {
                        balance: { increment: amount },
                        escrowBalance: { decrement: amount } // Move from escrow to balance
                    }
                });

                await tx.walletTransaction.create({
                    data: {
                        walletId: farmerWallet.id,
                        amount,
                        type: TransactionType.ESCROW_RELEASE,
                        reference: orderId,
                        status: 'COMPLETED'
                    }
                });
            }

            // 3. Update Order Status
            await tx.order.update({
                where: { id: orderId },
                data: {
                    paymentStatus: 'RELEASED',
                    commission: commissionAmount
                }
            });

            return { success: true };
        });
    }

    async refundEscrow(orderId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { buyer: true }
        });

        if (!order || order.paymentStatus !== 'PAID_HELD') {
            throw new BadRequestException('Order not in escrow or not found');
        }

        return this.prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { userId: order.buyerId },
                data: {
                    escrowBalance: { decrement: order.total },
                    balance: { increment: order.total }
                }
            });

            const buyerWallet = await tx.wallet.findUnique({ where: { userId: order.buyerId } });
            if (!buyerWallet) throw new NotFoundException('Buyer wallet not found');

            await tx.walletTransaction.create({
                data: {
                    walletId: buyerWallet.id,
                    amount: order.total,
                    type: TransactionType.REFUND,
                    reference: orderId,
                    status: 'COMPLETED'
                }
            });

            await tx.order.update({
                where: { id: orderId },
                data: { paymentStatus: 'REFUNDED' }
            });

            return { success: true };
        });
    }

    async addCard(userId: string, data: any) {
        const wallet = await this.getOrCreateWallet(userId);
        return this.prisma.card.create({
            data: {
                walletId: wallet.id,
                brand: data.brand,
                last4: data.last4,
                expiryMonth: data.expiryMonth,
                expiryYear: data.expiryYear,
                holderName: data.holderName
            }
        });
    }

    async addPayoutMethod(userId: string, data: any) {
        const wallet = await this.getOrCreateWallet(userId);

        if (data.isDefault) {
            await this.prisma.payoutMethod.updateMany({
                where: { walletId: wallet.id },
                data: { isDefault: false }
            });
        }

        return this.prisma.payoutMethod.create({
            data: {
                walletId: wallet.id,
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                accountName: data.accountName,
                isDefault: data.isDefault || false
            }
        });
    }

    async withdraw(userId: string, amount: number, payoutMethodId: string) {
        const wallet = await this.getOrCreateWallet(userId);

        if (wallet.balance.lessThan(amount)) {
            throw new BadRequestException('Insufficient balance for withdrawal');
        }

        const payoutMethod = await this.prisma.payoutMethod.findUnique({
            where: { id: payoutMethodId }
        });

        if (!payoutMethod || payoutMethod.walletId !== wallet.id) {
            throw new NotFoundException('Payout method not found');
        }

        return this.prisma.$transaction(async (tx) => {
            const updatedWallet = await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: { decrement: amount } }
            });

            await tx.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount: -amount,
                    type: TransactionType.WITHDRAWAL,
                    reference: `WD-${payoutMethod.bankName.slice(0, 3)}-${Date.now()}`,
                    status: 'COMPLETED'
                }
            });

            return updatedWallet;
        });
    }

    async verifyPaystackTransaction(userId: string, reference: string) {
        try {
            const secretKey = process.env.PAYSTACK_SECRET_KEY;
            const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${secretKey}`
                }
            });
            const data: any = await response.json();

            if (data.status && data.data.status === 'success') {
                const amount = data.data.amount / 100; // Paystack amount is in kobo (or equivalent cent-like unit)

                const existingTx = await this.prisma.walletTransaction.findFirst({
                    where: { reference }
                });

                if (existingTx) {
                    return { success: true, message: 'Transaction already processed' };
                }

                await this.deposit(userId, amount, reference);
                return { success: true, amount };
            }
            throw new BadRequestException('Transaction verification failed');
        } catch (error) {
            console.error('Paystack verification error:', error);
            throw new BadRequestException('Payment verification failed');
        }
    }
}
