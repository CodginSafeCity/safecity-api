import { Seeder } from '@mikro-orm/seeder';
import { RoleSeeder } from './RoleSeeder';
import { ProvinceSeeder } from './ProvinceSeeder';
import { CitySeeder } from './CitySeeder';
import { UserSeeder } from './UserSeeder';

export class DatabaseSeeder extends Seeder {
  async run(em: Parameters<Seeder['run']>[0]) {
    await this.call(em, [
      RoleSeeder,
      ProvinceSeeder,
      CitySeeder,
      UserSeeder,
    ]);
  }
}
