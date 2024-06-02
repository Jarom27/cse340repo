const pool = require("../database/")


async function ShowAllRepairs() {
    try {
        const data = await pool.query("SELECT * FROM public.repair")
        return data.rows
    } catch (err) {
        console.error("ShowAllRepairs: " + err)
    }
}
module.exports = { ShowAllRepairs }
