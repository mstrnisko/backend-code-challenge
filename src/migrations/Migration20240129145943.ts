import { Migration } from '@mikro-orm/migrations';

export class Migration20240129145943 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "pokemon" ("id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "classification" varchar(255) not null, "min_weight" varchar(255) not null, "max_weight" varchar(255) not null, "min_height" varchar(255) not null, "max_height" varchar(255) not null, "flee_rate" real not null, "evolution_requirement_amount" int null, "evolution_requirement_name" varchar(255) null, "max_cp" int not null, "max_hp" int not null, "common_capture_area" varchar(255) null, "other_pokemon_class" text check ("other_pokemon_class" in (\'LEGENDARY\', \'MYTHIC\')) null, constraint "pokemon_pkey" primary key ("id"));');

    this.addSql('create table "pokemon_previous_evolutions" ("pokemon_entity_1_id" int not null, "pokemon_entity_2_id" int not null, constraint "pokemon_previous_evolutions_pkey" primary key ("pokemon_entity_1_id", "pokemon_entity_2_id"));');

    this.addSql('create table "pokemon_evolutions" ("pokemon_entity_1_id" int not null, "pokemon_entity_2_id" int not null, constraint "pokemon_evolutions_pkey" primary key ("pokemon_entity_1_id", "pokemon_entity_2_id"));');

    this.addSql('create table "resistant" ("name" varchar(255) not null, constraint "resistant_pkey" primary key ("name"));');

    this.addSql('create table "pokemon_weaknesses_types" ("pokemon_entity_id" int not null, "resistant_entity_name" varchar(255) not null, constraint "pokemon_weaknesses_types_pkey" primary key ("pokemon_entity_id", "resistant_entity_name"));');

    this.addSql('create table "pokemon_types" ("pokemon_entity_id" int not null, "resistant_entity_name" varchar(255) not null, constraint "pokemon_types_pkey" primary key ("pokemon_entity_id", "resistant_entity_name"));');

    this.addSql('create table "pokemon_resistant_types" ("pokemon_entity_id" int not null, "resistant_entity_name" varchar(255) not null, constraint "pokemon_resistant_types_pkey" primary key ("pokemon_entity_id", "resistant_entity_name"));');

    this.addSql('create table "attack" ("name" varchar(255) not null, "type_name" varchar(255) not null, "damage" int not null, constraint "attack_pkey" primary key ("name"));');

    this.addSql('create table "pokemon_special_attacks" ("pokemon_entity_id" int not null, "attack_entity_name" varchar(255) not null, constraint "pokemon_special_attacks_pkey" primary key ("pokemon_entity_id", "attack_entity_name"));');

    this.addSql('create table "pokemon_fast_attacks" ("pokemon_entity_id" int not null, "attack_entity_name" varchar(255) not null, constraint "pokemon_fast_attacks_pkey" primary key ("pokemon_entity_id", "attack_entity_name"));');

    this.addSql('alter table "pokemon_previous_evolutions" add constraint "pokemon_previous_evolutions_pokemon_entity_1_id_foreign" foreign key ("pokemon_entity_1_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_previous_evolutions" add constraint "pokemon_previous_evolutions_pokemon_entity_2_id_foreign" foreign key ("pokemon_entity_2_id") references "pokemon" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_evolutions" add constraint "pokemon_evolutions_pokemon_entity_1_id_foreign" foreign key ("pokemon_entity_1_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_evolutions" add constraint "pokemon_evolutions_pokemon_entity_2_id_foreign" foreign key ("pokemon_entity_2_id") references "pokemon" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_weaknesses_types" add constraint "pokemon_weaknesses_types_pokemon_entity_id_foreign" foreign key ("pokemon_entity_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_weaknesses_types" add constraint "pokemon_weaknesses_types_resistant_entity_name_foreign" foreign key ("resistant_entity_name") references "resistant" ("name") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_types" add constraint "pokemon_types_pokemon_entity_id_foreign" foreign key ("pokemon_entity_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_types" add constraint "pokemon_types_resistant_entity_name_foreign" foreign key ("resistant_entity_name") references "resistant" ("name") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_resistant_types" add constraint "pokemon_resistant_types_pokemon_entity_id_foreign" foreign key ("pokemon_entity_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_resistant_types" add constraint "pokemon_resistant_types_resistant_entity_name_foreign" foreign key ("resistant_entity_name") references "resistant" ("name") on update cascade on delete cascade;');

    this.addSql('alter table "attack" add constraint "attack_type_name_foreign" foreign key ("type_name") references "resistant" ("name") on update cascade;');

    this.addSql('alter table "pokemon_special_attacks" add constraint "pokemon_special_attacks_pokemon_entity_id_foreign" foreign key ("pokemon_entity_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_special_attacks" add constraint "pokemon_special_attacks_attack_entity_name_foreign" foreign key ("attack_entity_name") references "attack" ("name") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_fast_attacks" add constraint "pokemon_fast_attacks_pokemon_entity_id_foreign" foreign key ("pokemon_entity_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_fast_attacks" add constraint "pokemon_fast_attacks_attack_entity_name_foreign" foreign key ("attack_entity_name") references "attack" ("name") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pokemon_previous_evolutions" drop constraint "pokemon_previous_evolutions_pokemon_entity_1_id_foreign";');

    this.addSql('alter table "pokemon_previous_evolutions" drop constraint "pokemon_previous_evolutions_pokemon_entity_2_id_foreign";');

    this.addSql('alter table "pokemon_evolutions" drop constraint "pokemon_evolutions_pokemon_entity_1_id_foreign";');

    this.addSql('alter table "pokemon_evolutions" drop constraint "pokemon_evolutions_pokemon_entity_2_id_foreign";');

    this.addSql('alter table "pokemon_weaknesses_types" drop constraint "pokemon_weaknesses_types_pokemon_entity_id_foreign";');

    this.addSql('alter table "pokemon_types" drop constraint "pokemon_types_pokemon_entity_id_foreign";');

    this.addSql('alter table "pokemon_resistant_types" drop constraint "pokemon_resistant_types_pokemon_entity_id_foreign";');

    this.addSql('alter table "pokemon_special_attacks" drop constraint "pokemon_special_attacks_pokemon_entity_id_foreign";');

    this.addSql('alter table "pokemon_fast_attacks" drop constraint "pokemon_fast_attacks_pokemon_entity_id_foreign";');

    this.addSql('alter table "pokemon_weaknesses_types" drop constraint "pokemon_weaknesses_types_resistant_entity_name_foreign";');

    this.addSql('alter table "pokemon_types" drop constraint "pokemon_types_resistant_entity_name_foreign";');

    this.addSql('alter table "pokemon_resistant_types" drop constraint "pokemon_resistant_types_resistant_entity_name_foreign";');

    this.addSql('alter table "attack" drop constraint "attack_type_name_foreign";');

    this.addSql('alter table "pokemon_special_attacks" drop constraint "pokemon_special_attacks_attack_entity_name_foreign";');

    this.addSql('alter table "pokemon_fast_attacks" drop constraint "pokemon_fast_attacks_attack_entity_name_foreign";');

    this.addSql('drop table if exists "pokemon" cascade;');

    this.addSql('drop table if exists "pokemon_previous_evolutions" cascade;');

    this.addSql('drop table if exists "pokemon_evolutions" cascade;');

    this.addSql('drop table if exists "resistant" cascade;');

    this.addSql('drop table if exists "pokemon_weaknesses_types" cascade;');

    this.addSql('drop table if exists "pokemon_types" cascade;');

    this.addSql('drop table if exists "pokemon_resistant_types" cascade;');

    this.addSql('drop table if exists "attack" cascade;');

    this.addSql('drop table if exists "pokemon_special_attacks" cascade;');

    this.addSql('drop table if exists "pokemon_fast_attacks" cascade;');
  }

}
