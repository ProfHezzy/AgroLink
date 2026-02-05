import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('wallets')
@UseGuards(AuthGuard('jwt'))
export class WalletsController {
    constructor(private readonly walletsService: WalletsService) { }

    @Get('my-wallet')
    async getMyWallet(@Request() req: any) {
        return this.walletsService.getOrCreateWallet(req.user.userId);
    }

    @Post('deposit')
    async deposit(@Request() req: any, @Body() body: { amount: number; reference?: string }) {
        return this.walletsService.deposit(req.user.userId, body.amount, body.reference);
    }

    @Post('cards')
    async addCard(@Request() req: any, @Body() body: any) {
        return this.walletsService.addCard(req.user.userId, body);
    }

    @Post('payout-methods')
    async addPayoutMethod(@Request() req: any, @Body() body: any) {
        return this.walletsService.addPayoutMethod(req.user.userId, body);
    }

    @Post('withdraw')
    async withdraw(@Request() req: any, @Body() body: { amount: number; payoutMethodId: string }) {
        return this.walletsService.withdraw(req.user.userId, body.amount, body.payoutMethodId);
    }

    @Post('verify-paystack/:reference')
    async verifyPaystack(@Request() req: any, @Param('reference') reference: string) {
        return this.walletsService.verifyPaystackTransaction(req.user.userId, reference);
    }
}
