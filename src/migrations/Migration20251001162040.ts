import { Migration } from '@mikro-orm/migrations';

export class Migration20251001162040 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "control_entities" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "address" varchar(255) not null, "phone" varchar(255) not null, constraint "control_entities_pkey" primary key ("id"));`);

    this.addSql(`create table "control_entity_users" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "user_id" uuid not null, "control_entity_id" uuid not null, constraint "control_entity_users_pkey" primary key ("id"));`);

    this.addSql(`alter table "control_entity_users" add constraint "control_entity_users_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "control_entity_users" add constraint "control_entity_users_control_entity_id_foreign" foreign key ("control_entity_id") references "control_entities" ("id") on update cascade;`);

    this.addSql(`alter table "availability_zones" drop constraint "availability_zones_user_id_foreign";`);

    this.addSql(`alter table "availability_zones" drop column "location";`);

    this.addSql(`alter table "availability_zones" add column "area" geometry(Polygon, 4326) null;`);
    this.addSql(`alter table "availability_zones" rename column "user_id" to "control_entity_id";`);
    this.addSql(`alter table "availability_zones" add constraint "availability_zones_control_entity_id_foreign" foreign key ("control_entity_id") references "control_entities" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "availability_zones" drop constraint "availability_zones_control_entity_id_foreign";`);

    this.addSql(`alter table "control_entity_users" drop constraint "control_entity_users_control_entity_id_foreign";`);

    this.addSql(`drop table if exists "control_entities" cascade;`);

    this.addSql(`drop table if exists "control_entity_users" cascade;`);

    this.addSql(`alter table "availability_zones" drop column "area";`);

    this.addSql(`alter table "availability_zones" add column "location" geometry null;`);
    this.addSql(`alter table "availability_zones" rename column "control_entity_id" to "user_id";`);
    this.addSql(`alter table "availability_zones" add constraint "availability_zones_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
  }

}
