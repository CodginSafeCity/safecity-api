import { Migration } from '@mikro-orm/migrations';

export class Migration20250917020321 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "reset_token" varchar(255) null, add column "reset_token_expires_at" timestamptz null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop column "reset_token", drop column "reset_token_expires_at";`);
  }

}
