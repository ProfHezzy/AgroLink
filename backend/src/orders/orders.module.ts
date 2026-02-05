import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WalletsModule } from '../wallets/wallets.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, WalletsModule, NotificationsModule],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService]
})
export class OrdersModule { }
