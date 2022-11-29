const fetch = require("node-fetch");
const { prepareOptions } = require("../utils/dbUtils");
exports.getFolderItems = async (req, res) => {
  let folder_id = "0";
  if (req.query.folder_id) folder_id = req.query.folder_id;

  const options = await prepareOptions();

  const response = await fetch(
    `https://api.box.com/2.0/folders/${folder_id}/items`,
    options
  );

  const data = await response.json();

  let allItems = [];
  data.entries.forEach((element) => {
    let item = {};
    item.id = element.id;
    item.name = element.name;
    item.type = element.type;
    allItems.push(item);
  });
  res.send(Object.assign({}, allItems));
};
