const config = require("./dbconfig");
const sql = require("mssql");
var blankPattern = [
  {
    CriteriaName: "ERROR",
  },
];

var Patterns = "SELECT CriteriaName FROM MatchCriteria;";

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
/*
async function getPatternsTable() {
  try {
    let pool = await sql.connect(config);
    //parse the URL to retrieve the last section to retreive PAtterns
    let patternData = await pool.request().query("GetPatternsTable");
    let iterator = 0;
    patternData.recordset.forEach(function (row) {
      blankPattern[iterator] = { ...row };
      iterator++;
    });
    return blankPattern;
  } catch (error) {
    console.log(error);
  }
}*/
async function getPatternsTable() {
  try {
    let pool = await sql.connect(config);
    let recentFoundFiles = await pool.request().query(Patterns);
    let iterator = 0;
    recentFoundFiles.recordset.forEach(function (row) {
      blankPattern[iterator] = { ...row };

      iterator++;
    });
    return blankPattern;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getPatternsTable: getPatternsTable,
};
