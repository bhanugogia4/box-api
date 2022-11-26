require("dotenv").config();
const express = require("express");
const BoxSDK = require("box-node-sdk");
const fetch = require("node-fetch");
const Pool = require("pg").Pool;

const app = express();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log("Connected to Database!");

app.get("/token", async (req, res) => {
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
  res.send(data);
});

app.listen(8080, () => {
  console.log("Server listening to the requests");
});
