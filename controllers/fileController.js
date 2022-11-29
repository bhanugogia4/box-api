const fetch = require("node-fetch");
const { prepareOptions } = require("../utils/dbUtils");
exports.downloadFile = async (req, res) => {
  if (!req.query.file_id) res.status(400).send("file_id missing");

  const file_id = req.query.file_id;

  const options = await prepareOptions();

  const response = await fetch(
    `https://api.box.com/2.0/files/${file_id}/content`,
    options
  );
  res.redirect(await response.url);
};
