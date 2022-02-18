const { Pool } = require("pg")
// Coloca aquí tus credenciales
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,

});

module.exports = {
  query: (text, params) => pool.query(text, params),
};