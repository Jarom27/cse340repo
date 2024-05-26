const express = require("express");
const router = new express.Router();
const regValidate = require('../utilities/account-validation')
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController");

router.get("/login", accountController.buildLogin)
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
router.get("/register", accountController.buildRegister)
router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
router.get("/edit", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountEdit))
router.post("/update", regValidate.updateRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))
router.post("/edit-password", regValidate.passwordRule(), regValidate.checkChangePassword, utilities.handleErrors(accountController.changePassword))
module.exports = router;