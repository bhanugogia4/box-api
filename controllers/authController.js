const fetch = require("node-fetch");
const { pool } = require("../utils/dbUtils");
exports.fetchToken = async (req, res) => {
  const body = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "client_credentials",
    box_subject_type: "enterprise",
    box_subject_id: process.env.BOX_SUBJECT_ID,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: { Accept: "*/*" },
  };
  const response = await fetch("https://api.box.com/oauth2/token", options);
  const data = await response.json();
  pool.query(
    "UPDATE BOX SET ACCESSTOKEN =($1)",
    [data.access_token],
    (err, result) => {
      if (err) res.status(500).send(err);
    }
  );
  res.status(200).send("Token Generated");
};
