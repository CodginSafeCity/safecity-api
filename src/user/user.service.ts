import { InjectRepository } from '@mikro-orm/nestjs';
import type { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { HandleError } from 'src/common/decorators/handle-error.decorator';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEntity } from 'src/roles/role.entity';
import { CityEntity } from 'src/locations/city.entity';
import * as bcrypt from 'bcrypt';
import { wrap } from '@mikro-orm/core';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: EntityRepository<RoleEntity>,
        @InjectRepository(CityEntity)
        private readonly cityRepository: EntityRepository<CityEntity>,
    ) { }

    @HandleError('Error creating user', {
        errorException: InternalServerErrorException,
    })
    async create(dto: CreateUserDto): Promise<UserEntity> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // buscar rol obligatorio
        const role = await this.roleRepository.findOneOrFail({ id: dto.roleId });

        // buscar ciudad opcional
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
            role,   // ahora sí como objeto
            city,   // objeto o null
        });

        await this.userRepository.getEntityManager().persistAndFlush(user);
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
}
