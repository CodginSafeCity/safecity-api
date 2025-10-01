import { Seeder } from '@mikro-orm/seeder';
import { UserEntity } from '../user/user.entity';
import { RoleEntity } from '../roles/role.entity';
import { CityEntity } from '../locations/city.entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export class UserSeeder extends Seeder {
  async run(em: Parameters<Seeder['run']>[0]) {
    const password = await bcrypt.hash('123456', 10);

    const role = await em.findOne(RoleEntity, { name: 'Admin' });
    const city = await em.findOne(CityEntity, { name: 'Bogotá' });

    if (!role) {
      throw new Error('Role Admin no existe, corre RoleSeeder primero');
    }

    if (!city) {
      throw new Error('City Bogotá no existe, corre CitySeeder primero');
    }

    em.create(UserEntity, {
      email: 'hozkar178@gmail.com',
      name: 'Oscar',
      last_name: 'Guerrero',
      password,
      role,
      city,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    for (let i = 0; i < 100; i++) {
      em.create(UserEntity, {
        email: faker.internet.email(),
        name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password,
        role,
        city,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
}
