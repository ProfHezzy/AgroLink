import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport'; // standard passports logic

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() body: Prisma.UserCreateInput) {
        return this.authService.register(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile(@Request() req: any) {
        // req.user only contains payload data (id, email, role)
        // We want the full database record
        const user = await this.authService.getFullProfile(req.user.userId);
        return user;
    }
}
