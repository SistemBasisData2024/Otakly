require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPORT} = process.env;
const { Pool } = require('pg');

const neonPool = new Pool({
    user: PGUSER,
    password: PGPASSWORD,
    host: PGHOST,
    database: PGDATABASE,
    ssl: {
      require: true,
    },
    port: ENDPORT,
  });
neonPool.connect().then(() => {
  console.log('Connected to the database');
}).catch(error => {
  console.error(error);
});

module.exports = neonPool;
