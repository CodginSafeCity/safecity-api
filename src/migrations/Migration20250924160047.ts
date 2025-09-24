import { Migration } from '@mikro-orm/migrations';

export class Migration20250924160047 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "incidents" add column "status" text check ("status" in ('OPEN', 'IN_PROGRESS', 'CLOSED')) not null default 'OPEN';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "incidents" drop column "status";`);
  }

}
