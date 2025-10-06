import { Migration } from '@mikro-orm/migrations';

export class Migration20251006200853 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "availability_zones" add column "name" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "availability_zones" drop column "name";`);
  }

}
