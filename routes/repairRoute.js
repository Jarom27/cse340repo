const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const validate = require("../utilities/repair-validation")
const repairController = require("../controllers/repairController")
router.get("/", utilities.checkLogin, utilities.checkAccountType, repairController.buildManager)
router.get("/add", utilities.checkLogin, utilities.checkAccountType, repairController.buildAddForm)
router.post("/add", validate.repairRules(), validate.checkRepairData, utilities.handleErrors(repairController.addRepair))
module.exports = router;
