const express = require("express");
const router = express.Router();

const fishController = require("../controllers/fishController");

/* GET resend email verify. */
router.get("/fish/:species", fishController.getSpeciesData);

module.exports = router;
