const utilities = require("../utilities/")
const repairModel = require("../models/repair-model")
const invModel = require("../models/inventory-model")
const repairCon = {}


repairCon.buildManager = async function (req, res, next) {
    const repairData = await repairModel.ShowAllRepairs()
    const nav = await utilities.getNav()
    const vehicles = await utilities.buildRepairList(repairData)
    res.render("./repair/manager", {
        title: "Repair Manager",
        nav,
        vehicles
    })
}
repairCon.buildAddForm = async function (req, res, next) {
    const nav = await utilities.getNav()
    const vehicleData = await invModel.getAllInventory()
    const vehicles = await utilities.buildInventoryList(vehicleData)

    res.render("./repair/add-repair", {
        title: "Add Repair",
        nav,
        vehicles,
        errors: null
    })
}
repairCon.addRepair = async function (req, res, next) {

}
repairCon.getAllRepairs = async function (req, res, next) {
    const repairData = repairModel.ShowAllRepairs()
    res.json(repairData)
}
module.exports = repairCon