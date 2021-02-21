const sql = require("mssql");
const config = require("./dbconfig");

async function InitialLoad(SchedID) {
  try {
    let pool = await sql.connect(config);
    let SchedData = await pool.request().input("SchedID", sql.Int, SchedID).execute("GetSpecificSchedule");
    let Intervals = await pool.request().execute("GetAllIntervals");
    let SchedsComps = await pool.request().input("SchedID", sql.Int, SchedID).execute("GetSchedsComps");
    return [SchedData.recordset, Intervals.recordset, SchedsComps.recordset];
  } catch (error) {
    console.log("============ERROR============");
    console.log("Error in IndiSchedService.js");
    console.log("============ERROR============");
    console.log(error);
    console.log("");
  }
}

//For SchedID and InterID
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

async function UpdateSchedule(SchedID, SchedName, BaseTime, InterID) {
  SchedID = CheckID(SchedID);
  SchedName = CheckSchedName(SchedName);
  BaseTime = CheckBaseTime(BaseTime);
  InterID = CheckID(InterID);
  try{
    if(SchedID != "ThisFailedSoWeAreSupplyingThisValue" && SchedName != "ThisFailedSoWeAreSupplyingThisValue" && BaseTime != "ThisFailedSoWeAreSupplyingThisValue" && InterID != "ThisFailedSoWeAreSupplyingThisValue"){
      let pool = await sql.connect(config);
      await pool.request()
        .input("SchedID", sql.Int, SchedID)
        .input("SchedName", sql.NVarChar, SchedName)
        .input("BaseTime", sql.SmallInt, BaseTime)
        .input("InterID", sql.Int, InterID)
        .execute("UpdateSchedule");
      return "Update Successful"
    }
  }catch(error){
    console.log(error);
    return "Update Failed"
  }
}

module.exports = {
  InitialLoad: InitialLoad,
  UpdateSchedule: UpdateSchedule,
};
