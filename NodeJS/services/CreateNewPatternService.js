const sql = require("mssql");
const config = require("./dbconfig");
const blankTerms = [
  {
    TermID: "",
    TermType: "",
    TermName: "",
    TermValue: "",
  },
];

async function getTerms() {
  try {
    specialOutput = [
      {
        TermID: "",
        TermType: "",
        TermName: "",
        TermValue: "",
      },
    ];
    let pool = await sql.connect(config);
    let foundTerms = await pool.request().execute("GetAllTerms");
    let iterator = 0;
    foundTerms.recordset.forEach(function (row) {
      blankTerms[iterator] = { ...row };
      iterator++;
    });
    return blankTerms;
  } catch (error) {
    console.log(error);
  }
}

async function addMatchCriteria(CriteriaName, BackupQ) {
  let BackupN;
  if (BackupQ == "yes") {
    BackupN = 1;
  } else {
    BackupN = 0;
  }
  let pool = await sql.connect(config);
  let AddedMatchCriteria = await pool.request().input("CriteriaName", sql.NVarChar, CriteriaName).input("BackupData", sql.Bit, BackupN).execute("AddMatchCriteria");
  return AddedMatchCriteria.recordset[0].CriteriaID;
}
async function addCriteriaTerms(CriteriaID, AllTerms) {
  let pool = await sql.connect(config);
  if(typeof AllTerms === 'object'){
    AllTerms.forEach(async (element) => {
      await pool.request().input("CriteriaID", sql.Int, CriteriaID).input("TermID", sql.Int, element).execute("AddCriteriaTerms");
    });
  }else if(typeof AllTerms === 'string'){
    await pool.request().input("CriteriaID", sql.Int, CriteriaID).input("TermID", sql.Int, AllTerms).execute("AddCriteriaTerms");
  }
  else{
    console.log("ERROR: The terms that were attempted to be added to CriteriaTerms was not an Object or String.");
    console.log("ERROR: Object == Multiple Terms    String == Single Term");
    console.log("ERROR: The user must have submitted something purposefully incorrect or malicious.");
    console.log("ERROR: The submitted terms will be below this line.");
    console.log(typeof AllTerms);
    console.log("");
  }
  
}
module.exports = {
  getTerms: getTerms,
  addMatchCriteria: addMatchCriteria,
  addCriteriaTerms: addCriteriaTerms,
};
