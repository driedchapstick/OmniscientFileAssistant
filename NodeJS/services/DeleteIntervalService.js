const sql = require("mssql");
const config = require("./dbconfig");

async function InitialLoad() {
    try {
      let pool = await sql.connect(config);
      let Schedules = await pool.request().execute("GetAllIntervals");
      return Schedules.recordset;
    } catch (error) {
      console.log("============ERROR============");
      console.log("Error in DeleteScheduleService.js");
      console.log("============ERROR============");
      console.log(error);
      console.log("");
    }
}
async function DeleteInterval(InterID) {
    try {
      let pool = await sql.connect(config);
      let Schedules = await pool.request().input("InterID", sql.Int, InterID).execute("DeleteIntervals");
      return Schedules.recordset;
    } catch (error) {
      console.log("============ERROR============");
      console.log("Error in DeleteScheduleService.js");
      console.log("============ERROR============");
      console.log(error);
      console.log("");
    }
}
module.exports = {
    InitialLoad: InitialLoad, 
    DeleteInterval: DeleteInterval,
}