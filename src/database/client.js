import { Pool } from 'pg'
import config from '../config'

const client = new Pool({
  host: config.pgsql.host,
  database: config.pgsql.database,
  port: config.pgsql.port,
  user: config.pgsql.user,
  password: config.pgsql.password,
})

export default client
