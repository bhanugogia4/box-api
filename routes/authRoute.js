const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").get(authController.fetchToken);

module.exports = router;
