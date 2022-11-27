require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
//const BoxSDK = require("box-node-sdk");
const Pool = require("pg").Pool;
//const fs = require("fs");

const app = express();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log("Connected to Database!");

/*
-----------------------UPLOAD FILE------------------

const stream = fs.createReadStream("nicepage.js");
const folderID = "";
const client = BoxSDK.getBasicClient("ACCESS_TOKEN");
console.log(client);
client.files
  .uploadFile(folderID, "nicepage.js", stream)
  .then(() => console.log("Uploaded"))
  .catch(() => {
    console.log("Failed");
  });*/

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
  res.status(200);
});

// Get Folder Names

app.get("/folder", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM BOX"); // ERROR HANDLING NEEDED

  const access_token = rows[0].accesstoken;

  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
  };
  let folder_id = "0";
  if (req.query.folder_id) folder_id = req.query.folder_id;

  const response = await fetch(
    `https://api.box.com/2.0/folders/${folder_id}/items`,
    options
  );

  const data = await response.json();

  let allItems = [];
  data.entries.forEach((element) => {
    //folders.push(element.name);
    let item = {};
    item.id = element.id;
    item.name = element.name;
    item.type = element.type;
    allItems.push(item);
  });
  res.send(Object.assign({}, allItems));
});

// Get Folder Items
app.get("/folder:folder_id", async (req, res) => {
  //req.query;
  console.log(req.query);
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
