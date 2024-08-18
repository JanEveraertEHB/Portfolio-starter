const knex = require("knex");
const knexfile = require("./db/knexfile");

/**
 * Determine the environment configuration
 * The environment is determined by the NODE_ENV environment variable.
 * If NODE_ENV is not set, it defaults to "development".
 *
 * @type {string}
 */
const environment = process.env.NODE_ENV || "development";

/**
 * Get the configuration for the current environment
 * The configuration is retrieved from the knexfile based on the current environment.
 *
 * @type {object}
 */
const config = knexfile[environment];

/**
 * Initialize the Knex instance
 * The Knex instance is initialized with the configuration for the current environment.
 *
 * @type {object}
 */
const db = knex(config);

/**
 * Export the Knex instance
 * The Knex instance is exported for use in other parts of the application.
 */
module.exports = db;
