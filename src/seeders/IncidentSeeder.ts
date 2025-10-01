import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { IncidentEntity } from '../incidents/incident.entity';
import { IncidentStatus } from '../incidents/incident.types';
import { UserEntity } from '../user/user.entity';
import { IncidentCategoryEntity } from '../incident-categories/incident-category.entity';
import { CityEntity } from '../locations/city.entity';

export class IncidentSeeder extends Seeder {
  async run(em: Parameters<Seeder['run']>[0]) {
    const users = await em.find(UserEntity, {});
    const categories = await em.find(IncidentCategoryEntity, {});
    const cities = await em.find(CityEntity, {});

    if (!users.length || !categories.length || !cities.length) {
      throw new Error('Necesitas seeders previos de users, categories y cities antes de IncidentSeeder');
    }

    for (let i = 0; i < 100; i++) {
      const reported_by = faker.helpers.arrayElement(users);
      const category = faker.helpers.arrayElement(categories);
      const city = faker.helpers.arrayElement(cities);
      const now = faker.date.recent({ days: 90 });

      em.create(IncidentEntity, {
        id: crypto.randomUUID(),
        reported_by,
        category,
        city,
        description: faker.lorem.sentence(),
        reported_at: now,
        verified_at: faker.datatype.boolean() ? faker.date.soon({ days: 10, refDate: now }) : null,
        location: null,
        status: faker.helpers.arrayElement([
          IncidentStatus.OPEN,
          IncidentStatus.IN_PROGRESS,
          IncidentStatus.CLOSED,
        ]),
        createdAt: now,
        updatedAt: new Date(),
      });
    }
  }
}
