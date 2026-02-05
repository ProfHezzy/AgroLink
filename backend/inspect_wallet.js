const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const buyerEmail = 'buyer1@example.com'; // Adjust based on user's actual buyer
    const user = await prisma.user.findFirst({
        where: { email: { contains: 'buyer' } },
        include: { wallet: { include: { transactions: true } } }
    });

    if (!user) {
        console.log("No buyer found with that email pattern.");
        return;
    }

    console.log(`User: ${user.fullName} (${user.email})`);
    console.log(`Wallet Balance: $${user.wallet.balance}`);
    console.log(`Wallet Escrow: $${user.wallet.escrowBalance}`);
    console.log("\nTransactions:");
    user.wallet.transactions.forEach(tx => {
        console.log(`- [${tx.createdAt.toISOString()}] ${tx.type}: $${tx.amount} (${tx.status}) Ref: ${tx.reference}`);
    });

    const orders = await prisma.order.findMany({
        where: { buyerId: user.id },
        include: { items: true }
    });

    console.log("\nOrders:");
    orders.forEach(o => {
        console.log(`- Order ${o.id}: Total $${o.total}, Status ${o.status}, Payment ${o.paymentStatus}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
