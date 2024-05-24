const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/")
const regValidate = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")
const invController = require("../controllers/invController");

router.get("/", invController.showOptions)
router.get("/add-classification/", invController.addClassificationView)
router.get("/add-vehicle", invController.addVehicleView)
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:vehicleId", invController.showVehicleDetailById);

router.post("/add-classification", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(invController.registerClassification))
router.post("/add-vehicle", invValidate.registrationRules(), invValidate.checkRegData, utilities.handleErrors(invController.registerVehicle))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditItem))
router.post("/update/", invValidate.newInventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))

router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteItem))
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))
module.exports = router;