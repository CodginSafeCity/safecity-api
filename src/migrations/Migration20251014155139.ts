import { Migration } from '@mikro-orm/migrations';

export class Migration20251014155139 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "incidents" add column "file_url" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "incidents" drop column "file_url";`);
  }

}
