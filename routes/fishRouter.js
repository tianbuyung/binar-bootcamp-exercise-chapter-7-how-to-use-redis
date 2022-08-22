const express = require("express");
const router = express.Router();
const { getSpeciesData } = require("../controllers/fishController");
const { cacheData } = require("../middlewares/cacheData");
const { checkAuth } = require("../middlewares/checkAuthorization");

/* GET resend email verify. */
router.get("/:species", checkAuth, cacheData, getSpeciesData);

module.exports = router;
