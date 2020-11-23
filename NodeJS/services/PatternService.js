const config = require("./dbconfig");
const sql = require("mssql");
var blankPattern = [
  {
    CriteriaName: "ERROR",
  },
];

var Patterns = "SELECT CriteriaName FROM MatchCriteria;";
var theOutput;
var initialQuery =
  "SELECT FoundFiles.FileName, FoundFiles.FilePath, FoundFiles.FileExt, FoundFiles.CompName, FoundFiles.FileCreator, FoundFiles.FileCreated, FoundFiles.FileModified, FoundFiles.FileSize, '' AS Download FROM FoundFiles INNER JOIN FlaggedFiles ON FoundFiles.FileID = FlaggedFiles.FileID INNER JOIN MatchCriteria ON FlaggedFiles.CriteriaID = MatchCriteria.CriteriaID WHERE CriteriaName=";
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
async function getFlaggedFiles(subpage) {
  try {
    theOutput = [
      {
        FileID: "",
        FileName: "",
        FilePath: "",
        FileExt: "",
        CompName: "",
        FileCreator: "",
        FileCreated: "",
        FileModified: "",
        FileSize: "",
        Download: "",
      },
    ];
    let tempQuery = initialQuery + "'" + subpage + "'";
    let pool = await sql.connect(config);
    let theseFlaggedFiles = await pool.request().query(tempQuery);
    let it = 0;
    theseFlaggedFiles.recordset.forEach(function (row) {
      theOutput[it] = { ...row };
      theOutput[it].Download =
        theOutput[it].FilePath + "\\" + theOutput[it].FileName;
      console.log(theOutput[it]);
      it++;
    });
    return theOutput;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getPatternsTable: getPatternsTable,
  getFlaggedFiles: getFlaggedFiles,
};
