const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../../../.env");
console.log(`Loading .env from: ${dotenvPath}`);
require("dotenv").config({ path: dotenvPath });

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "store",
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB || "postgres",
      port: process.env.POSTGRES_PORT || 5432,
    },
    pool: {
      min: 2,
      max: 50,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  staging: {
    client: "pg",
    connection: {
      host: process.env.STAGING_DB_HOST,
      user: process.env.STAGING_DB_USER,
      password: process.env.STAGING_DB_PASSWORD,
      database: process.env.STAGING_DB_NAME,
      port: process.env.STAGING_DB_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
