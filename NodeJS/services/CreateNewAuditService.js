const sql = require("mssql");
const config = require("./dbconfig");
const blankRecent = [
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
];
var specialOutput;
var initialQuery =
  "SELECT FoundFiles.FileID, FoundFiles.FileName, FoundFiles.FilePath, FoundFiles.FileExt, FoundFiles.CompName, FoundFiles.FileCreator, FoundFiles.FileCreated, FoundFiles.FileModified, FoundFiles.FileSize FROM FoundFiles WHERE ";
function initalLoad() {
  return blankRecent;
}
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
async function searchForMiiFiles(whereClause) {
  try {
    specialOutput = [
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
      },
    ];
    let tempQuery = initialQuery + whereClause;
    let pool = await sql.connect(config);
    let recentFoundFiles = await pool.request().query(tempQuery);
    let iterator = 0;
    recentFoundFiles.recordset.forEach(function (row) {
      specialOutput[iterator] = { ...row };
      specialOutput[iterator].FileCreated = formatTime(
        specialOutput[iterator].FileCreated
      );
      specialOutput[iterator].FileModified = formatTime(
        specialOutput[iterator].FileModified
      );
      iterator++;
    });
    return specialOutput;
  } catch (error) {
    console.log(error);
  }
}

async function addAuditFile(AuditName, FileID) {
  let pool = await sql.connect(config);
  let AddedAudits = await pool
    .request()
    .input("AuditName", sql.NVarChar, AuditName)
    .input("FileID", sql.Int, FileID)
    .execute("AddAuditFiles");
}

module.exports = {
  searchForMiiFiles: searchForMiiFiles,
  initalLoad: initalLoad,
  addAuditFile: addAuditFile,
};
