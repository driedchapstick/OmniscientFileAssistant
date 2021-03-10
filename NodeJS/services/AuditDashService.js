const sql = require("mssql");
const config = require("./dbconfig");

async function getCompsTable() {
  let blankComps = [
    {
      CompID: "",
      CompName: "",
      IPAddr: "",
      SchedID: "",
      SchedName: "",
    },
  ];
  try {
    let pool = await sql.connect(config);
    let compsTable = await pool.request().execute("GetCompsTable");
    let iterator = 0;
    compsTable.recordset.forEach(function (row) {
      blankComps[iterator] = { ...row };
      iterator++;
    });
    return blankComps;
  } catch (error) {}
}
async function getNotCompsTable() {
  let blankNotComps = [
    {
      CompID: "",
      CompName: "",
      IPAddr: "",
    },
  ];
  try {
    let pool = await sql.connect(config);
    let compsNotTable = await pool.request().execute("GetNotCompsTable");
    let iterator = 0;
    compsNotTable.recordset.forEach(function (row) {
      blankNotComps[iterator] = { ...row };
      iterator++;
    });
    return blankNotComps;
  } catch (error) {}
}
async function getSchedsTable() {
  let blankScheds = [
    {
      SchedID: "",
      SchedName: "",
      Count: "",
    },
  ];
  try {
    let pool = await sql.connect(config);
    let schedsTable = await pool.request().execute("GetSchedsTable");
    let iterator = 0;
    schedsTable.recordset.forEach(function (row) {
      blankScheds[iterator] = { ...row };
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
