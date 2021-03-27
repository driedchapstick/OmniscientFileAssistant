const sql = require("mssql");
const config = require("./dbconfig");

function formatTime(theTime) {
  theTime = new Date((typeof theTime === "string" ? new Date(theTime) : theTime).toLocaleString("en-US", { timeZone: "GMT" }));
  theTime = theTime.toString();

  dayOf = theTime.indexOf(" ") + 1;
  theTime = theTime.substring(dayOf);

  zoneName = theTime.indexOf("(") - 1;
  theTime = theTime.substring(0, zoneName);

  zoneID = theTime.lastIndexOf(" ");
  theTime = theTime.substring(0, zoneID);

  return theTime;
}

function CheckEmptyInput(input) {
  if (input.length == 0) {
    return "%";
  } else {
    return input;
  }
}

function CheckEmptyTime(input) {
  if (input.length == 0) {
    return "1970-01-02";
  } else {
    return input;
  }
}

function CreateTimeRange(input) {
  let years = parseInt(input.substring(0, 5));
  let months = parseInt(input.substring(5, 7));
  let days = parseInt(input.substring(8));

  if (input == "1970-01-02") {
    let today = new Date().toISOString().slice(0, 10);
    return today;
  } else if (months == 01 || months == 03 || months == 05 || months == 07 || months == 08 || months == 10 || months == 12) {
    //Months with 31 days
    if (days + 1 > 31) {
      if (months + 1 > 12) {
        years += 1;
        return years + "-01-" + "01";
      } else {
        months += 1;
        return years + "-" + months + "-01";
      }
    } else {
      days += 1;
      return years + "-" + months + "-" + days;
    }
  } else if (months == 04 || months == 06 || months == 09 || months == 11) {
    //Months with 30 days
    if (days + 1 > 30) {
      if (months + 1 > 12) {
        years += 1;
        return years + "-01-" + "01";
      } else {
        months += 1;
        return years + "-" + months + "-01";
      }
    } else {
      days += 1;
      return years + "-" + months + "-" + days;
    }
  } else if (months == 02) {
    if (years % 4 == 0) {
      //February - 29 Days
      if (days + 1 > 29) {
        return years + "-03-01";
      } else {
        days += 1;
        return years + "-02-" + days;
      }
    } else {
      //February - 28 Days
      if (days + 1 > 28) {
        return years + "-03-01";
      } else {
        days += 1;
        return years + "-02-" + days;
      }
    }
  } else {
    let today = new Date().toISOString().slice(0, 10);
    return today;
  }
}

async function GetAllAuditFiles(){
  try{
    let pool = await sql.connect(config);
    let AuditFiles = await pool.request().execute("GetAllAuditFiles");
    return AuditFiles.recordset;
  }catch(error){
    console.log(error);
  }
}
async function GetAuditData(AuditID){
  try{
    let FileOut = [{ FileID: "",FileName: "",FilePath: "",FileExt: "",CompName: "",FileCreator: "",FileCreated: "",FileModified: "", FileSize: "",},];
    let AuditOut = [{AuditID: "", HistoryID: "", PrvHash: "", CurHash: "", AuditDate: "", AuditRepo: ""},];

    let pool = await sql.connect(config);
    let FileInfo = await pool.request().input("AuditID", sql.Int, AuditID).execute("GetSpecificFoundFile");
    let AuditInfo = await pool.request().input("AuditID", sql.Int, AuditID).execute("GetSpecificAuditsPage");

    let i = 0;
    FileInfo.recordset.forEach(function (row) {
      FileOut[i] = { ...row };
      FileOut[i].FileCreated = formatTime(FileOut[i].FileCreated);
      FileOut[i].FileModified = formatTime(FileOut[i].FileModified);
      i++;
    });

    let p = 0;
    AuditInfo.recordset.forEach(function (row) {
      AuditOut[p] = { ...row };
      AuditOut[p].AuditDate = formatTime(AuditOut[p].AuditDate);
      p++;
    });

    return [FileOut, AuditOut];
  }catch(error){
    console.log(error);
  }
  
}
module.exports = {
  GetAllAuditFiles: GetAllAuditFiles,
  GetAuditData: GetAuditData,
};
