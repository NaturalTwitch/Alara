const { Pool } = require('pg');
require('dotenv').config();
const currentDate = new Date()
const pool = new Pool({
  user: 'postgres',
  host: process.env.DATABASE_IP,
  database: 'Alara',
  password: process.env.DATABASE_PASS,
  port: 5432,
});
pool.query('SELECT NOW() as now;', (err) => {
  if (err) {
    console.log(`[${currentDate.toLocaleString()}][Alara Systems] Couldn't connect to DataBase`, err.stack);
  } else {
    console.log(`[${currentDate.toLocaleString()}][Alara Systems] Established Connection to DataBase`);
  }
});
pool.connect((err) => {
  if (err) {
    console.log('[Alara Systems] Error while logging into DataBase', err.stack);
  }
});
pool.on('error', (err) => {
  console.log('[Alara Systems] Unexpected error on idle pool client', err);
});

module.exports = pool;

