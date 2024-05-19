const inventoryModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.registrationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a valid classification name")
        // .custom(async (classification_name) => {
        //     const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
        //     if (classificationExists) {
        //         throw new Error("Classification exists. Please enter another classification name")
        //     }
        // })
    ]
}
validate.checkRegData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}
module.exports = validate;