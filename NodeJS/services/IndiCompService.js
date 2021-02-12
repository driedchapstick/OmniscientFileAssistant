const sql = require("mssql");
const config = require("./dbconfig");

var blankScheds = [
  {
    SchedID: "",
    SchedName: "",
    BaseTime: "",
    InterName: "",
  },
];
var stringCurSched = "";

async function getSchedsTable() {
  try {
    let pool = await sql.connect(config);
    let schedData = await pool.request().execute("GetDesiredSchedsTable");
    let iterator = 0;
    schedData.recordset.forEach(function (row) {
      blankScheds[iterator] = { ...row };
      iterator++;
    });
    return blankScheds;
  } catch (error) {
    console.log(error);
  }
}
async function getCurSched(SubPageID) {
  try {
    let pool = await sql.connect(config);
    let schedData = await pool.request().input("CompID", sql.Int, SubPageID).execute("GetCurSched");
    return schedData.recordset[0].SchedName;
  } catch (error) {
    if (error instanceof TypeError) {
      return "";
    } else {
      console.log(error);
    }
  }
}

async function addCompSchedules(CompID, SchedID) {
  try {
    let pool = await sql.connect(config);
    await pool.request().input("CompID", sql.Int, CompID).input("SchedID", sql.Int, SchedID).execute("AddCompSchedules");
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getSchedsTable: getSchedsTable,
  getCurSched: getCurSched,
  addCompSchedules: addCompSchedules,
};
