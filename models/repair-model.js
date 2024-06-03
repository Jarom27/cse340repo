const pool = require("../database/")


async function ShowAllRepairs() {
    try {
        const data = await pool.query("SELECT * FROM public.repair INNER JOIN public.inventory ON public.inventory.inv_id = public.repair.inv_id ORDER BY public.repair.repair_date DESC")
        return data.rows
    } catch (err) {
        console.error("ShowAllRepairs: " + err)
    }
}
async function AddRepair(inv_id, repair_description, repair_date, repair_cost) {
    try {
        const sql = "INSERT INTO public.repair(inv_id,repair_description,repair_date,repair_cost) VALUES ($1,$2,$3,$4)"
        return await pool.query(sql, [inv_id, repair_description, repair_date, repair_cost])
    } catch (error) {
        console.error("Error in the query: " + error.message)
        return error.message
    }
}
module.exports = { ShowAllRepairs, AddRepair }
