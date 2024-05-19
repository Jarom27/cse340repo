const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
async function getClassificationNameById(classification_id) {
    return await pool.query("SELECT * FROM public.classification WHERE classification_id = $1", [classification_id])
}
/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}
async function getVehicleById(vehicle_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inventory.inv_id = $1`,
            [vehicle_id]
        )
        return data.rows[0];
    } catch (error) {
        console.error("getvehiclebyid error " + error)
    }
}
async function registerClassification(classification_name) {
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1)"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}
async function registerVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
    try {
        const sql = "INSERT INTO public.inventory (inv_make,inv_model,inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)"
        return await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id])
    } catch (error) {
        return error.message
    }
}
async function checkExistingClassification(classification_name) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_name = $1"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }

}
module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById, registerClassification, checkExistingClassification, getClassificationNameById, registerVehicle }