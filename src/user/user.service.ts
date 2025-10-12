import { InjectRepository } from '@mikro-orm/nestjs';
import type { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { HandleError } from 'src/common/decorators/handle-error.decorator';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RoleEntity } from 'src/roles/role.entity';
import { CityEntity } from 'src/locations/city.entity';
import * as bcrypt from 'bcrypt';
import { wrap } from '@mikro-orm/core';
import { randomBytes } from 'crypto';
import { addHours, isAfter } from 'date-fns';
import { MailerService } from 'src/mailer/mailer.service';
import { ControlEntityUserService } from 'src/control-entity-user/control-entity-user.service';
import { CreateControlEntityUserDto } from 'src/control-entities/dto/create-control-entity-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: EntityRepository<RoleEntity>,
        @InjectRepository(CityEntity)
        private readonly cityRepository: EntityRepository<CityEntity>,
        private readonly mailerService: MailerService,
        private readonly controlEntityUserService: ControlEntityUserService
    ) { }

    @HandleError('Error creating user', {
        errorException: InternalServerErrorException,
    })
    async create(dto: CreateUserDto): Promise<UserEntity> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const role = await this.roleRepository.findOneOrFail({ id: dto.roleId });

        const city = dto.cityId
            ? await this.cityRepository.findOneOrFail({ id: dto.cityId })
            : null;

        const user = new UserEntity();
        wrap(user).assign({
            name: dto.name,
            last_name: dto.last_name,
            email: dto.email,
            password: hashedPassword,
            avatar: dto.avatar,
            role,
            city,
        });

        await this.userRepository.getEntityManager().persistAndFlush(user);
        return user;
    }

    @HandleError('Error creating user', {
        errorException: InternalServerErrorException,
    })
    async createVerifier(dto: CreateControlEntityUserDto): Promise<UserEntity> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const role = await this.roleRepository.findOneOrFail({ id: dto.roleId });

        const city = dto.cityId
            ? await this.cityRepository.findOneOrFail({ id: dto.cityId })
            : null;

        const user = new UserEntity();
        wrap(user).assign({
            name: dto.name,
            last_name: dto.last_name,
            email: dto.email,
            password: hashedPassword,
            avatar: dto.avatar,
            role,
            city,
        });

        await this.userRepository.getEntityManager().persistAndFlush(user);
        await this.controlEntityUserService.assignUserToControlEntity(user.id, dto.controlEntityId)
        return user;
    }

    @HandleError('Error retrieving users', {
        errorException: InternalServerErrorException,
    })
    async find(filter: FilterQuery<UserEntity> = {}): Promise<UserEntity[]> {
        return this.userRepository.find(filter, { populate: ['role', 'city'] });
    }

    @HandleError('Error retrieving user by id', { throwError: true })
    async findById(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne(
            { id },
            { populate: ['role', 'city'] },
        );
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    @HandleError('Error updating user', { throwError: true })
    async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
        return this.userRepository.getEntityManager().transactional(async () => {
            const user = await this.findById(id);

            // si viene password, encriptar de nuevo
            if (dto.password) {
                dto.password = await bcrypt.hash(dto.password, 10);
            }

            // si viene roleId, buscar entidad
            if (dto.roleId) {
                user.role = await this.roleRepository.findOneOrFail({ id: dto.roleId });
            }

            // si viene cityId, buscar entidad
            if (dto.cityId) {
                user.city = await this.cityRepository.findOneOrFail({ id: dto.cityId });
            }

            this.userRepository.assign(user, {
                name: dto.name ?? user.name,
                last_name: dto.last_name ?? user.last_name,
                email: dto.email ?? user.email,
                password: dto.password ?? user.password,
                avatar: dto.avatar ?? user.avatar,
            });

            await this.userRepository.getEntityManager().persistAndFlush(user);
            return user;
        });
    }

    @HandleError('Error deleting user', { throwError: true })
    async delete(id: string): Promise<UserEntity> {
        const user = await this.findById(id);
        await this.userRepository.getEntityManager().removeAndFlush(user);
        return user;
    }

    async generateResetToken(email: string): Promise<string> {
        const user = await this.userRepository.findOne({ email });
        if (!user) throw new NotFoundException('User not found');

        const token = randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiresAt = addHours(new Date(), 1);

        await this.userRepository.getEntityManager().persistAndFlush(user);

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;

        const html = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; padding: 30px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <div style="background-color: #007bff; padding: 20px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 22px;">Recuperación de contraseña</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Hola <strong>${user.name ?? ''}</strong>,</p>
                    <p style="font-size: 15px; color: #555;">
                    Hemos recibido una solicitud para restablecer tu contraseña. Si tú no realizaste esta acción, puedes ignorar este mensaje.
                    </p>
                    <p style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}"
                        style="background-color: #007bff; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                        Restablecer contraseña
                    </a>
                    </p>
                    <p style="font-size: 14px; color: #888;">
                    Este enlace expirará en <strong>1 hora</strong>.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 13px; color: #aaa; text-align: center;">
                    Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
                    </p>
                    <p style="font-size: 13px; color: #007bff; word-break: break-all; text-align: center;">
                    <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
                    </p>
                </div>
                <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    © ${new Date().getFullYear()} SafeCity - Todos los derechos reservados
                </div>
                </div>
            </div>
        `;

        this.mailerService.sendMail(
            user.email,
            'Recuperación de contraseña',
            html,
        );
        return token;
    }

    async resetPassword(email: string, dto: ResetPasswordDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ email });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        if (user.resetToken !== dto.token) {
            throw new BadRequestException('Token inválido');
        }

        if (!user.resetTokenExpiresAt || isAfter(new Date(), user.resetTokenExpiresAt)) {
            throw new BadRequestException('Token expirado');
        }

        user.password = await bcrypt.hash(dto.newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiresAt = undefined;

        await this.userRepository.getEntityManager().persistAndFlush(user);
        return user;
    }
}