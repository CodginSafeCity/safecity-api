import { RoleEntity } from 'src/roles/role.entity';
import { CityEntity } from 'src/locations/city.entity';

export class UserDto {
  id!: string;
  name!: string;
  last_name!: string;
  email!: string;
  avatar?: string;
  role!: RoleEntity;
  city?: CityEntity;
}