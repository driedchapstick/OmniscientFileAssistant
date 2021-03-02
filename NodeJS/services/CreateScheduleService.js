const sql = require("mssql");
const config = require("./dbconfig");

async function InitialLoad() {
    try {
      let pool = await sql.connect(config);
      let Intervals = await pool.request().execute("GetAllIntervals");
      return Intervals.recordset;
    } catch (error) {
      console.log("============ERROR============");
      console.log("Error in CreateScheduleService.js");
      console.log("============ERROR============");
      console.log(error);
      console.log("");
    }
  }
function CheckID(input) {
  let reggie = new RegExp("^([0-9]{1,})$");
  if (reggie.test(input) == false) {
    return "ThisFailedSoWeAreSupplyingThisValue";
  }else{
    return input;
  }
  
}
function CheckSchedName(input) {
  let reggie = new RegExp("^([a-zA-Z0-9_\\-\\.\\/\\\ ]{1,20})$");
  if (reggie.test(input) == false) {
    return "ThisFailedSoWeAreSupplyingThisValue";
  }else{
    return input;
  }
  
}
function CheckBaseTime(input) {
  let reggie = new RegExp("^([0-9]{1,4})$");
  if (reggie.test(input) == false) {
    return "ThisFailedSoWeAreSupplyingThisValue";
  }else{
    return input;
  }
  
}
async function CreateSchedule(SchedName, BaseTime, InterID) {
    SchedName = CheckSchedName(SchedName);
    BaseTime = CheckBaseTime(BaseTime);
    InterID = CheckID(InterID);
  
    if(SchedName != "ThisFailedSoWeAreSupplyingThisValue" && BaseTime != "ThisFailedSoWeAreSupplyingThisValue" && InterID != "ThisFailedSoWeAreSupplyingThisValue"){
      let pool = await sql.connect(config);
      await pool.request()
        .input("SchedName", sql.NVarChar, SchedName)
        .input("BaseTime", sql.SmallInt, BaseTime)
        .input("InterID", sql.Int, InterID)
        .execute("AddSchedules");
    }
  }
module.exports = {
  InitialLoad: InitialLoad,
  CreateSchedule: CreateSchedule
}