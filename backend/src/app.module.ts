import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ForumModule } from './forum/forum.module';
import { ResearchModule } from './research/research.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProductsModule,
    AuthModule,
    OrdersModule,
    ForumModule,
    ResearchModule,
    NotificationsModule,
    WalletsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
