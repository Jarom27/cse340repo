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
        const classificationSelect = await utilities.buildClassificationList()
        res.render("./inventory/management",
            {
                title: 'Vehicle Managment',
                nav,
                triggers,
                classificationSelect

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
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}
invCont.buildEditItem = async (req, res, next) => {
    let inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    let classifications = await utilities.buildClassificationList()
    const itemData = await invModel.getVehicleById(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-vehicle", {
        title: "Edit " + itemName,
        nav,
        errors: null,
        classifications,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

invCont.updateInventory = async (req, res, next) => {
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}
invCont.buildDeleteItem = async (req, res, next) => {
    let inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/delete-confirmation", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_price: itemData.inv_price,
        inv_year: itemData.inv_year

    })
}

invCont.deleteInventory = async (req, res, next) => {
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_price,
        inv_year,

    } = req.body
    const deleteResult = await invModel.deleteInventory(
        parseInt(inv_id),
        inv_make,
        inv_model,
        inv_price,
        inv_year
    )

    if (deleteResult) {
        const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
        req.flash("notice", `The ${itemName} was successfully deleted.`)
        res.redirect("/inv/")
    } else {
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the delete failed.")
        res.status(501).render("inventory/delete-confirmation", {
            title: "Delete " + itemName,
            nav,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
        })
    }
}
module.exports = invCont