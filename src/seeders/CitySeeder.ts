import { Seeder } from '@mikro-orm/seeder';
import { CityEntity } from 'src/locations/city.entity';
import { ProvinceEntity } from 'src/locations/province.entity';

export class CitySeeder extends Seeder {
  async run(em: Parameters<Seeder['run']>[0]) {
    const cundinamarca = await em.findOne(ProvinceEntity, { name: 'Cundinamarca' });
    const antioquia = await em.findOne(ProvinceEntity, { name: 'Antioquia' });
    const valle = await em.findOne(ProvinceEntity, { name: 'Valle del Cauca' });

    if (!cundinamarca || !antioquia || !valle) {
      throw new Error('Primero corre ProvinceSeeder antes de CitySeeder');
    }

    const now = new Date();

    const cities = [
      { name: 'Bogotá', province: cundinamarca as ProvinceEntity, createdAt: now, updatedAt: now },
      { name: 'Medellín', province: antioquia as ProvinceEntity, createdAt: now, updatedAt: now },
      { name: 'Cali', province: valle as ProvinceEntity, createdAt: now, updatedAt: now },
    ];

    for (const city of cities) {
      em.create(CityEntity, city);
    }
  }
}
