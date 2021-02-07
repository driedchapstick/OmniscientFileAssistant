const sql = require("mssql");
const config = require("./dbconfig");

var blankComps = [
  {
    CompID: "",
    CompName: "",
    IPAddr: "",
    SchedID: "",
    SchedName: "",
  },
];

var blankNotComps = [
  {
    CompID: "",
    CompName: "",
    IPAddr: "",
  },
];

var blankScheds = [
  {
    SchedID: "",
    SchedName: "",
    Count: "",
  },
];

async function getCompsTable() {
  try {
    let pool = await sql.connect(config);
    let compsTable = await pool.request().execute("GetCompsTable");
    let iterator = 0;
    compsTable.recordset.forEach(function (row) {
      blankComps[iterator] = {...row};
      iterator++;
    });
    return blankComps;
  } catch (error) {}
}
async function getNotCompsTable() {
  try {
    let pool = await sql.connect(config);
    let compsNotTable = await pool.request().execute("GetNotCompsTable");
    let iterator = 0;
    compsNotTable.recordset.forEach(function (row) {
      blankNotComps[iterator] = {...row};
      iterator++;
    });
    return blankNotComps;
  } catch (error) {}
}
async function getSchedsTable() {
  try {
    let pool = await sql.connect(config);
    let schedsTable = await pool.request().execute("GetSchedsTable");
    let iterator = 0;
    schedsTable.recordset.forEach(function (row) {
      blankScheds[iterator] = {...row};
      iterator++;
    });
    return blankScheds;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getCompsTable: getCompsTable,
  getSchedsTable: getSchedsTable,
  getNotCompsTable: getNotCompsTable,
};
