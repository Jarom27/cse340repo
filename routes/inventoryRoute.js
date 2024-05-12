const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/")
const invController = require("../controllers/invController");

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:vehicleId", invController.showVehicleDetailById);



module.exports = router;