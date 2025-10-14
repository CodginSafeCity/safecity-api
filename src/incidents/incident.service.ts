import { InjectRepository } from '@mikro-orm/nestjs';
import type { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import {
    Logger,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { HandleError } from 'src/common/decorators/handle-error.decorator';
import { IncidentEntity } from './incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { UserEntity } from 'src/user/user.entity';
import { IncidentCategoryEntity } from 'src/incident-categories/incident-category.entity';
import { AvailabilityZoneEntity } from 'src/availability-zones/availability-zone.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';
import { ControlEntityUser } from 'src/control-entity-user/control-entity-user.entity';
import { IncidentQueryFilterDto } from './dto/incident-find-options.dto';
import { CityEntity } from 'src/locations/city.entity';
import { wrap } from '@mikro-orm/core';
import { MailerService } from 'src/mailer/mailer.service';
import { MinioService } from 'src/minio/minio.service';
import { minioClient } from 'src/minio/minio.client';
import { v4 as uuid } from 'uuid';

@Injectable()
export class IncidentService {
    private readonly logger = new Logger(IncidentService.name)
    constructor(
        @InjectRepository(IncidentEntity)
        private readonly incidentRepository: EntityRepository<IncidentEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
        @InjectRepository(IncidentCategoryEntity)
        private readonly categoryRepository: EntityRepository<IncidentCategoryEntity>,
        @InjectRepository(CityEntity)
        private readonly cityRepository: EntityRepository<CityEntity>,
        @InjectRepository(AvailabilityZoneEntity)
        private readonly availabilityzoneRepository: EntityRepository<AvailabilityZoneEntity>,
        @InjectRepository(ControlEntity)
        private readonly controlEntityRepo: EntityRepository<ControlEntity>,
        @InjectRepository(ControlEntityUser)
        private readonly controlEntityUserRepo: EntityRepository<ControlEntityUser>,
        private readonly mailerService: MailerService,
        private readonly minioService: MinioService,
    ) { }

    @HandleError('Error creating incident', {
        errorException: InternalServerErrorException,
    })
    async create(dto: CreateIncidentDto): Promise<IncidentEntity> {
        const [user, category, city] = await Promise.all([
            this.userRepository.findOneOrFail({ id: dto.userId }),
            this.categoryRepository.findOneOrFail({ id: dto.categoryId }),
            this.cityRepository.findOneOrFail({ id: dto.cityId }),
        ]);

        const incident = new IncidentEntity();
        wrap(incident).assign({
            user,
            category,
            city,
            description: dto.description,
            reported_at: dto.reported_at,
            verified_at: dto.verified_at,
            location: dto.location,
        });

        const zone = await this.findZoneByLocation(dto.location);
        if (!zone) {
            throw new NotFoundException('No availability zone found for this location');
        }

        const controlEntity = await this.controlEntityRepo.findOne({ availabilityZones: zone.id });
        if (!controlEntity) {
            throw new NotFoundException('No control entity associated with this zone');
        }

        const controlUsers = await this.controlEntityUserRepo.find(
            { controlEntity },
            { populate: ['user'] },
        );

        if (controlUsers.length === 0) {
            throw new NotFoundException('No users associated with this control entity');
        }

        incident.assigned_to = controlUsers[0].user;

        await this.incidentRepository.getEntityManager().persistAndFlush(incident);

        (incident as any).zone = zone;
        (incident as any).controlEntity = controlEntity;

        void this.mailerService
            .sendMail(
                user.email,
                `Tu incidente #${incident.id} ha sido registrado`,
                this.buildIncidentEmailTemplate(incident),
            )
            .catch(err => {
                this.logger.error(`Error enviando correo de confirmación al usuario ${user.email}: ${err.message}`);
            });
        return incident;
    }

    async find(query: IncidentQueryFilterDto) {
        const filter: FilterQuery<IncidentEntity> = {};

        if (query.filter?.description) {
            filter.description = { $like: `%${query.filter.description}%` };
        }

        const [result, total] = await this.incidentRepository.findAndCount(filter, {
            limit: query.pagination?.limit ?? 10,
            offset: query.pagination?.offset ?? 0,
        });

        return { data: result, total };
    }

    async findById(id: string) {
        const incident = await this.incidentRepository.findOne({ id });
        if (!incident) throw new NotFoundException(`Incident with id ${id} not found`);
        return incident;
    }

    @HandleError('Error updating incident', { throwError: true })
    async update(id: string, dto: UpdateIncidentDto): Promise<IncidentEntity> {
        return this.incidentRepository.getEntityManager().transactional(async () => {
            const incident = await this.findById(id);

            if (dto.userId) {
                incident.user = await this.userRepository.findOneOrFail({ id: dto.userId });
            }
            if (dto.categoryId) {
                incident.category = await this.categoryRepository.findOneOrFail({ id: dto.categoryId });
            }
            if (dto.cityId) {
                incident.city = await this.cityRepository.findOneOrFail({ id: dto.cityId });
            }

            this.incidentRepository.assign(incident, {
                description: dto.description ?? incident.description,
                reported_at: dto.reported_at ?? incident.reported_at,
                verified_at: dto.verified_at ?? incident.verified_at,
                location: dto.location ?? incident.location,
            });

            await this.incidentRepository.getEntityManager().persistAndFlush(incident);
            return incident;
        });
    }

    @HandleError('Error deleting incident', { throwError: true })
    async delete(id: string): Promise<IncidentEntity> {
        const incident = await this.findById(id);
        await this.incidentRepository.getEntityManager().removeAndFlush(incident);
        return incident;
    }

    async findByUser(userId: string): Promise<IncidentEntity[]> {
        const incidents = await this.incidentRepository.find(
            { user: userId },
            { populate: ['user', 'category', 'city'] },
        );
        if (!incidents.length) {
            throw new NotFoundException(`No incidents found for user with id ${userId}`);
        }
        return incidents;
    }

    private async findZoneByLocation(location: any) {
        const em = this.availabilityzoneRepository.getEntityManager();
        const qb = em.createQueryBuilder(AvailabilityZoneEntity, 'z');

        const point = JSON.stringify(location);

        return await qb
            .where('ST_Contains(z.area, ST_SetSRID(ST_GeomFromGeoJSON(?), 4326))', [point])
            .limit(1)
            .getSingleResult();
    }

    private buildIncidentEmailTemplate(incident: IncidentEntity): string {
        const assignedUser = incident.assigned_to
            ? `${incident.assigned_to.name} (${incident.assigned_to.email})`
            : 'Sin asignar';
        const controlEntity = (incident as any).controlEntity?.name ?? 'No especificada';
        const zone = (incident as any).zone?.name ?? 'No especificada';

        return `
            <div style="font-family: Arial, sans-serif; background-color: #f7f9fc; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="color: #007bff; margin-top: 0;">📢 Tu incidente ha sido registrado con éxito</h2>
                    <p>Hola <strong>${incident.user?.name ?? ''}</strong>,</p>
                    <p>Hemos recibido tu reporte y ha sido creado exitosamente con la siguiente información:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>ID del Incidente:</strong></td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${incident.id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Categoría:</strong></td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${incident.category?.name ?? ''}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Ciudad:</strong></td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${incident.city?.name ?? ''}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Zona:</strong></td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${zone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Entidad de control:</strong></td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${controlEntity}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Asignado a:</strong></td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${assignedUser}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Descripción:</strong></td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${incident.description}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Fecha reportada:</strong></td>
                            <td style="padding: 8px;">${incident.reported_at}</td>
                        </tr>
                    </table>

                    <p style="margin-top: 20px;">Un agente ha sido asignado a tu caso. Nos pondremos en contacto contigo si es necesario.</p>
                    <p style="margin-top: 20px;">Gracias por usar <strong>SafeCity</strong>.</p>
                </div>
            </div>
        `;
    }

    async uploadFile(incidentId: string, file: Express.Multer.File): Promise<IncidentEntity> {
        const fileUrl = await this.minioService.uploadFile(file);

        const incident = await this.findById(incidentId);
        incident.fileUrl = fileUrl;

        await this.incidentRepository.getEntityManager().persistAndFlush(incident);
        return incident;
    }
}
