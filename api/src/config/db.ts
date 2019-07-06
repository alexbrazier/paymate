import knex from 'knex';
import config from './env';

const connection = knex({
  client: 'mysql',
  connection: config.db,
  // debug: process.NODE_ENV !== 'production'
});

export default connection;
