const inventoryModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.registrationRules = () => {
    return [
        body("classification_id")
            .notEmpty(),
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a valid classification name"),
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a valid classification name"),
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a valid classification name"),
        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Please enter a description"),
        body("inv_image")
            .trim()
            .notEmpty(),
        body("inv_thumbnail")
            .trim()
            .notEmpty(),
        body("inv_price")
            .trim()
            .notEmpty()
            .isNumeric(),
        body("inv_year")
            .trim()
            .notEmpty()
            .isNumeric(),
        body("inv_miles")
            .trim()
            .notEmpty()
            .isNumeric(),
        body("inv_color")
            .trim()
            .notEmpty()
    ]
}
validate.checkRegData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/management", {
            errors,
            title: "Management",
            nav,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}
module.exports = validate;