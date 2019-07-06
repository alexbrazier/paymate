import Knex from 'knex';

exports.up = function(knex: Knex, Promise: Promise<any>) {
  return knex.schema
    .createTable('users', function(table) {
      table.uuid('id').primary();
      table.string('name', 100);
      table
        .string('email')
        .notNullable()
        .unique();
      table.string('permalink', 40).unique();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('last_login').defaultTo(knex.fn.now());
    })
    .createTable('providers', function(table) {
      table.increments('id');
      table.string('name');
      table.string('icon');
      table.string('url');
      table.string('url_amount');
    })
    .createTable('user_providers', function(table) {
      table.increments('id');
      table.uuid('user_id').notNullable();
      table.foreign('user_id').references('users.id');
      table.integer('provider_id').unsigned();
      table.foreign('provider_id').references('providers.id');
      table.string('permalink');
      table.integer('order').unsigned();
      table.unique(['user_id', 'provider_id']);
    })
    .then(() =>
      knex.raw(`
        CREATE TRIGGER before_insert_user
        BEFORE INSERT ON users
        FOR EACH ROW
        SET new.id = uuid();
    `)
    );
};

exports.down = function(knex, Promise) {};
