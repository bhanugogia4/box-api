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
  console.log(process.env.CLIENT_ID);

  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };
  console.log(options);
  const response = await fetch("https://api.box.com/oauth/token", options);
  console.log(response);
  //   res.send(response.json());
});

app.listen(8080, () => {
  console.log("Listening to the server");
});
