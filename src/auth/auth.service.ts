import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { UserEntity } from 'src/user/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserDto } from 'src/user/dto/user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
    ) { }

    async validateUser(email: string, pass: string): Promise<UserDto> {
        const user = await this.userRepository.findOne(
            { email },
            { populate: ['role', 'city'] },
        );
        if (!user) throw new UnauthorizedException('Credenciales inválidas: usuario no encontrado');

        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas: contraseña incorrecta');

        const { password, resetToken, resetTokenExpiresAt, ...result } = user;
        return result;
    }


    async login(user: UserDto) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload)
            // user: {
            //     id: user.id,
            //     email: user.email,
            //     name: user.name,
            //     last_name: user.last_name,
            // },
        };
    }
}