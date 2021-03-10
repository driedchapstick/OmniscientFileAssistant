const config = require("./dbconfig");
const sql = require("mssql");
const blankPattern = [
  {
    CriteriaName: "ERROR",
  },
];


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
    let MatchCriteria =[{CriteriaID: "", CriteriaName: "",},];
    let pool = await sql.connect(config);
    let recentFoundFiles = await pool.request().execute("GetPatternsDashboard");
    let iterator = 0;
    recentFoundFiles.recordset.forEach(function (row) {
      MatchCriteria[iterator] = { ...row };
      iterator++;
    });
    return MatchCriteria;
  } catch (error) {
    console.log(error);
  }
}
async function getFlaggedFiles(subpage) {
  try {
    let theOutput = [
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
        BackupData: "",
      },
    ];
    let pool = await sql.connect(config);
    let theseFlaggedFiles = await pool.request().input("PatternName", sql.NVarChar, subpage).execute("GetSpecificPatternsPage");
    let i = 0;
    theseFlaggedFiles.recordset.forEach(function (row) {
      theOutput[i] = { ...row };
      i++;
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
