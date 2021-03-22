const sql = require("mssql");
const config = require("./dbconfig");
async function InitialLoad(){
  try{
    let pool = await sql.connect(config);
    let Patterns = await pool.request().execute("GetAllTerms");
    return Patterns.recordset;
  }catch(error){
    console.log("============ERROR============");
    console.log("Error in InitialLoad of DeleteTermService.js");
    console.log("============ERROR============");
    console.log(error);
    console.log("");
  }
}

function CheckID(input) {
  let reggie = new RegExp("^([0-9]{1,})$");
  if (reggie.test(input) == false) {
    throw "ERROR: THIS IS NOT A VALID CriteriaID.\r\nCriteriaID: "+input+"\r\n";
  }else{
    return input;
  }
}

async function DeleteTerm(TermID){
  try{
    let pool = await sql.connect(config);
    await pool.request().input("TermID", sql.Int, CheckID(TermID)).execute("DeleteTerms");
    let otherPatterns = await InitialLoad();
    return [otherPatterns, "SUCCESS: Term Deleted"];
  }catch(error){
    console.log("============ERROR============");
    console.log("Error in DeleteTerm of DeleteTermService.js");
    console.log("============ERROR============");
    console.log(error);
    console.log("");
    let otherPatterns = await InitialLoad();
    return [otherPatterns, "ERROR: Term Not Deleted"];
  }
}

module.exports = {
  InitialLoad: InitialLoad,
  DeleteTerm: DeleteTerm,
};
