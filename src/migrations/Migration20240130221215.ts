import { Migration } from '@mikro-orm/migrations';

export class Migration20240130221215 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_favourite_pokemons" ("user_entity_id" int not null, "pokemon_entity_id" int not null, constraint "user_favourite_pokemons_pkey" primary key ("user_entity_id", "pokemon_entity_id"));');

    this.addSql('alter table "user_favourite_pokemons" add constraint "user_favourite_pokemons_user_entity_id_foreign" foreign key ("user_entity_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_favourite_pokemons" add constraint "user_favourite_pokemons_pokemon_entity_id_foreign" foreign key ("pokemon_entity_id") references "pokemon" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_favourite_pokemons" cascade;');
  }

}
