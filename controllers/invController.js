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
module.exports = invCont