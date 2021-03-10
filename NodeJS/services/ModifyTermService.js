const sql = require("mssql");
const config = require("./dbconfig");

async function GetAllTerms(){
  try{
    let pool = await sql.connect(config);
    let theTerms = await pool.request().execute("GetAllTerms");
    return theTerms.recordset;
  }catch(error){
    console.log("ERROR ERROR ERROR ERROR ERROR\r\nERROR ERROR ERROR ERROR ERROR\r\nERROR ERROR ERROR ERROR ERROR\r\n\r\n");
    console.log(error);
    console.log("");
  }
}
async function GetCurTermOptions(TermID, ConfirmString){
  try{
    let pool = await sql.connect(config);
    let term = await pool.request().input("TermID", sql.Int, TermID).execute("GetCurTermOptions");
    let termTypes = await pool.request().execute("GetAllTermTypes");
    let type = await pool.request().input("TermID", sql.Int, TermID).execute("GetSpecificTermType");
    
    return [term.recordset, termTypes.recordset, type.recordset, ConfirmString];
  }catch(error){
    console.log("ERROR ERROR ERROR ERROR ERROR\r\nERROR ERROR ERROR ERROR ERROR\r\nERROR ERROR ERROR ERROR ERROR\r\n\r\n");
    console.log(error);
    console.log("");
  }
}
async function UpdateTheTerm(TermID, TermType, TermName, TermValue,){
  try{
    let pool = await sql.connect(config);
    await pool.request()
      .input("TermID", sql.Int, TermID)
      .input("TermType", sql.Int, TermType)
      .input("TermName", sql.NVarChar, TermName)
      .input("TermValue", sql.NVarChar, TermValue)
    .execute("UpdateTerm");
    return GetCurTermOptions(TermID, "Update Successful");
  }catch(error){
    console.log("ERROR ERROR ERROR ERROR ERROR\r\nERROR ERROR ERROR ERROR ERROR\r\nERROR ERROR ERROR ERROR ERROR\r\n\r\n");
    console.log(error);
    console.log("");
    return GetCurTermOptions(TermID, "Update Failed");
  }
}
module.exports = {
  GetAllTerms: GetAllTerms,
  GetCurTermOptions: GetCurTermOptions,
  UpdateTheTerm: UpdateTheTerm,
};
