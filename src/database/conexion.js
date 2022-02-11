const { Pool } = require("pg")
// Coloca aquí tus credenciales
const pool = new Pool({
  user: "vmv",
  host: "192.168.1.66",
  database: "firstapi",
  password: "vmv",
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};