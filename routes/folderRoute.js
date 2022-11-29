const express = require("express");
const folderController = require("../controllers/folderController");

const router = express.Router();

router.route("/").get(folderController.getFolderItems);
router.route("/:folder_id").get(folderController.getFolderItems);

module.exports = router;
