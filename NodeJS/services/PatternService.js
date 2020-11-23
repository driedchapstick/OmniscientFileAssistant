const config = require("./dbconfig");
const sql = require("mssql");
var blankPattern = [
  {
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

var Patterns =
  "SELECT FoundFiles.FileName, FoundFiles.FilePath, FoundFiles.FileExt, FoundFiles.CompName, FoundFiles.FileCreator, FoundFiles.FileCreated, FoundFiles.FileModified, FoundFiles.FileSize, '' AS Download FROM FoundFiles INNER JOIN FlaggedFiles ON FoundFiles.FileID = FlaggedFiles.FileID INNER JOIN MatchCriteria ON FlaggedFiles.CriteriaID = MatchCriteria.CriteriaID WHERE CriteriaName = 'Demonstration';";

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
      blankPattern[iterator].FileName = blankPattern[iterator].FileName;
      blankPattern[iterator].FilePath = blankPattern[iterator].FilePath;
      blankPattern[iterator].FileExt = blankPattern[iterator].FileExt;
      blankPattern[iterator].CompName = blankPattern[iterator].CompName;
      blankPattern[iterator].FileCreator = blankPattern[iterator].FileCreator;
      blankPattern[iterator].FileCreated = formatTime(
        blankPattern[iterator].FileCreated
      );
      blankPattern[iterator].FileModified = formatTime(
        blankPattern[iterator].FileModified
      );
      blankPattern[iterator].FileSize = blankPattern[iterator].FileSize;
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
