import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private users = [
        {
            email: 'hozkar178@gmail.com',
            password: '$2b$10$x.jPJwKdn07upXxRev8rQuFXI1nlqcdIE56Z49xYhNOpXT637Fplq'
        },
    ];

    constructor(private readonly jwtService: JwtService) { }

    async validateUser(email: string, pass: string) {
        const user = this.users.find(u => u.email === email);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas: usuario no encontrado');
        }
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (isPasswordValid) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Credenciales inválidas: contraseña incorrecta');
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}