const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const repairController = require("../controllers/repairController")
router.get("/", repairController.buildManager)
router.get("/add", repairController.buildAddForm)
module.exports = router;
