/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasUsersTable = await knex.schema.hasTable("Users");
  if (!hasUsersTable) {
    await knex.schema.createTable("Users", (table) => {
      table.increments("user_id").primary(); // Auto-incrementing primary key
      table.string("UUID", 36).notNullable(); // Change to string type
      table.string("username", 50).notNullable();
      table.string("password_hash", 255).notNullable();
      table.enu("role", ["admin", "moderator", "member"]).defaultTo("member");
      table.timestamp("last_login").nullable();
      table.timestamps(true, true);
    });
  }

  const hasThreadsTable = await knex.schema.hasTable("Threads");
  if (!hasThreadsTable) {
    await knex.schema.createTable("Threads", (table) => {
      table.increments("thread_id").primary();
      table.string("title", 255).notNullable();
      table.text("content").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("user_id")
        .inTable("Users")
        .onDelete("CASCADE");
      table.string("status").notNullable().defaultTo("open");
      table.timestamps(true, true);
    });
  }

  const hasRepliesTable = await knex.schema.hasTable("Replies");
  if (!hasRepliesTable) {
    await knex.schema.createTable("Replies", (table) => {
      table.increments("reply_id").primary();
      table.text("content").notNullable();
      table
        .integer("thread_id")
        .unsigned()
        .references("thread_id")
        .inTable("Threads");
      table
        .integer("user_id")
        .unsigned()
        .references("user_id")
        .inTable("Users")
        .onDelete("CASCADE");
      table.string("status").notNullable().defaultTo("active");
      table.timestamps(true, true);
    });
  }

  // Create the update_timestamp function
  await knex.raw(`
      CREATE OR REPLACE FUNCTION update_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

  const hasUpdateThreadsTrigger = await knex.raw(`
        SELECT EXISTS (
          SELECT 1
          FROM pg_trigger
          WHERE tgname = 'update_threads_timestamp'
        );
      `);

  if (!hasUpdateThreadsTrigger.rows[0].exists) {
    await knex.raw(`
          CREATE TRIGGER update_threads_timestamp
          BEFORE UPDATE ON "Threads"
          FOR EACH ROW
          EXECUTE PROCEDURE update_timestamp();
        `);
  }

  const hasUpdateRepliesTrigger = await knex.raw(`
        SELECT EXISTS (
          SELECT 1
          FROM pg_trigger
          WHERE tgname = 'update_replies_timestamp'
        );
      `);

  if (!hasUpdateRepliesTrigger.rows[0].exists) {
    await knex.raw(`
          CREATE TRIGGER update_replies_timestamp
          BEFORE UPDATE ON "Replies"
          FOR EACH ROW
          EXECUTE PROCEDURE update_timestamp();
        `);
  }
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
      return knex.raw(`DROP FUNCTION IF EXISTS update_timestamp() CASCADE;`);
    });
};
