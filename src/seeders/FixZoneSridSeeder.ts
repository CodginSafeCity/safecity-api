import { Seeder } from '@mikro-orm/seeder';

export class FixZoneSridSeeder extends Seeder {
  async run(em: any): Promise<void> {
    console.log('👉 Corrigiendo SRID de zonas con PostGIS...');

    await em.execute(`
      UPDATE availability_zones
      SET area = ST_SetSRID(area, 4326)
      WHERE ST_SRID(area) = 0;
    `);

    console.log('✅ SRID corregido para todas las zonas con SRID = 0');
  }
}
