import { Migration } from '@mikro-orm/migrations';

export class Migration20251010165540 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "control_entity_users" drop constraint "control_entity_users_user_id_id_foreign";`);

    this.addSql(`alter table "control_entity_users" rename column "user_id_id" to "user_id";`);
    this.addSql(`alter table "control_entity_users" add constraint "control_entity_users_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "control_entity_users" drop constraint "control_entity_users_user_id_foreign";`);

    this.addSql(`alter table "control_entity_users" rename column "user_id" to "user_id_id";`);
    this.addSql(`alter table "control_entity_users" add constraint "control_entity_users_user_id_id_foreign" foreign key ("user_id_id") references "users" ("id") on update cascade;`);
  }

}
