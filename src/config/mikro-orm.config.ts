import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import * as path from 'path';

const databaseConfig: Options = {
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL || 'postgres://postgres:pgadmin@localhost:5432/safecity',
  entities: [path.resolve(__dirname, '../**/*.entity.js')],
  entitiesTs: [path.resolve(__dirname, '../**/*.entity.ts')],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  tsNode: true,
  extensions: [Migrator],
};

export default databaseConfig;