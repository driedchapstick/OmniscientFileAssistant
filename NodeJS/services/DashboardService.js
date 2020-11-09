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

function formatTime(theTime) {
  theTime = theTime.toString();

  dayOf = theTime.indexOf(" ") + 1;
  theTime = theTime.substring(dayOf);

  zoneName = theTime.indexOf("(") - 1;
  theTime = theTime.substring(0, zoneName);

  zoneID = theTime.lastIndexOf(" ");
  theTime = theTime.substring(0, zoneID);

  console.log(theTime);
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

      blankRecent[iterator].FileCreated = formatTime(
        blankRecent[iterator].FileCreated
      );
      blankRecent[iterator].FileModified = formatTime(
        blankRecent[iterator].FileModified
      );
      iterator++;
    });
    //console.log(blankRecent);
    return blankRecent;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getRecentFoundFiles: getRecentFoundFiles,
};
