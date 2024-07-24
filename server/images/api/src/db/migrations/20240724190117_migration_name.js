/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("Users", function (table) {
      table.increments("user_id").primary();
      table.string("username", 50).notNullable().unique();
      table.string("password_hash", 255).notNullable();
      table.enu("role", ["admin", "moderator", "member"]).defaultTo("member");
      table.timestamp("last_login").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("Threads", function (table) {
      table.increments("thread_id").primary();
      table.string("title", 100).notNullable();
      table.text("content").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("user_id")
        .inTable("Users")
        .onDelete("SET NULL");
      table.enu("status", ["open", "closed", "archived"]).defaultTo("open");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("Replies", function (table) {
      table.increments("reply_id").primary();
      table
        .integer("thread_id")
        .unsigned()
        .references("thread_id")
        .inTable("Threads")
        .onDelete("CASCADE");
      table.text("content").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("user_id")
        .inTable("Users")
        .onDelete("SET NULL");
      table.enu("status", ["active", "deleted"]).defaultTo("active");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .then(() => {
      return knex.raw(`
          CREATE OR REPLACE FUNCTION update_timestamp()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = now();
            RETURN NEW;
          END;
          $$ language 'plpgsql';
        `);
    })
    .then(() => {
      return knex.raw(`
          CREATE TRIGGER update_users_timestamp
          BEFORE UPDATE ON "Users"
          FOR EACH ROW
          EXECUTE PROCEDURE update_timestamp();
        `);
    })
    .then(() => {
      return knex.raw(`
          CREATE TRIGGER update_threads_timestamp
          BEFORE UPDATE ON "Threads"
          FOR EACH ROW
          EXECUTE PROCEDURE update_timestamp();
        `);
    })
    .then(() => {
      return knex.raw(`
          CREATE TRIGGER update_replies_timestamp
          BEFORE UPDATE ON "Replies"
          FOR EACH ROW
          EXECUTE PROCEDURE update_timestamp();
        `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("Replies")
    .dropTableIfExists("Threads")
    .dropTableIfExists("Users")
    .then(() => {
      return knex.raw(`
          DROP FUNCTION IF EXISTS update_timestamp() CASCADE;
        `);
    });
};
