// ------------------------------------
// Common
// ------------------------------------

const db = {
  dev: {
    client: 'postgresql',
    connection: {
      host: '{{host}}',
      database: '{{database}}',
      port: '5432',
      user: '{{user}}',
      password: '{{password}}',
      charset: 'utf8',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
}

// ------------------------------------
// Knex
// ------------------------------------

module.exports = {
  dev: {
    ...db.dev,
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './migrations',
    },
  },
}
