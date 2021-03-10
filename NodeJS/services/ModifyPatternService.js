const sql = require("mssql");
const config = require("./dbconfig");

async function GetPatternsTable() {
  try {
    let MatchCriteria = [{CriteriaID: "", CriteriaName: "",},];
    let pool = await sql.connect(config);
    let recentFoundFiles = await pool.request().execute("GetPatternsDashboard");
    let iterator = 0;
    recentFoundFiles.recordset.forEach(function (row) {
      MatchCriteria[iterator] = { ...row };
      iterator++;
    });
    return MatchCriteria;
  } catch (error) {
    console.log(error);
  }
}

async function GetCurPatternOptions(CriteriaID, ConfirmString){
  try{
    let pool = await sql.connect(config);
    let matchCriteria = await pool.request().input("CriteriaID", sql.Int, CriteriaID).execute("GetCurPatternOptions");
    let foundTerms = await pool.request().execute("GetAllTerms");
    let criteriaTerms = await pool.request().input("CriID", sql.Int, CriteriaID).execute("GetSpecificCriteriaTerm");
    return [matchCriteria.recordset, foundTerms.recordset, criteriaTerms.recordset, ConfirmString];
  }catch(error){
    console.log(error);
  }
}
function CorrectBackupData(BackupData){
  if (BackupData == "true") {
    console.log(BackupData);
    return 1;
  } else {
    console.log(BackupData);
    return 0;
  }
}
async function UpdateThePattern(CriteriaID, CriteriaName, BackupData, CriteriaTerms){
  try{
    let pool = await sql.connect(config);
    await pool.request().input("CriteriaID", sql.Int, CriteriaID).input("CriteriaName", sql.NVarChar, CriteriaName).input("BackupData", sql.Bit, CorrectBackupData(BackupData)).execute("UpdateMatchCriteria");
    await pool.request().input("CriteriaID", sql.Int, CriteriaID).execute("DeleteCriteriaTerms");
    if(typeof CriteriaTerms === 'object'){
      CriteriaTerms.forEach(async (element) => {await pool.request().input("CriteriaID", sql.Int, CriteriaID).input("TermID", sql.Int, element).execute("AddCriteriaTerms");});
    }else if(typeof CriteriaTerms === 'string'){
      await pool.request().input("CriteriaID", sql.Int, CriteriaID).input("TermID", sql.Int, CriteriaTerms).execute("AddCriteriaTerms");
    }else{throw error}
    return GetCurPatternOptions(CriteriaID, "Update Successful")
  }catch(error){
    console.log("ERROR ERROR ERROR ERROR ERROR\r\nERROR ERROR ERROR ERROR ERROR\r\nERROR ERROR ERROR ERROR ERROR\r\n\r\n");
    console.log(error);
    console.log("");
    return GetCurPatternOptions(CriteriaID, "Update Failed")
  }
}
module.exports = {
  GetPatternsTable: GetPatternsTable,
  GetCurPatternOptions: GetCurPatternOptions,
  UpdateThePattern: UpdateThePattern,
};
