import { Migration } from '@mikro-orm/migrations';

export class Migration20251014220525 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_email_unique";`);
  }

}
