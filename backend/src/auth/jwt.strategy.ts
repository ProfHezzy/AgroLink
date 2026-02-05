import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'super-secret-key-change-this',
        });
    }

    async validate(payload: any) {
        // Verify user still exists in database
        const user = await this.usersService.findOne(payload.sub);
        if (!user) {
            return null; // Will trigger 401 Unauthorized
        }
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}
