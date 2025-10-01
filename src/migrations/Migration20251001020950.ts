import { Migration } from '@mikro-orm/migrations';

export class Migration20251001020950 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "incidents" drop constraint "incidents_user_id_foreign";`);
    this.addSql(`alter table "incidents" drop constraint "incidents_category_id_foreign";`);
    this.addSql(`alter table "incidents" drop constraint "incidents_city_id_foreign";`);

    this.addSql(`alter table "incidents" drop column "user_id";`);

    this.addSql(`alter table "incidents" add column "title" varchar(255) null, add column "cluster_group" int null, add column "reported_by_id" uuid null, add column "assigned_to_id" uuid null, add column "assigned_at" timestamptz null;`);
    this.addSql(`alter table "incidents" alter column "category_id" drop default;`);
    this.addSql(`alter table "incidents" alter column "category_id" type uuid using ("category_id"::text::uuid);`);
    this.addSql(`alter table "incidents" alter column "category_id" drop not null;`);
    this.addSql(`alter table "incidents" alter column "city_id" drop default;`);
    this.addSql(`alter table "incidents" alter column "city_id" type uuid using ("city_id"::text::uuid);`);
    this.addSql(`alter table "incidents" alter column "city_id" drop not null;`);
    this.addSql(`alter table "incidents" add constraint "incidents_reported_by_id_foreign" foreign key ("reported_by_id") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "incidents" add constraint "incidents_assigned_to_id_foreign" foreign key ("assigned_to_id") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "incidents" add constraint "incidents_category_id_foreign" foreign key ("category_id") references "incident_categories" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "incidents" add constraint "incidents_city_id_foreign" foreign key ("city_id") references "cities" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "incidents" drop constraint "incidents_reported_by_id_foreign";`);
    this.addSql(`alter table "incidents" drop constraint "incidents_assigned_to_id_foreign";`);
    this.addSql(`alter table "incidents" drop constraint "incidents_category_id_foreign";`);
    this.addSql(`alter table "incidents" drop constraint "incidents_city_id_foreign";`);

    this.addSql(`alter table "incidents" drop column "title", drop column "cluster_group", drop column "reported_by_id", drop column "assigned_to_id", drop column "assigned_at";`);

    this.addSql(`alter table "incidents" add column "user_id" uuid not null;`);
    this.addSql(`alter table "incidents" alter column "category_id" drop default;`);
    this.addSql(`alter table "incidents" alter column "category_id" type uuid using ("category_id"::text::uuid);`);
    this.addSql(`alter table "incidents" alter column "category_id" set not null;`);
    this.addSql(`alter table "incidents" alter column "city_id" drop default;`);
    this.addSql(`alter table "incidents" alter column "city_id" type uuid using ("city_id"::text::uuid);`);
    this.addSql(`alter table "incidents" alter column "city_id" set not null;`);
    this.addSql(`alter table "incidents" add constraint "incidents_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "incidents" add constraint "incidents_category_id_foreign" foreign key ("category_id") references "incident_categories" ("id") on update cascade;`);
    this.addSql(`alter table "incidents" add constraint "incidents_city_id_foreign" foreign key ("city_id") references "cities" ("id") on update cascade;`);
  }

}
