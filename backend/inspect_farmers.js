const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: { role: 'FARMER' },
        include: { wallet: { include: { transactions: true } } }
    });

    users.forEach(user => {
        console.log(`\nFarmer: ${user.fullName} (${user.email})`);
        console.log(`Wallet Balance: $${user.wallet.balance}`);
        console.log(`Pending Escrow: $${user.wallet.escrowBalance}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
