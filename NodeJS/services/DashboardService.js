const config = require("./dbconfig");
const sql = require("mssql");
var blankRecent = [
  {
    FileID: "ERROR",
    FileName: "ERROR",
    FilePath: "ERROR",
    FileExt: "ERROR",
    CompName: "ERROR",
    FileCreator: "ERROR",
    FileCreated: "ERROR",
    FileModified: "ERROR",
    FileSize: "ERROR",
  },
];
var blankSched = [
  {
    SchedName: "ERROR",
    BaseTime: "ERROR",
    InterName: "ERROR",
    NumberOfComp: "ERROR",
  },
];

function formatTime(theTime) {
  theTime = theTime.toString();

  dayOf = theTime.indexOf(" ") + 1;
  theTime = theTime.substring(dayOf);

  zoneName = theTime.indexOf("(") - 1;
  theTime = theTime.substring(0, zoneName);

  zoneID = theTime.lastIndexOf(" ");
  theTime = theTime.substring(0, zoneID);

  return theTime;
}

async function getRecentFoundFiles() {
  try {
    let pool = await sql.connect(config);
    let recentFoundFiles = await pool
      .request()
      .input("ColNum", sql.Int, 10)
      .execute("GetTopFF");
    let iterator = 0;
    recentFoundFiles.recordset.forEach(function (row) {
      blankRecent[iterator] = { ...row };
      blankRecent[iterator].FileName = blankRecent[iterator].FileName;
      blankRecent[iterator].FilePath = blankRecent[iterator].FilePath;
      blankRecent[iterator].FileExt = blankRecent[iterator].FileExt;
      blankRecent[iterator].CompName = blankRecent[iterator].CompName;
      blankRecent[iterator].FileCreator = blankRecent[iterator].FileCreator;
      blankRecent[iterator].FileCreated = formatTime(
        blankRecent[iterator].FileCreated
      );
      blankRecent[iterator].FileModified = formatTime(
        blankRecent[iterator].FileModified
      );
      blankRecent[iterator].FileSize = blankRecent[iterator].FileSize;
      iterator++;
    });
    return blankRecent;
  } catch (error) {
    console.log(error);
  }
}
async function getScheduleTableData() {
  try {
    let pool = await sql.connect(config);
    let scheduleData = await pool.request().execute("GetScheduleTableData");
    let iterator = 0;
    scheduleData.recordset.forEach(function (row) {
      blankSched[iterator] = { ...row };
      iterator++;
    });
    return blankSched;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getRecentFoundFiles: getRecentFoundFiles,
  getScheduleTableData: getScheduleTableData,
};
