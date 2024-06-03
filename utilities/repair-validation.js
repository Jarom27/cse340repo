const inventoryModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.repairRules = () => {
    return [
        body("repair_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a valid description"),
        body("repair_date")
            .notEmpty()
            .isDate()
            .withMessage("Please enter a valid date"),
        body("repair_cost")
            .notEmpty()
            .isNumeric()
            .withMessage("Please give decimals or integers"),
        body("inv_id")
            .notEmpty()
            .trim()
            .escape()
            .withMessage("Please select a car")
        // .custom(async (classification_name) => {
        //     const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
        //     if (classificationExists) {
        //         throw new Error("Classification exists. Please enter another classification name")
        //     }
        // })
    ]
}
validate.checkRepairData = async (req, res, next) => {
    const { inv_id, repair_description, repair_date, repair_cost } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("repair/add-repair", {
            errors,
            title: "Add Repair",
            nav,
            inv_id,
            repair_description,
            repair_cost,
            repair_date
        })
        return
    }
    next()
}
module.exports = validate;