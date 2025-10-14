import { Seeder } from '@mikro-orm/seeder';
import { ControlEntity } from 'src/control-entities/control-entity.entity';

export class ControlEntitySeeder extends Seeder {
  async run(em: Parameters<Seeder['run']>[0]) {
    const data: Partial<ControlEntity>[] = [
      {
        name: 'Policía Metropolitana',
        address: 'Calle 10 #15-45',
        phone: '3001234567',
        availabilityZones: [],
        controlEntityUsers: [],
      },
      {
        name: 'Bomberos Central',
        address: 'Av. Libertador #30-22',
        phone: '3009876543',
        availabilityZones: [],
        controlEntityUsers: [],
      },
      {
        name: 'Hospital General',
        address: 'Cra. 7 #20-10',
        phone: '3201112233',
        availabilityZones: [],
        controlEntityUsers: [],
      },
    ];

    const entities = data.map((item) =>
      em.create(ControlEntity, item as any)
    );

    await em.persistAndFlush(entities);
  }
}
