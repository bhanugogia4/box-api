require("dotenv").config();
const express = require("express");
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

// Get Access Token

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

// Get Folder Names

app.get("/folder", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM BOX"); // ERROR HANDLING NEEDED

  const access_token = rows[0].accesstoken;

  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
  };

  const response = await fetch(
    "https://api.box.com/2.0/folders/0/items",
    options
  );

  const data = await response.json();

  let folders = [];
  data.entries.forEach((element) => {
    folders.push(element.name);
  });
  res.send(Object.assign({}, folders));
});

app.listen(8080, () => {
  console.log("Server listening to the requests");
});
