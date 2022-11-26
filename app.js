require("dotenv").config();
const express = require("express");
const BoxSDK = require("box-node-sdk");
const fetch = require("node-fetch");

const app = express();

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
  res.send(data);
});

app.listen(8080, () => {
  console.log("Listening to the server");
});
