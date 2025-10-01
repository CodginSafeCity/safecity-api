import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { UserEntity } from 'src/user/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserDto } from 'src/user/dto/user.dto';
import { UserProfileResponseDto } from './dto/userProfile-response.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { RoleEntity } from 'src/roles/role.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
        private readonly userService: UserService,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: EntityRepository<RoleEntity>,
    ) { }

    async registerWithCitizenRole(registerDto: RegisterDto) {
        let role = await this.roleRepository.findOne({ name: 'citizen' });

        if (!role) {
            role = await this.roleRepository.findOne({ name: 'user' });
        }

        if (!role) {
            throw new InternalServerErrorException('No se encontró ni rol "citizen" ni "user"');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        return this.userService.create({
            ...registerDto,
            password: hashedPassword,
            roleId: role.id,
        });
    }

    async findUserByEmail(email: string) {
        const users = await this.userService.find({ email });
        return users[0];
    }

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
        const payload = {
            sub: user.id,
            email: user.email,
            nombre: user.name || 'Sin nombre',
        };
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