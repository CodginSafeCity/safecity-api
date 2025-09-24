import { InjectRepository } from '@mikro-orm/nestjs';
import type { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HandleError } from 'src/common/decorators/handle-error.decorator';
import { IncidentCategoryEntity } from './incident-category.entity';
import { CreateIncidentCategoryDto } from './dto/create-incident-category.dto';
import { UpdateIncidentCategoryDto } from './dto/update-incident-category.dto';
import { wrap } from '@mikro-orm/core';

@Injectable()
export class IncidentCategoryService {
  constructor(
    @InjectRepository(IncidentCategoryEntity)
    private readonly incidentCategoryRepository: EntityRepository<IncidentCategoryEntity>,
  ) {}

  @HandleError('Error creating incident category', {
    errorException: InternalServerErrorException,
  })
  async create(dto: CreateIncidentCategoryDto): Promise<IncidentCategoryEntity> {
    const category = new IncidentCategoryEntity();
    wrap(category).assign({
      name: dto.name,
      description: dto.description,
      icon: dto.icon,
    });

    await this.incidentCategoryRepository.getEntityManager().persistAndFlush(category);
    return category;
  }

  @HandleError('Error retrieving incident categories', {
    errorException: InternalServerErrorException,
  })
  async find(
    filter: FilterQuery<IncidentCategoryEntity> = {},
  ): Promise<IncidentCategoryEntity[]> {
    return this.incidentCategoryRepository.find(filter);
  }

  @HandleError('Error retrieving incident category by id', { throwError: true })
  async findById(id: string): Promise<IncidentCategoryEntity> {
    const category = await this.incidentCategoryRepository.findOne({ id });
    if (!category)
      throw new NotFoundException(`Incident category with id ${id} not found`);
    return category;
  }

  @HandleError('Error updating incident category', { throwError: true })
  async update(
    id: string,
    dto: UpdateIncidentCategoryDto,
  ): Promise<IncidentCategoryEntity> {
    return this.incidentCategoryRepository
      .getEntityManager()
      .transactional(async () => {
        const category = await this.findById(id);

        this.incidentCategoryRepository.assign(
          category,
          UpdateIncidentCategoryDto.toEntity(dto, category),
        );

        await this.incidentCategoryRepository.getEntityManager().persistAndFlush(category);
        return category;
      });
  }

  @HandleError('Error deleting incident category', { throwError: true })
  async delete(id: string): Promise<IncidentCategoryEntity> {
    const category = await this.findById(id);
    await this.incidentCategoryRepository.getEntityManager().removeAndFlush(category);
    return category;
  }
}
