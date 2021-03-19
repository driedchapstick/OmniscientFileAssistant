const sql = require("mssql");
const config = require("./dbconfig");

async function InitialLoad(){
  try{
    let pool = await sql.connect(config);
    let Patterns = await pool.request().execute("GetAllAuditFiles");
    return Patterns.recordset;
  }catch(error){
    console.log("============ERROR============");
    console.log("Error in InitialLoad of DeleteAuditService.js");
    console.log("============ERROR============");
    console.log(error);
    console.log("");
  }
}

function CheckID(input) {
  let reggie = new RegExp("^([0-9]{1,})$");
  if (reggie.test(input) == false) {
    throw "ERROR: THIS IS NOT A VALID AuditID.\r\nAuditID: "+input+"\r\n";
  }else{
    return input;
  }
}

async function DeleteAudit(AuditID){
  try{
    let pool = await sql.connect(config);
    await pool.request().input("AuditID", sql.Int, CheckID(AuditID)).execute("DeleteAuditFiles");
    let otherPatterns = await InitialLoad();
    return [otherPatterns, "SUCCESS: Audit Deleted"];
  }catch(error){
    console.log("============ERROR============");
    console.log("Error in DeleteAudit of DeleteAuditService.js");
    console.log("============ERROR============");
    console.log(error);
    console.log("");
    let otherPatterns = await InitialLoad();
    return [otherPatterns, "ERROR: Audit Not Deleted"];
  }
}
module.exports = {
  InitialLoad: InitialLoad,
  DeleteAudit: DeleteAudit,
};
