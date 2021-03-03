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

async function GetCurPatternOptions(CriteriaID){
  try{
    let values = [{CriteriaID: "", CriteriaName: "", BackupData: "",},];
    let pool = await sql.connect(config);
    let matchCriteria = await pool.request().input("CriteriaID", sql.Int, CriteriaID).execute("GetCurPatternOptions");
    let foundTerms = await pool.request().execute("GetAllTerms");
    let criteriaTerms = await pool.request().input("CriID", sql.Int, CriteriaID).execute("GetSpecificCriteriaTerm");
    return [matchCriteria.recordset, foundTerms.recordset, criteriaTerms.recordset, ""];
  }catch(error){
    console.log(error);
  }
}
module.exports = {
  GetPatternsTable: GetPatternsTable,
  GetCurPatternOptions: GetCurPatternOptions,
};
