const sql = require("mssql");
const config = require("./dbconfig");

async function InitialLoad(ConfirmString){
  try{
    let pool = await sql.connect(config);
    let termTypes = await pool.request().execute("GetAllTermTypes");
    return [[{TermName: "", TermValue: ""}], termTypes.recordset, ConfirmString];
  }catch(error){
    console.log("ERROR ERROR ERROR ERROR ERROR\r\nERROR ERROR ERROR ERROR ERROR\r\nERROR ERROR ERROR ERROR ERROR\r\n\r\n");
    console.log(error);
    console.log("");
    return [[{TermName: "", TermValue: ""}], [{TermID: "", TermDesc: ""}], "ERROR: Could not retrieve term types from the database."];
  }
}
async function AddTerm(TermType, TermName, TermValue, ConfirmString){
  try{
    let pool = await sql.connect(config);
    await pool.request().input("TermType", sql.Int, TermType).input("TermName", sql.NVarChar, TermName).input("TermValue", sql.NVarChar, TermValue).execute("AddTerms");
    return InitialLoad(ConfirmString);
  }catch(error){
    console.log("ERROR ERROR ERROR ERROR ERROR\r\nERROR ERROR ERROR ERROR ERROR\r\nERROR ERROR ERROR ERROR ERROR\r\n\r\n");
    console.log(error);
    console.log("");
    return InitialLoad("ERROR: Could not add term to the database.");
  }
}
module.exports = {
  InitialLoad: InitialLoad,
  AddTerm: AddTerm,
};
