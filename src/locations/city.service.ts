import { EntityRepository, EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@mikro-orm/nestjs';
import { CityEntity } from './city.entity';
import { ProvinceEntity } from './province.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CityQueryFilterDto } from './dto/city-find-options.dto';

@Injectable()
export class CityService {
    constructor(
        @InjectRepository(CityEntity)
        private readonly cityRepository: EntityRepository<CityEntity>,
        @InjectRepository(ProvinceEntity)
        private readonly provinceRepo: EntityRepository<ProvinceEntity>,
        @Inject(EntityManager)
        private readonly em: EntityManager,
    ) { }

    async create(dto: CreateCityDto): Promise<CityEntity> {
        const province = await this.provinceRepo.findOne(dto.provinceId);
        if (!province) throw new NotFoundException('Province not found');

        const city = new CityEntity(dto.name, province, dto.location);
        await this.em.persistAndFlush(city);

        return city;
    }

    async find(query: CityQueryFilterDto) {
        const filter: FilterQuery<CityEntity> = {};

        if (query.filter?.name) {
            filter.name = { $like: `%${query.filter.name}%` };
        }

        const [result, total] = await this.cityRepository.findAndCount(filter, {
            limit: query.pagination?.limit ?? 10,
            offset: query.pagination?.offset ?? 0,
        });

        return { data: result, total };
    }

    async findById(id: string) {
        const city = await this.cityRepository.findOne(id, { populate: ['province'] });
        if (!city) throw new NotFoundException('City not found');
        return city;
    }

    async update(id: string, dto: UpdateCityDto) {
        const zone = await this.findById(id);

        if (dto.name) zone.name = dto.name;
        if (dto.location) zone.location = dto.location;

        if (dto.provinceId) {
            const province = await this.provinceRepo.findOne(dto.provinceId);
            if (!province) throw new NotFoundException('Province not found');
            zone.province = province;
        }

        await this.em.flush();
        return zone;
    }

    async delete(id: string) {
        const zone = await this.findById(id);
        await this.em.removeAndFlush(zone);
        return zone;
    }
}
