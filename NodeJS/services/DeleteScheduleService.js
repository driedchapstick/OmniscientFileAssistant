const sql = require("mssql");
const config = require("./dbconfig");

async function InitialLoad() {
    try {
      let pool = await sql.connect(config);
      let Schedules = await pool.request().execute("GetAllSchedules");
      return Schedules.recordset;
    } catch (error) {
      console.log("============ERROR============");
      console.log("Error in DeleteScheduleService.js");
      console.log("============ERROR============");
      console.log(error);
      console.log("");
    }
}

async function DeleteSchedule(SchedID) {
    try {
      let pool = await sql.connect(config);
      let Schedules = await pool.request().input("SchedID", sql.Int, SchedID).execute("DeleteSchedules");
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
    DeleteSchedule: DeleteSchedule,
}