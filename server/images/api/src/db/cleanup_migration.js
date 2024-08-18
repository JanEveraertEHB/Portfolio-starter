const knex = require("knex")(require("./knexfile").development);

async function cleanupMigration() {
  try {
    await knex("knex_migrations")
      .where("name", "20240724190117_migration_name.js")
      .del();
    console.log("Migration entry deleted");
  } catch (err) {
    console.error("Error deleting migration entry:", err);
  } finally {
    knex.destroy();
  }
}

cleanupMigration();
