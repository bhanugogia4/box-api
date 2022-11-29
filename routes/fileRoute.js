const express = require("express");
const fileController = require("../controllers/fileController");

const router = express.Router();

router.route("/").get(fileController.downloadFile);

module.exports = router;
