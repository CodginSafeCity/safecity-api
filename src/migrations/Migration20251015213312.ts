import { Migration } from '@mikro-orm/migrations';

export class Migration20251015213312 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "cities" add column "zoom" real null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cities" drop column "zoom";`);
  }

}
