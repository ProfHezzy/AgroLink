import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    /**
     * Validate user credentials (email/password)
     * This is typically used by a LocalStrategy, but we can call it directly.
     */
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            // Strip password from result
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    /**
     * Generate JWT token for a user
     */
    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
            }
        };
    }

    /**
     * Register a new user
     */
    async register(data: Prisma.UserCreateInput) {
        // Check if user exists
        const existing = await this.usersService.findByEmail(data.email);
        if (existing) {
            throw new ConflictException('User with this email already exists');
        }

        // Create user (hashing is done in UsersService)
        const newUser = await this.usersService.createUser(data);

        // Login immediately
        return this.login(newUser);
    }

    /**
     * Get full user profile from database
     */
    async getFullProfile(userId: string) {
        return this.usersService.findOne(userId);
    }
}
