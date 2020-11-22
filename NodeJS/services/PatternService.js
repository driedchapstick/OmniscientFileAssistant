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
    Download: "ERROR",
  },
];

async function getPatternsTable() {
  try {
    let pool = await sql.connect(config);
    let patternData = await pool.request().execute("GetPatternsTable");
    let iterator = 0;
    patternData.recordset.forEach(function (row) {
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
