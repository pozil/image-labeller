// Setup DB pool
require('pg').defaults.parseInt8 = true;
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (error, client) => {
  console.error('Unexpected error on idle client', error);
  process.exit(-1);
});

module.exports.getPool = () => {
	return pool;
}

module.exports.query = (text, values) => {
  return pool.query(text, values)
    .catch(error => {
      console.error('DB Query failed: ', text, values);
      console.error(error);
    });
}
