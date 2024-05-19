const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classificationId
        const data = await invModel.getInventoryByClassificationId(classification_id)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()

        const className = data[0].classification_name
        res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            grid,
        })
    } catch (err) {
        next(err)
    }

}
invCont.showVehicleDetailById = async function (req, res, next) {
    try {
        const itemId = req.params.vehicleId
        const data = await invModel.getVehicleById(itemId)
        let nav = await utilities.getNav()
        let detail = await utilities.buildGetVehicleDetails(data);
        res.render("./inventory/detail",
            {
                title: `${data.inv_model}, ${data.inv_make}`,
                vehicle: data,
                nav,
                detail
            })
    } catch (err) {
        next(err)
    }

}
invCont.showOptions = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        let triggers = await utilities.getOptionsLinks(["classification", "vehicle"])
        res.render("./inventory/management",
            {
                title: 'Vehicle Managment',
                nav,
                triggers

            })
    } catch (err) {
        next(err)
    }
}
invCont.addClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav()

    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
    })
}
invCont.addVehicleView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classifications = await utilities.buildClassificationList()
    res.render("./inventory/add-vehicle", {
        title: "Add Vehicle",
        nav,
        errors: null,
        classifications
    })
}
invCont.registerClassification = async function (req, res, next) {
    let nav = utilities.getNav()
    const { classification_name } = req.body
    const regResult = await invModel.registerClassification(classification_name)

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you added a new classification called ${classification_name}`
        )
        res.status(201).render("inventory/add-classification", {
            title: "Add classification",
            nav,
            errors: null

        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/add-classification", {
            title: "Add classification",
            nav,
            errors: null
        })
    }
}
invCont.registerVehicle = async function (req, res, next) {
    let nav = utilities.getNav()
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    const regResult = await invModel.registerVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you added a new vehicle, ${inv_make} ${inv_model}`
        )
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
            errors: null

        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/management", {
            title: "Add management",
            nav,
        })
    }
}
module.exports = invCont