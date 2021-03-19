const sql = require("mssql");
const config = require("./dbconfig");

async function InitialLoad(){
  try{
    let pool = await sql.connect(config);
    let Patterns = await pool.request().execute("GetPatternsDashboard");
    return Patterns.recordset;
  }catch(error){
    console.log("============ERROR============");
    console.log("Error in InitialLoad of DeletePatternService.js");
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

async function DeletePattern(CriteriaID){
  try{
    let pool = await sql.connect(config);
    await pool.request().input("CriteriaID", sql.Int, CheckID(CriteriaID)).execute("DeleteMatchCriteria");
    let otherPatterns = await InitialLoad();
    return [otherPatterns, "SUCCESS: Pattern Deleted"];
  }catch(error){
    console.log("============ERROR============");
    console.log("Error in DeletePattern of DeletePatternService.js");
    console.log("============ERROR============");
    console.log(error);
    console.log("");
    let otherPatterns = await InitialLoad();
    return [otherPatterns, "ERROR: Pattern Not Deleted"];
  }
}
module.exports = {
  InitialLoad: InitialLoad,
  DeletePattern: DeletePattern,
};
