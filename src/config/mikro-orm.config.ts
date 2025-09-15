import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import { UserEntity } from 'src/user/user.entity';
import { RoleEntity } from 'src/roles/role.entity';
import { CityEntity } from 'src/locations/city.entity';
import { ProvinceEntity } from 'src/locations/province.entity';
import { IncidentEntity } from 'src/incidents/incident.entity';
import { IncidentCategoryEntity } from 'src/incidents/incident-category.entity';
import { IncidentPicture } from 'src/incidents/incident-picture.entity';
import { Notification } from 'src/notifications/notification.entity';
import { AvailabilityZoneEntity } from 'src/availability-zones/availability-zone.entity';

const isProd = process.env.NODE_ENV === 'production';

const databaseConfig: Options = {
  driver: PostgreSqlDriver,
  clientUrl:
    process.env.DATABASE_URL ||
    'postgres://postgres:pgadmin@localhost:5432/safecity',

  entities: [
    UserEntity,
    RoleEntity,
    CityEntity,
    ProvinceEntity,
    IncidentEntity,
    IncidentCategoryEntity,
    IncidentPicture,
    Notification,
    AvailabilityZoneEntity,
  ],

  metadataProvider: TsMorphMetadataProvider,
  debug: !isProd,
  tsNode: !isProd,
  extensions: [Migrator],
};

export default databaseConfig;
