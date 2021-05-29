// ------------------------------------
// Migration
// ------------------------------------

exports.up = (knex) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
exports.down = () => null

// ------------------------------------
// Seed
// ------------------------------------
exports.seed = () => null
