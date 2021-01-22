const sql = require("mssql");
const config = require("./dbconfig");
const blankRecent1 = [
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

function initalLoad() {
  return blankRecent;
}

function initalLoad() {
  return blankRecent1;
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
    console.log("===============");
    console.log("THE QUERY");
    console.log("");
    console.log(tempQuery);
    console.log("===============");
    console.log("");
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
      console.log(specialOutput[iterator]);
      iterator++;
    });
    return specialOutput;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  searchForMiiFiles: searchForMiiFiles,
  initalLoad: initalLoad,
};
