import { Logger, Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { UserEntity } from 'src/user/user.entity';
import { InjectRepository, logger } from '@mikro-orm/nestjs';
import { UserDto } from 'src/user/dto/user.dto';
import { UserProfileResponseDto } from './dto/userProfile-response.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { RoleEntity } from 'src/roles/role.entity';
import { CityEntity } from 'src/locations/city.entity';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
        private readonly userService: UserService,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: EntityRepository<RoleEntity>,
        @InjectRepository(CityEntity)
        private readonly cityRepository: EntityRepository<CityEntity>,
    ) { }

    async create(dto: CreateUserDto): Promise<UserEntity> {        
        return this.userService.create({
            ...dto
        });
    }

    async findUserByEmail(email: string) {
        const users = await this.userService.find({ email });
        return users[0];
    }

    async validateUser(email: string, pass: string): Promise<UserDto> {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas: usuario no encontrado');
        }

        const passwordValid = await bcrypt.compare(pass, user.password);
        this.logger.debug('Contraseña ingresada:', pass);
        this.logger.debug('Hash guardado en BD:', user.password);
        this.logger.debug('Comparación bcrypt:', await bcrypt.compare(pass, user.password));

        if (email === user.email && passwordValid) {
            const { password, resetToken, resetTokenExpiresAt, ...result } = user;
            return result as UserDto;
        } else {
            throw new UnauthorizedException('Credenciales inválidas: contraseña incorrecta');
        }
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