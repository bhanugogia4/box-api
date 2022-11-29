const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
module.exports.pool = pool;

module.exports.prepareOptions = async () => {
  const { rows } = await pool.query("SELECT * FROM BOX"); // ERROR HANDLING NEEDED

  const access_token = rows[0].accesstoken;

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
  return options;
};
