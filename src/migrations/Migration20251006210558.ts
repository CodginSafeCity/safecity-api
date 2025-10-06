import { Migration } from '@mikro-orm/migrations';

export class Migration20251006210558 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "availability_zones" alter column "area" type geometry using ("area"::geometry);`);
    this.addSql(`alter table "availability_zones" alter column "area" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "availability_zones" alter column "area" type geometry(Polygon, 4326) using ("area"::geometry(Polygon, 4326));`);
    this.addSql(`alter table "availability_zones" alter column "area" drop not null;`);
  }

}
