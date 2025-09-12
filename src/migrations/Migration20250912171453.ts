import { Migration } from '@mikro-orm/migrations';

export class Migration20250912171453 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "incident_categories" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "description" varchar(255) not null, "icon" varchar(255) null, constraint "incident_categories_pkey" primary key ("id"));`);

    this.addSql(`create table "provinces" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "location" geometry null, constraint "provinces_pkey" primary key ("id"));`);

    this.addSql(`create table "cities" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "province_id" uuid not null, "location" geometry null, constraint "cities_pkey" primary key ("id"));`);

    this.addSql(`create table "roles" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "description" varchar(255) not null, constraint "roles_pkey" primary key ("id"));`);

    this.addSql(`create table "users" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "avatar" varchar(255) null, "role_id" uuid not null, "city_id" uuid null, constraint "users_pkey" primary key ("id"));`);

    this.addSql(`create table "notifications" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "user_id" uuid not null, "title" varchar(255) not null, "description" varchar(255) not null, "read_at" timestamptz null, constraint "notifications_pkey" primary key ("id"));`);

    this.addSql(`create table "incidents" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "user_id" uuid not null, "category_id" uuid not null, "city_id" uuid not null, "description" varchar(255) not null, "reported_at" timestamptz not null, "verified_at" timestamptz null, "location" geometry null, constraint "incidents_pkey" primary key ("id"));`);

    this.addSql(`create table "incident_pictures" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "incident_id" uuid not null, "url" varchar(255) not null, constraint "incident_pictures_pkey" primary key ("id"));`);

    this.addSql(`create table "availability_zones" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "user_id" uuid not null, "city_id" uuid not null, "location" geometry null, constraint "availability_zones_pkey" primary key ("id"));`);

    this.addSql(`alter table "cities" add constraint "cities_province_id_foreign" foreign key ("province_id") references "provinces" ("id") on update cascade;`);

    this.addSql(`alter table "users" add constraint "users_role_id_foreign" foreign key ("role_id") references "roles" ("id") on update cascade;`);
    this.addSql(`alter table "users" add constraint "users_city_id_foreign" foreign key ("city_id") references "cities" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "notifications" add constraint "notifications_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "incidents" add constraint "incidents_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "incidents" add constraint "incidents_category_id_foreign" foreign key ("category_id") references "incident_categories" ("id") on update cascade;`);
    this.addSql(`alter table "incidents" add constraint "incidents_city_id_foreign" foreign key ("city_id") references "cities" ("id") on update cascade;`);

    this.addSql(`alter table "incident_pictures" add constraint "incident_pictures_incident_id_foreign" foreign key ("incident_id") references "incidents" ("id") on update cascade;`);

    this.addSql(`alter table "availability_zones" add constraint "availability_zones_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "availability_zones" add constraint "availability_zones_city_id_foreign" foreign key ("city_id") references "cities" ("id") on update cascade;`);
  }

}
